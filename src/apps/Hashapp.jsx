import React, { useEffect, useState } from "react"
import { Formik, Form, ErrorMessage, Field } from "formik"
import * as Yup from "yup"
import { requestToServer } from "../utils/axios"
import { ErrorHandler } from "../utils/ErrorHandler"
import CryptoJS from 'crypto-js';


const validate = Yup.object({
    txt: Yup.string().max(1000, "1,000文字以下でお願いします。").required("ハッシュ化するテキストを入力してください。")
})

function generateHash(value) {
    return CryptoJS.SHA256(value)
}

const getHash = async (values, actions, setLoading) => {
    try {
        const generated = generateHash(values.txt);

        const resultDiv = document.getElementById("hashedResult")
        resultDiv.innerText = ""
        setTimeout(() => {
            setLoading(false)
            const newElem = document.createElement("div")
            newElem.innerText = generated
            resultDiv.appendChild(newElem)
        }, 500)
        actions.resetForm({
            values: {
                txt: "",
            }
        })
    } catch (err) {
        ErrorHandler(err)
    }
}

const Hashapp = ({ transferPage }) => {
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        transferPage()
    }, [])

    useEffect(() => {

    }, [loading])
    return (
        <Formik
            initialValues={{
                "txt": "",
            }}
            validationSchema={validate}
            onSubmit={(values, actions, ...props) => {
                setLoading(true)
                getHash(values, actions, setLoading)
            }
            }
        >
            <div className="top-hashapp-container">
                <Form className="mx-auto w-80">
                    <h1>ハッシュ化ツール</h1>
                    <div className="text-center">
                        ハッシュ化する文字列を入力
                    </div>

                    <Field
                        name="txt"
                        type="text"
                        placeholder="ハッシュ化したい文字を入力"
                        className="form-control my-3"
                    >
                    </Field>

                    <div className="text-danger error-text">
                        <ErrorMessage name="txt" />
                    </div>
                    <div className="text-center">
                        <button type="submit">ハッシュ化する
                        </button>
                    </div>
                </Form>
                {loading && <div className="blink">ハッシュ化
                    してます...</div>}
                <div id="hashedResult">

                </div>
            </div>

        </Formik>
    )
}

export default Hashapp