import React, { useEffect, useState } from "react"
import { Formik, Form, ErrorMessage, Field } from "formik"
import * as Yup from "yup"
import { ErrorHandler } from "../utils/ErrorHandler"
import QRCode from "qrcode"

const validate = Yup.object({
    value: Yup.string().max(100, "QRコードにしては長すぎます").required("入力して下さい")
})

const makeQR = async (values, actions) => {
    try {
        const qrText = values.value;
        
        // 追加の入力検証
        if (!qrText || qrText.trim() === '') {
            actions.setFieldError('value', '空の値はQRコードに変換できません');
            return;
        }
        
        const canvas = document.createElement('canvas');
        
        // QRコードオプション
        const options = {
            errorCorrectionLevel: 'H', // 高い誤り訂正レベル
            margin: 1,
            width: 250,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        };
        
        // 結果表示エリアを非表示に
        const resultArea = document.getElementById("qr-result-area");
        resultArea.classList.remove('active');
        
        try {
            // QRコード生成
            await QRCode.toCanvas(canvas, qrText, options);
            
            // Canvasから画像URLを生成
            const imgURL = canvas.toDataURL("image/png");
            
            // 表示領域を取得
            const qrShowPng = document.getElementById("qrShowPng");
            const imgDownloadDiv = document.getElementById("qrImgDownload");
            
            // 要素をクリア
            while (qrShowPng.firstChild) {
                qrShowPng.removeChild(qrShowPng.lastChild);
            }
            while (imgDownloadDiv.firstChild) {
                imgDownloadDiv.removeChild(imgDownloadDiv.lastChild);
            }
            
            // 新しい画像要素を作成
            let imgElement = document.createElement('img');
            imgElement.alt = 'QRコード';
            imgElement.width = 250;
            imgElement.height = 250;
            imgElement.src = imgURL;
            imgElement.className = 'qr-image';
            
            // ダウンロードリンク作成
            let linkElement = document.createElement("a");
            linkElement.innerText = "QRコードをダウンロード";
            linkElement.href = imgURL;
            linkElement.download = "qr.png";
            linkElement.className = 'download-button';
            
            // 生成テキスト表示
            let textInfoElement = document.createElement("div");
            textInfoElement.className = 'qr-text-info';
            textInfoElement.innerText = `「${qrText}」のQRコード`;
            
            // 要素を追加
            qrShowPng.appendChild(imgElement);
            qrShowPng.appendChild(textInfoElement);
            imgDownloadDiv.appendChild(linkElement);
            
            // 結果表示エリアを表示
            resultArea.classList.add('active');
            
            // フォームをリセット
            actions.resetForm({
                values: {
                    value: "",
                }
            });
        } catch (qrError) {
            // QRコード生成に失敗した場合の具体的なエラーハンドリング
            console.error('QRコード生成エラー:', qrError);
            
            // ユーザーフレンドリーなエラーメッセージを表示
            actions.setFieldError('value', 'QRコードの生成に失敗しました。入力内容を確認してください。');
            
            // エラー情報をより詳細に表示したいなら、以下のようにカスタムエラーUI要素を表示することもできる
            // createErrorMessage('QRコードの生成に失敗しました。入力内容を確認してください。');
        }
    } catch (err) {
        // 一般的なエラーハンドリング
        console.error('予期せぬエラー:', err);
        actions.setFieldError('value', '予期せぬエラーが発生しました');
        ErrorHandler(err);
    }
}

// エラーメッセージを表示するためのヘルパー関数（必要に応じて実装）
/*
const createErrorMessage = (message) => {
    const resultArea = document.getElementById("qr-result-area");
    const qrShowPng = document.getElementById("qrShowPng");
    
    // 要素をクリア
    while (qrShowPng.firstChild) {
        qrShowPng.removeChild(qrShowPng.lastChild);
    }
    
    // エラーメッセージ要素の作成
    const errorElement = document.createElement('div');
    errorElement.className = 'qr-error-message';
    errorElement.innerHTML = `<i class="bi bi-exclamation-triangle"></i> ${message}`;
    
    qrShowPng.appendChild(errorElement);
    resultArea.classList.add('active');
}
*/

const QRTopPage = ({ transferPage }) => {
    useEffect(() => {
        transferPage();
    }, []);
    
    return (
        <div className="qr-app-wrapper">
            <div className="top-qr-container">
                <Formik
                    initialValues={{
                        "value": ""
                    }}
                    validationSchema={validate}
                    onSubmit={(values, actions) => {
                        makeQR(values, actions);
                    }}
                >
                    <Form className="qr-container">
                        <h2>QRコード生成アプリ</h2>
                        <p className="qr-description">テキストを入力してQRコードを簡単に作成できます。日本語も対応しています。</p>
                        
                        <div className="input-area">
                            <label htmlFor="qr-input">QRコードにしたいテキスト：</label>
                            <Field
                                id="qr-input"
                                name="value"
                                type="text"
                                placeholder="URLやテキストを入力（日本語対応）"
                                className="form-control"
                            />
                            <div className="text-danger error-message">
                                <ErrorMessage name="value" />
                            </div>
                        </div>
                        
                        <button type="submit" className="generate-button">
                            <span className="button-icon">✨</span> QRコードを生成
                        </button>
                    </Form>
                </Formik>
                
                <div id="qr-result-area" className="qr-result-area">
                    <div id="qrShowPng" className="qr-show-area"></div>
                    <div id="qrImgDownload" className="qr-download-area"></div>
                </div>
            </div>
        </div>
    );
}

export default QRTopPage