import React, { useEffect, useState } from "react"
import { Formik, Form, ErrorMessage, Field } from "formik"
import * as Yup from "yup"

// バリデーションスキーマ - 最大長を300に拡張
const validate = Yup.object({
    max: Yup.number().required("入力して下さい").positive().integer().lessThan(301, "300以上の文字列は生成できません。")
})

// 文字種類の定義
const CHARACTER_SETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_-+={}[]|:;<>,.?/'
};

// パスワード強度を評価する関数
const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    
    let score = 0;
    
    // 長さによるスコア
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // 文字種類によるスコア
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // スコアの最大値は5
    return Math.min(score, 5);
};

// 強度に応じたラベルを返す関数
const getStrengthLabel = (score) => {
    switch (score) {
        case 0: return "評価なし";
        case 1: return "非常に弱い";
        case 2: return "弱い";
        case 3: return "普通";
        case 4: return "強い";
        case 5: return "非常に強い";
        default: return "評価なし";
    }
};

// 強度に応じた色を返す関数
const getStrengthColor = (score) => {
    switch (score) {
        case 0: return "#cccccc";
        case 1: return "#ff3e36";
        case 2: return "#ff691f";
        case 3: return "#ffda36";
        case 4: return "#9dc560";
        case 5: return "#368700";
        default: return "#cccccc";
    }
};

// ランダム文字列を生成する関数
const generateRandomString = (length, options) => {
    // 選択されたオプションに基づいて使用する文字セットを作成
    let characters = '';
    if (options.uppercase) characters += CHARACTER_SETS.uppercase;
    if (options.lowercase) characters += CHARACTER_SETS.lowercase;
    if (options.numbers) characters += CHARACTER_SETS.numbers;
    if (options.symbols) characters += CHARACTER_SETS.symbols;
    
    // 選択がない場合はデフォルトですべて使用
    if (characters === '') {
        characters = CHARACTER_SETS.uppercase + CHARACTER_SETS.lowercase + CHARACTER_SETS.numbers + CHARACTER_SETS.symbols;
    }
    
    let result = '';
    
    // 指定された長さのランダム文字列を生成
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    
    return result;
}

const RandomStringGenerator = ({ transferPage }) => {
    const [loading, setLoading] = useState(false);
    const [generatedString, setGeneratedString] = useState('');
    const [copied, setCopied] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    useEffect(() => {
        transferPage();
    }, []);

    // クリップボードにコピーする関数
    const copyToClipboard = () => {
        if (!generatedString) return;
        
        navigator.clipboard.writeText(generatedString)
            .then(() => {
                setCopied(true);
                // 3秒後にコピー通知を消す
                setTimeout(() => setCopied(false), 3000);
            })
            .catch(err => {
                console.error('クリップボードへのコピーに失敗しました:', err);
            });
    };

    const handleRandomStringGeneration = (values, actions) => {
        // 読み込み中の状態を設定
        setLoading(true);
        
        // コピー状態をリセット
        setCopied(false);
        
        // ローディング効果のための少しの遅延（UIフィードバック用）
        setTimeout(() => {
            // 選択されたオプション
            const options = {
                uppercase: values.uppercase,
                lowercase: values.lowercase,
                numbers: values.numbers,
                symbols: values.symbols
            };
            
            // クライアントサイドでランダム文字列生成
            const newGeneratedString = generateRandomString(parseInt(values.max), options);
            setGeneratedString(newGeneratedString);
            
            // パスワード強度を計算
            const strength = calculatePasswordStrength(newGeneratedString);
            setPasswordStrength(strength);
            
            // 読み込み状態を解除
            setLoading(false);
        }, 500);
    };

    return (
        <Formik
            initialValues={{
                max: "30",
                uppercase: true,
                lowercase: true,
                numbers: true,
                symbols: true
            }}
            validationSchema={validate}
            onSubmit={handleRandomStringGeneration}
        >
            {({ values }) => (
                <div className="top-random-container">
                    <Form className="random-container">
                        <h3>ランダム文字列生成アプリ</h3>
                        
                        <div className="mb-3">
                            <label htmlFor="max" className="form-label">文字数を入力してください (1-300)</label>
                            <Field
                                name="max"
                                type="number"
                                className="form-control"
                                min="1"
                                max="300"
                            />
                            <div className="text-danger text-center">
                                <ErrorMessage name="max" />
                            </div>
                        </div>
                        
                        <div className="mb-3">
                            <div className="form-label">使用する文字種類</div>
                            <div className="form-check">
                                <Field
                                    type="checkbox"
                                    name="uppercase"
                                    className="form-check-input"
                                    id="uppercaseCheck"
                                />
                                <label className="form-check-label" htmlFor="uppercaseCheck">
                                    大文字 (A-Z)
                                </label>
                            </div>
                            
                            <div className="form-check">
                                <Field
                                    type="checkbox"
                                    name="lowercase"
                                    className="form-check-input"
                                    id="lowercaseCheck"
                                />
                                <label className="form-check-label" htmlFor="lowercaseCheck">
                                    小文字 (a-z)
                                </label>
                            </div>
                            
                            <div className="form-check">
                                <Field
                                    type="checkbox"
                                    name="numbers"
                                    className="form-check-input"
                                    id="numbersCheck"
                                />
                                <label className="form-check-label" htmlFor="numbersCheck">
                                    数字 (0-9)
                                </label>
                            </div>
                            
                            <div className="form-check">
                                <Field
                                    type="checkbox"
                                    name="symbols"
                                    className="form-check-input"
                                    id="symbolsCheck"
                                />
                                <label className="form-check-label" htmlFor="symbolsCheck">
                                    記号 (!@#$% など)
                                </label>
                            </div>
                            
                            {!values.uppercase && !values.lowercase && !values.numbers && !values.symbols && (
                                <div className="text-danger mt-2">
                                    少なくとも1つの文字種類を選択してください
                                </div>
                            )}
                        </div>
                        
                        <button
                            type="submit"
                            className="btn generate-btn"
                            disabled={!values.uppercase && !values.lowercase && !values.numbers && !values.symbols}
                        >
                            ランダムな文字列を生成
                        </button>
                    </Form>
                    
                    {loading && <div className="blink">generating...</div>}
                    
                    <div className="result-container">
                        {generatedString && (
                            <div className="mb-2">{generatedString}</div>
                        )}
                        
                        {generatedString && (
                            <>
                                <div className="password-strength-container">
                                    <div className="strength-label">
                                        強度: {getStrengthLabel(passwordStrength)}
                                    </div>
                                    <div className="strength-meter">
                                        <div 
                                            className="strength-meter-fill" 
                                            style={{
                                                width: `${(passwordStrength / 5) * 100}%`,
                                                backgroundColor: getStrengthColor(passwordStrength)
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className={`btn copy-btn ${copied ? 'copied' : ''}`}
                                >
                                    {copied ? 'コピーしました！' : 'クリップボードにコピー'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </Formik>
    )
}

export default RandomStringGenerator