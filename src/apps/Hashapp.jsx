import React, { useEffect, useState } from "react"
import { Formik, Form, ErrorMessage, Field } from "formik"
import * as Yup from "yup"
import { ErrorHandler } from "../utils/ErrorHandler"
import CryptoJS from 'crypto-js';


const validate = Yup.object({
    txt: Yup.string().max(1000, "1,000文字以下でお願いします。").required("ハッシュ化するテキストを入力してください。")
})

function generateHash(value) {
    return CryptoJS.SHA256(value)
}

const getHash = async (values, actions, setLoading, setHashResult) => {
    try {
        const generated = generateHash(values.txt);
        setLoading(true);
        
        // 少し遅延を入れてハッシュ化処理の進行を視覚的に示す
        setTimeout(() => {
            setLoading(false);
            setHashResult(generated.toString());
        }, 500);
        
        actions.resetForm({
            values: {
                txt: "",
            }
        });
    } catch (err) {
        setLoading(false);
        ErrorHandler(err);
    }
}

const Hashapp = ({ transferPage }) => {
    const [loading, setLoading] = useState(false);
    const [hashResult, setHashResult] = useState("");
    
    useEffect(() => {
        transferPage();
    }, []);

    return (
        <div className="hashapp-container">
            <div className="hashapp-header">
                <h1>ハッシュ化ツール</h1>
                <p className="hashapp-description">
                    テキストをSHA-256アルゴリズムでハッシュ化します。安全な暗号化ハッシュを生成できます。
                </p>
            </div>
            
            <div className="hashapp-content">
                <Formik
                    initialValues={{
                        "txt": "",
                    }}
                    validationSchema={validate}
                    onSubmit={(values, actions) => {
                        getHash(values, actions, setLoading, setHashResult);
                    }}
                >
                    <Form className="hashapp-form">
                        <div className="input-group">
                            <label htmlFor="hash-input">ハッシュ化するテキスト</label>
                            <Field
                                id="hash-input"
                                name="txt"
                                type="text"
                                placeholder="ハッシュ化したいテキストを入力"
                                className="form-control"
                            />
                            <div className="text-danger error-message">
                                <ErrorMessage name="txt" />
                            </div>
                        </div>
                        
                        <button type="submit" className="hash-button" disabled={loading}>
                            {loading ? 
                                <span>処理中...</span> : 
                                <>
                                    <span className="button-icon">🔒</span> ハッシュ化する
                                </>
                            }
                        </button>
                    </Form>
                </Formik>
                
                <div className="hash-result-container">
                    {loading && (
                        <div className="hash-loading">
                            <div className="loading-spinner"></div>
                            <div className="loading-text">ハッシュ化しています...</div>
                        </div>
                    )}
                    
                    {hashResult && !loading && (
                        <div className="hash-result">
                            <h3>ハッシュ化結果 (SHA-256)</h3>
                            <div className="hash-code">
                                {hashResult}
                            </div>
                            <div className="hash-copy-button" onClick={() => {
                                navigator.clipboard.writeText(hashResult);
                                alert('ハッシュ値をクリップボードにコピーしました');
                            }}>
                                クリップボードにコピー
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Hashapp