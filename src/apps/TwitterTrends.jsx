import React, { useEffect, useState } from "react"
import { Formik, Form, ErrorMessage, Field } from "formik"
import * as Yup from "yup"
import { requestToServer } from "../utils/axios"
import { ErrorHandler } from "../utils/ErrorHandler"


const validate = Yup.object({
    // place: Yup.string().max(100, "QRコードにしては長すぎます").required("入力して下さい")
})

const getTrends = async (values, actions, setLoading) => {
    try {
        const res = await requestToServer("/api/twitter-api/", JSON.stringify(values))
        const trends = res.data.trends_list
        // console.log(trends)

        const resultDiv = document.getElementById("trendsResult")
        while (resultDiv.firstChild) {
            resultDiv.removeChild(resultDiv.lastChild)
        }
        setTimeout(() => {
            setLoading(false)
            for (var i = 0; i < trends.length; i++) {
                const newElem = document.createElement("div")
                newElem.className = "trend-item"
                const ahref = document.createElement("a")
                ahref.href = trends[i].url
                ahref.target = "_blank"
                ahref.innerText = trends[i].name
                newElem.appendChild(ahref)
                resultDiv.appendChild(newElem)
            }
        }, 1000)
        actions.resetForm({
            values: {
                place: "",
            }
        })
    } catch (err) {
        ErrorHandler(err)
    }
}

const TwitterTrends = ({ transferPage }) => {
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
    return (
        <Formik
            initialValues={{
                "place": "日本"
            }}
            validationSchema={validate}
            onSubmit={(values, actions, ...props) => {
                setLoading(true)
                getTrends(values, actions, setLoading)
            }
            }
        >
            <div className="top-trends-container">
                <Form className="trends-container">
                    <h3>【Twitter】トレンド取得アプリ</h3>
                    <div>エリアを選択してください</div>
                    <Field
                        name="place"
                        as="select"
                        className="form-control my-3"
                    >
                        <option value="日本">日本</option>
                        <option value="東京">東京</option>
                        <option value="横浜">横浜</option>
                        <option value="千葉">千葉</option>
                        <option value="埼玉">埼玉</option>
                        <option value="大阪">大阪</option>
                        <option value="京都">京都</option>
                        <option value="名古屋">名古屋</option>
                        <option value="高松">高松</option>
                        <option value="仙台">仙台</option>
                        <option value="札幌">札幌</option>
                        <option value="福岡">福岡</option>
                        <option value="沖縄">沖縄</option>
                    </Field>
                    <div className="text-danger mb-3 text-center">
                        <ErrorMessage name="place" />
                    </div>
                    <button type="submit">
                        トレンドをGET
                    </button>
                </Form>
                {loading && <div className="blink">トレンド取得中...</div>}
                <div id="trendsResult">

                </div>
            </div>
        </Formik>
    )
}

export default TwitterTrends