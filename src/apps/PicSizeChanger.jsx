import React, { useEffect, useState } from "react"
import { requestFileToServer } from "../utils/axios"
import { useDropzone } from "react-dropzone"
import { ErrorHandler } from "../utils/ErrorHandler"


const displayArea = values => {
    const displayArea = document.getElementById("displayArea")
    if (values.length > 0) {
        displayArea.style.display = "block"
    } else {
        displayArea.style.display = "none"
    }
}

const submitHandler = async (values, percentage) => {
    try {
        let data = new FormData()
        for (var i = 0; i < values.length; i++) {
            data.append(`pics-${i}`, values[i])
        }
        data.append("percentage", percentage)
        const res = await requestFileToServer("/tools/changePicSize/", data)

        const fileUrl = res.data.filepath


        var a = document.createElement("a")
        a.setAttribute("href", fileUrl)
        a.setAttribute("download", fileUrl)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        alert("縮小が完了しました")

    } catch (err) {
        ErrorHandler(err)
    }
}

const PicSizeChanger = ({ transferPage }) => {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone()

    const [percentage, setPercentage] = useState(100)

    useEffect(() => {
        transferPage()
    }, [])

    useEffect(() => {
        if (acceptedFiles !== undefined) {
            displayArea(acceptedFiles)
        }
        // console.log("useEffect")
    }, [acceptedFiles])

    useEffect(() => {
        // console.log("percentage: ", percentage)
    }, [percentage])

    return (
        <div className="pic-size-changer-container">
            <h2>サイズ縮小アプリ</h2>
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <div>
                    <p>縮小したいファイルをドラッグ&ドロップ</p>
                    <p>もしくは、クリックして選択してください</p>
                    <p>（複数選択可）</p>
                </div>
            </div>
            <div className="percentage-input-divs">
                <input
                    name="imgPercentage"
                    placeholder="%を入力（80% => 80）"
                    onChange={e => {
                        setPercentage(e.target.value)
                    }}
                />
            </div>
            <div>
                <button type="button" id="heicBtn" onClick={() => submitHandler(acceptedFiles, percentage)}>縮小する</button>
            </div>
            <div id="displayArea">
                <h2>変換するファイル</h2>
                <div>
                    {acceptedFiles.map((file, index) => (
                        <div key={index}>{file.path}</div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PicSizeChanger