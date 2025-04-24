import React, { useEffect } from "react"
import { Formik, Form, ErrorMessage, Field } from "formik"
import * as Yup from "yup"
import { requestToServer } from "../utils/axios"
import { ErrorHandler } from "../utils/ErrorHandler"


const validate = Yup.object({
    value: Yup.string().max(100, "QRコードにしては長すぎます").required("入力して下さい")
})

const makeQR = async (values, actions) => {
    try {
        // axiosPost.defaults.headers["token"] = "kfasnfsdaifa1"
        const res = await requestToServer("/tools/qrmaker/", JSON.stringify(values))
        const imgPath = res.data.filepath
        let img_element = document.createElement('img')
        img_element.alt = 'QRコード' // 代替テキスト
        img_element.width = 250 // 横サイズ（px）
        img_element.height = 250 // 縦サイズ（px）
        let ahref_element = document.createElement("a")
        ahref_element.innerText = "画像を取得"
        var qrShowPng = document.getElementById("qrShowPng");
        img_element.src = imgPath // 画像パス                   
        var imgURL = document.getElementById("qrImgDownload")
        ahref_element.href = imgPath
        ahref_element.download = "qr.png"
        while (qrShowPng.firstChild) {
            qrShowPng.removeChild(qrShowPng.lastChild)
        }
        while (imgURL.firstChild) {
            imgURL.removeChild(imgURL.lastChild)
        }
        setTimeout(() => {
            qrShowPng.appendChild(img_element);
            imgURL.appendChild(ahref_element)
        }, 1000)
        actions.resetForm({
            values: {
                value: "",
            }
        })
    } catch (err) {
        ErrorHandler(err)
    }
}

const QRTopPage = ({ transferPage }) => {
    useEffect(() => {

        transferPage()
    }, [])
    return (
        <Formik
            initialValues={{
                "value": ""
            }}
            validationSchema={validate}
            onSubmit={(values, actions, ...props) => {
                makeQR(values, actions)
            }
            }
        >
            <div className="top-qr-container">
                <Form className="qr-container">
                    <h2>QRコード生成アプリ</h2>
                    <Field
                        name="value"
                        type="text"
                        placeholder="文字列を入力"
                        className="form-control my-3"
                    >
                    </Field>
                    <div className="text-danger mb-3 text-center">
                        <ErrorMessage name="value" />
                    </div>
                    <button type="submit">
                        QR生成
                    </button>
                </Form>
                <div id="qrShowPng"></div>
                <div id="qrImgDownload"></div>
            </div>
        </Formik>
    )
}

export default QRTopPage