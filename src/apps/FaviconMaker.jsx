import React, { useEffect } from "react"
import { Formik, Form } from "formik"
import { requestToServer } from "../utils/axios"
import { setTitleAndDescriptions } from "../utils/setTitleAndDescriptions"
import { ErrorHandler } from "../utils/ErrorHandler"



const submitHandler = async (values) => {
    try {
        let data = new FormData()
        const res = await requestToServer("/tools/faviconmaker/", data)
        const fileUrl = res.data
        var a = document.createElement("a")
        a.setAttribute("href", fileUrl)
        a.setAttribute("download", fileUrl)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

    } catch (err) {
        ErrorHandler(err)
    }
}

const FaviconMaker = () => {

    useEffect(() => {
        setTitleAndDescriptions("画像をHPで使えるfaviconへ変換", "【使用無料】favicon作成ツールです")
    })


    return (
        <>
            <Formik
                initialValues={{ img: "" }}
                onSubmit={(values) => {
                    submitHandler(values)
                }}
            >
                {(formProps) => {
                    const { setFieldValue } = formProps
                    return (
                        <div className="favicon-container">
                            <h2>Favicon生成アプリ</h2>
                            <Form>
                                <div>
                                    <input
                                        type="file" id="img_upload_favicon"
                                        onChange={(event) => {
                                            setFieldValue("img", event.currentTarget.files[0]);
                                        }} />
                                </div>
                                <button type="submit">変換する</button>
                            </Form>
                        </div>
                    )
                }}
            </Formik>
        </>
    )
}

export default FaviconMaker