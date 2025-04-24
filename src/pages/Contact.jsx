import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Formik, Form, Field, useField, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Alert } from "react-bootstrap"
import { axiosEmail } from "../utils/axios"
import { ErrorHandler } from "../utils/ErrorHandler"


const ContactInput = ({ label, ...props }) => {
    const [field] = useField(props)
    return (
        <div className="input-container">
            <label htmlFor={props.name}>{label}</label>
            <input {...field} {...props} />
        </div>
    )
}

const schema = Yup.object(({
    name: Yup.string().max(50, "名前にしては長すぎます").required("お名前は必須です"),
    email: Yup.string().email('不正なEメールアドレスです').required('Eメールアドレスは必須です'),
    // category: Yup.string().required("カテゴリーの選択は必須です"),
    message: Yup.string()
        .max(1000, "メッセージは1000文字以下でお願いします")
        .required("質問の内容を記述ください"),
}));

const emailForContact = async (values) => {
    try {

        const endpoint = "/api/email-endpoint/"

        const result = await axiosEmail.post(endpoint, JSON.stringify(values))
    } catch (err) {
        ErrorHandler(err)
    }
}

const Contact = ({ toggleMessage, transferPage }) => {
    let defaultValues = {
        name: "",
        category: "",
        email: "",
        phone: "",
        message: "",
    }
    const navigate = useNavigate()

    useEffect(() => {
        transferPage()

    }, [])
    return (
        <Formik
            initialValues={defaultValues}
            validationSchema={schema}
            onSubmit={(values, actions) => {
                const domainObj = { domain: window.location.host }
                // const head = process.env.NODE_ENV == "development" ? "http://": "https://"
                const newValues = { ...values, ...domainObj }
                emailForContact(newValues)
                setTimeout(() => {
                    navigate("/")
                    toggleMessage("お問い合わせありがとうございました", "success")
                }, 1000)
            }}
        >
            {({ values, setFieldValue, isSubmitting, ...props }) => {

                return (
                    <div className="contact-container">
                        <div className="contact-title">
                            <h3>Contact</h3>
                            <p>お気軽にお問い合わせください</p>
                        </div>
                        <div className="error-div">
                            <ErrorMessage name="name" render={msg => <Alert variant="danger">{msg}</Alert>} />
                            <ErrorMessage name="email" render={msg => <Alert variant="danger">{msg}</Alert>} />
                            <ErrorMessage name="message" render={msg => <Alert variant="danger">{msg}</Alert>} />
                        </div>
                        <Form className="contact-form">
                            <ContactInput
                                name="name"
                                placeholder="お名前..."
                                label="お名前"
                                type="text"
                            />
                            <ContactInput
                                name="email"
                                placeholder="youremail@example.com"
                                label="Eメールアドレス"
                                type="email"
                            />
                            <ContactInput
                                name="phone"
                                placeholder="電話番号"
                                label="電話番号"
                                type="text"
                            />
                            <div>
                                <label htmlFor="category">
                                    カテゴリー
                                </label>
                                <Field as="select" name="category">
                                    <option>質問カテゴリー...</option>
                                    <option value="当アプリについて">当サイトについて</option>
                                    <option value="ブログ(itc.tokyo)について">ブログ(https://itc.tokyo)について</option>
                                    <option value="仕事の依頼をしたい">仕事の依頼をしたい</option>
                                    <option value="その他">その他</option>
                                </Field>
                            </div>
                            <div>
                                <label htmlFor="message">
                                    ご質問内容
                                </label>
                                <Field name="message" placeholder="質問内容" className="contact-message">
                                    {({ field }) => (
                                        <textarea {...field} rows={7} />
                                    )}
                                </Field>
                            </div>
                            <div className="btn-div">
                                <button type="submit" className="contact-btn">お問い合わせ</button>
                            </div>
                        </Form>
                    </div>
                )
            }}
        </Formik>
    )
}

export default Contact