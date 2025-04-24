import React, { useEffect } from "react"
import { requestToServer } from "../utils/axios"
import { Formik, Form, ErrorMessage, Field } from "formik"
import * as Yup from "yup"
import { HowToUseYearConverter } from "../components/YearConverterRefModal"
import { ErrorHandler } from "../utils/ErrorHandler"

//数字4桁、数字2桁、もしくはt, s, h, rから始まる
//ハイフンが多くても2個
//convertを押したら過去の表示を消す
const validate = Yup.object({
    // value: Yup.string().max(100, "年月日にしては長すぎます").required("入力して下さい"),
    value: Yup.string().test(
        'is-number-or-starts-with', '不正な文字列です。※使い方を参照してください。', (value) => {
            return isDigit(value) || canBeWareki(value);
        }
    )
})

const submitHandler = async (values, actions) => {
    const showResult = document.getElementById("showResultYearConverter")

    try {
        showResult.style.display = "none"
        while (showResult.firstChild) {
            showResult.removeChild(showResult.lastChild)
        }
        const res = await requestToServer("/tools/yearConverter/", JSON.stringify(values))
        const result = res.data
        var resultDiv = document.createElement("div")
        resultDiv.innerText = res.data
        showResult.appendChild(resultDiv)
        showResult.style.display = "flex"

        actions.resetForm({
            values: {
                value: "",
            }
        })

    } catch (err) {
        ErrorHandler(err)
    }
}

const YearConverter = ({ transferPage }) => {

    useEffect(() => {

        transferPage()
    }, [])
    return (
        <Formik
            initialValues={{
                "value": "",
            }}
            validationSchema={validate}
            onSubmit={(values, actions, ...props) => {
                submitHandler(values, actions)
            }
            }
        >
            {() => {
                return (
                    <div className="yearConverter-container">
                        <h2>西暦・和暦変換アプリ</h2>
                        <div className="how-to">
                            <button
                                type="button"
                                data-toggle="modal"
                                data-target="#howToUseYearConverter"
                                className="modalBtn-howto"
                            >
                                ※使い方はこちら
                            </button>
                        </div>
                        <Form>
                            <Field
                                name="value"
                                type="text"
                                placeholder="年-月-日"
                                className="form-control my-3"
                                id="input-datetime"
                            >
                            </Field>
                            <div className="yearConverter-error">
                                <ErrorMessage name="value" id="input-error" />
                            </div>
                            <button type="submit" id="convert-btn">
                                変換する
                            </button>
                        </Form>

                        <HowToUseYearConverter />
                        <div id="showResultYearConverter"></div>
                    </div>
                )
            }}
        </Formik>
    )
}

function isDigit(str) {
    return /^\d/.test(str);
}

function canBeWareki(str) {
    if (str.startsWith('t') || str.startsWith('s') || str.startsWith('h') || str.startsWith('r')) {
        return true;
    } else {
        return false;
    }
}

export default YearConverter