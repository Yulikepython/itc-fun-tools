import React, { useEffect, useState } from "react"
import { Formik, Form, ErrorMessage, Field } from "formik"
import * as Yup from "yup"
import { requestToServer } from "../utils/axios"
import { ErrorHandler } from "../utils/ErrorHandler"

const validate = Yup.object({
    max: Yup.number().required("入力して下さい").positive().integer().lessThan(101, "100以上の文字列は生成できません。")
})

const getTrends = async (values, actions, setLoading) => {
    try {
        const res = await requestToServer("/tools/random-string-generate/", JSON.stringify(values))
        const generated = res.data.generated

        const resultDiv = document.getElementById("generatedResult")
        resultDiv.innerText = ""
        setTimeout(() => {
            setLoading(false)
            const newElem = document.createElement("div")
            newElem.innerText = generated
            resultDiv.appendChild(newElem)
        }, 500)
        actions.resetForm({
            values: {
                max: "30",
            }
        })
    } catch (err) {
        ErrorHandler(err)
    }
}

const RandomStringGenerator = ({ transferPage }) => {
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        transferPage()
    }, [])
    useEffect(() => {
        // if (loading){
        //     console.log("now loading...")
        // } else {
        //     console.log("not loading")
        // }
    }, [loading])

    // const copyToClipboard = e => {
    //     const generatedDiv = document.getElementById("generatedResult")
    //     const key = generatedDiv.innerText
    //     generatedDiv.ariaSelected()
    //     document.execCommand("Copy")
    // }

    return (
        <Formik
            initialValues={{
                "max": "30",
            }}
            validationSchema={validate}
            onSubmit={(values, actions, ...props) => {
                const resultDiv = document.getElementById("generatedResult")
                resultDiv.innerText = ""
                setLoading(true)
                getTrends(values, actions, setLoading)
            }
            }
        >
            <div className="top-random-container">
                <Form className="random-container">
                    <h3>ランダム文字列生成アプリ</h3>
                    <div>文字数を入力してください</div>
                    <Field
                        name="max"
                        type="number"
                        className="form-control my-3"
                    >
                    </Field>
                    <div className="text-danger mb-3 text-center">
                        <ErrorMessage name="max" />
                    </div>
                    <button type="submit">
                        ランダムな文字列を生成
                    </button>
                </Form>
                {loading && <div className="blink">generating...</div>}
                <div id="generatedResult">

                </div>
            </div>
        </Formik>
    )
}

export default RandomStringGenerator