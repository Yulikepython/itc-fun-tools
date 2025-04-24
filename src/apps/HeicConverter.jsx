import React, { useEffect } from "react"
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

const HeicConverter = ({ transferPage }) => {
    const { acceptedFiles, getRootProps, getInputProps, inputRef } = useDropzone()

    useEffect(() => {
        transferPage()
    }, [])

    useEffect(() => {
        if (acceptedFiles !== undefined) {
            displayArea(acceptedFiles)
        }
    }, [acceptedFiles])

    const removeAll = () => {
        acceptedFiles.length = 0
        acceptedFiles.splice(0, acceptedFiles.length)
        inputRef.current.value = ''
    }

    const submitHandler = async () => {
        try {
            let data = new FormData()
            for (var i = 0; i < acceptedFiles.length; i++) {
                data.append(`heics-${i}`, acceptedFiles[i])
            }
            const res = await requestFileToServer("/tools/heicConverter/", data)

            const fileUrl = res.data

            var a = document.createElement("a")
            a.setAttribute("href", fileUrl)
            a.setAttribute("download", fileUrl)
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            alert("変換が完了しました！")

        } catch (err) {
            ErrorHandler(err)
        }
        removeAll()
        displayArea(acceptedFiles)
    }

    return (
        <div className="heic-container">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <div>
                    <p>「.heic」イメージをドラッグ&ドロップ</p>
                    <p>もしくは、クリックして選択してください</p>
                    <p>（複数選択可）</p>
                </div>
            </div>
            <div>
                <button type="button" id="heicBtn" onClick={() => submitHandler()}>変換</button>
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

export default HeicConverter