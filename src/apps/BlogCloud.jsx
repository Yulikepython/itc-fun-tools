import React, { useEffect, useState } from "react"
import { Formik, Form, ErrorMessage, Field } from "formik"
import * as Yup from "yup"
import { requestToServer } from "../utils/axios"
import { ErrorHandler } from "../utils/ErrorHandler"

// const absolute_uri = "http://localhost:8000"
// const absolute_uri = "https://api.itc-app.site"

const validate = Yup.object({
    url_: Yup.string().max(100, "URLにしては長すぎます").required("URLを入力して下さい")
})

const getWC = async (values, actions, setLoading) => {
    //ページをリセットする
    const showPng = document.getElementById("showPng")
    const imgURL = document.getElementById("imageURL")
    const showWords = document.getElementById("showWords")
    if (showWords != null) {
        showWords.style.display = "none"
        while (showWords.firstChild) {
            showWords.removeChild(showWords.lastChild)
        }
    }
    if (showPng != null) {
        while (showPng.firstChild) {
            showPng.removeChild(showPng.lastChild)
        }
    }
    if (imgURL != null) {
        while (imgURL.firstChild) {
            imgURL.removeChild(imgURL.lastChild)
        }
    }


    try {
        //リクエスト＆レスポンスの取得
        const res = await requestToServer('/api/blog-cloud/', JSON.stringify(values))
        // console.log(res)
        const imgPath = res.data.filepath
        const words = res.data.words
        const mc10 = words.slice(0, 9)
        //イメージエレメントの作成
        let img_element = document.createElement('img')
        img_element.alt = 'ブログイメージ' // 代替テキスト

        img_element.src = imgPath // 画像パス 

        //画像取得リンクの作成
        let ahref_element = document.createElement("a")
        ahref_element.innerText = "画像を取得"
        ahref_element.href = imgPath
        ahref_element.download = "page_img.png"

        //ワードリストエレメントの作成
        var h3 = document.createElement('h3')
        h3.innerText = "出現ワード"
        var uldiv = document.createElement('div');
        uldiv.className = "wordsList"
        mc10.map(word => {
            var div = document.createElement('div')
            div.className = "wordsList-row"
            var div1 = document.createElement('div')
            var div2 = document.createElement('div')
            div1.className = "word-title"
            div2.className = "word-numbers"
            div1.innerText = `${word[0]} :`
            div2.innerText = `${word[1]}回`
            uldiv.appendChild(div)
            div.appendChild(div1)
            div.appendChild(div2)

        })

        //作成したエレメントを配置していく

        setLoading(false)
        showWords.appendChild(h3)
        showWords.appendChild(uldiv)
        showPng.appendChild(img_element);
        imgURL.appendChild(ahref_element)
        showWords.style.display = "block"
        actions.resetForm({
            values: {
                url_: "",
                remove_: "",
            }
        })
    } catch (err) {
        ErrorHandler(err)
    }
}

const BlogCloud = ({ transferPage }) => {
    const [loading, setLoading] = useState(false)
    const showPng = document.getElementById("showPng")
    useEffect(() => {
        transferPage()
    }, [])

    useEffect(() => {
        if (loading) {
            console.log("now loading...")
        } else {
            console.log("not loading")
        }
    }, [loading])
    return (
        <Formik
            initialValues={{
                "url_": "",
                "remove_": "",
            }}
            validationSchema={validate}
            onSubmit={(values, actions, ...props) => {
                setLoading(true)
                getWC(values, actions, setLoading)
            }
            }
        >
            <div className="blogcloud-container">
                <div className="blogcloud-form-container">
                    <Form className="mx-auto w-80">
                        <div className="text-center">
                            URLを入力してください
                        </div>
                        <Field
                            name="url_"
                            type="url"
                            placeholder="https://"
                            className="form-control my-3"
                        >
                        </Field>
                        <Field
                            name="remove_"
                            type="text"
                            placeholder="除きたい単語をスペースで区切って入力"
                            className="form-control my-3"
                        >
                        </Field>
                        <div className="text-danger mb-3">
                            <ErrorMessage name="url_" />
                        </div>
                        <div className="text-center">
                            <button type="submit">イメージを取得
                            </button>
                        </div>
                    </Form>
                </div>
                <div className="showcase" id="blogShowCase">
                    {loading && <div className="blink">画像生成中...</div>}
                    <div id="showPng"></div>
                    <div id="imageURL"></div>
                    <div id="showWords"></div>
                </div>
            </div>

        </Formik>
    )
}

export default BlogCloud