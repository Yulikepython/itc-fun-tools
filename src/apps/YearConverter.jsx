import React, { useEffect, useState } from "react"
import { Formik, Form, ErrorMessage, Field } from "formik"
import * as Yup from "yup"
import { HowToUseYearConverter } from "../components/YearConverterRefModal"

// 年号の区切り
const ERA_BOUNDS = {
  r: [2019, 5, 1],   // 令和：2019年5月1日～
  h: [1989, 1, 8],   // 平成：1989年1月8日～2019年4月30日
  s: [1926, 12, 25], // 昭和：1926年12月25日～1989年1月7日
  t: [1912, 7, 30]   // 大正：1912年7月30日～1926年12月24日
}

// 区切り年のオブジェクト化（処理しやすくするため）
const ERA_RANGES = {
  r: { start: new Date(2019, 4, 1) },
  h: { start: new Date(1989, 0, 8), end: new Date(2019, 3, 30) },
  s: { start: new Date(1926, 11, 25), end: new Date(1989, 0, 7) },
  t: { start: new Date(1912, 6, 30), end: new Date(1926, 11, 24) }
}

// 元号文字 -> 漢字
const ERA_NAMES = {
  r: "令和",
  h: "平成",
  s: "昭和",
  t: "大正"
}

// 元号ごとのカラースタイル定義
const ERA_COLORS = {
  r: "#E57373", // 令和：赤系
  h: "#64B5F6", // 平成：青系
  s: "#81C784", // 昭和：緑系
  t: "#FFD54F"  // 大正：黄系
}

// 和暦 -> 西暦
function convertToAD(eraChar, year) {
  if (!ERA_BOUNDS[eraChar]) return null;
  return ERA_BOUNDS[eraChar][0] + parseInt(year) - 1;
}

// 西暦 -> 和暦
function convertToJapanese(year) {
  const yearNum = parseInt(year);
  
  // 令和
  if (yearNum >= ERA_BOUNDS.r[0]) {
    return {era: "r", eraName: "令和", year: yearNum - ERA_BOUNDS.r[0] + 1};
  }
  // 平成
  else if (yearNum >= ERA_BOUNDS.h[0] && yearNum < ERA_BOUNDS.r[0]) {
    return {era: "h", eraName: "平成", year: yearNum - ERA_BOUNDS.h[0] + 1};
  }
  // 昭和
  else if (yearNum >= ERA_BOUNDS.s[0] && yearNum < ERA_BOUNDS.h[0]) {
    return {era: "s", eraName: "昭和", year: yearNum - ERA_BOUNDS.s[0] + 1};
  }
  // 大正
  else if (yearNum >= ERA_BOUNDS.t[0] && yearNum < ERA_BOUNDS.s[0]) {
    return {era: "t", eraName: "大正", year: yearNum - ERA_BOUNDS.t[0] + 1};
  }
  
  // 大正より前はサポート外
  return null;
}

// 日付の変換処理（メイン関数）
function convertDate(inputStr) {
  // 入力文字列の整形
  let input = inputStr.trim();
  
  // ハイフンで区切られている場合は分割
  const parts = input.split("-");
  const yearPart = parts[0];
  
  // 月と日を保持（あれば）
  const monthPart = parts.length > 1 ? `-${parts[1]}` : "";
  const dayPart = parts.length > 2 ? `-${parts[2]}` : "";
  
  // 西暦の場合（数字で始まる）
  if (/^\d/.test(yearPart)) {
    // 西暦を数値に変換
    let year = parseInt(yearPart);
    
    // 2桁以下の場合は1900年代として扱う
    if (year < 100) {
      year += 1900;
    }
    
    const result = convertToJapanese(year);
    
    // 変換できない場合（大正より前など）
    if (!result) {
      return {
        text: "変換できない年代です（大正以前はサポートしていません）",
        era: null
      };
    }
    
    return {
      text: `${result.eraName}${result.year}年${monthPart.replace('-', '')}${dayPart.replace('-', '')}`,
      era: result.era
    };
  }
  // 和暦の場合（アルファベットで始まる）
  else {
    const eraChar = yearPart[0].toLowerCase();
    const eraYear = yearPart.substring(1);
    
    if (!ERA_NAMES[eraChar]) {
      return {
        text: "不正な元号です（r, h, s, tのいずれかで始めてください）",
        era: null
      };
    }
    
    // 西暦に変換
    const adYear = convertToAD(eraChar, eraYear);
    
    // 変換できない場合
    if (!adYear) {
      return {
        text: "変換できない年代です",
        era: null
      };
    }
    
    return {
      text: `西暦${adYear}年${monthPart.replace('-', '')}${dayPart.replace('-', '')}`,
      era: "western"
    };
  }
}

// バリデーション
const validate = Yup.object({
    value: Yup.string().test(
        'is-number-or-starts-with', '不正な文字列です。※使い方を参照してください。', (value) => {
            if (!value) return true;  // 空の値はrequiredで処理
            return isDigit(value) || canBeWareki(value);
        }
    ).required("入力して下さい")
})

const YearConverter = ({ transferPage }) => {
    const [conversionResult, setConversionResult] = useState(null);
    const [isResultVisible, setIsResultVisible] = useState(false);

    useEffect(() => {
        transferPage()
    }, [])

    const submitHandler = (values, actions) => {
        // クライアントサイドで変換処理
        const result = convertDate(values.value);
        
        // 結果を状態に保存
        setConversionResult(result);
        setIsResultVisible(true);

        // フォームをリセット
        actions.resetForm({
            values: {
                value: "",
            }
        })
    }

    // 結果表示のスタイルを元号に基づいて取得
    const getResultStyle = () => {
        if (!conversionResult || !conversionResult.era) {
            return { borderColor: "#f44336" }; // エラーメッセージの場合は赤色
        }
        
        if (conversionResult.era === "western") {
            return { borderColor: "#3f51b5" }; // 西暦の場合は藍色
        }
        
        return { 
            borderColor: ERA_COLORS[conversionResult.era],
            boxShadow: `0 0 8px ${ERA_COLORS[conversionResult.era]}`
        };
    }

    return (
        <Formik
            initialValues={{
                "value": "",
            }}
            validationSchema={validate}
            onSubmit={submitHandler}
        >
            {() => {
                return (
                    <div className="container d-flex flex-column justify-content-center align-items-center h-100 my-5" style={{ maxWidth: '800px' }}>
                        <div className="card w-100 shadow">
                            <div className="card-header bg-primary text-white py-3">
                                <h2 className="text-center mb-0">西暦・和暦変換アプリ</h2>
                            </div>
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-end mb-4">
                                    <button
                                        type="button"
                                        data-toggle="modal"
                                        data-target="#howToUseYearConverter"
                                        className="btn btn-sm btn-outline-info px-3"
                                    >
                                        <i className="fas fa-question-circle mr-2"></i> 使い方
                                    </button>
                                </div>
                                
                                <Form className="mb-4">
                                    <div className="input-group mb-4">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <i className="fas fa-calendar-alt"></i>
                                            </span>
                                        </div>
                                        <Field
                                            name="value"
                                            type="text"
                                            placeholder="年-月-日（例: 2021-4-1 または r3-4-1）"
                                            className="form-control py-2"
                                            id="input-datetime"
                                            autoComplete="off"
                                        />
                                        <div className="input-group-append">
                                            <button 
                                                type="submit" 
                                                className="btn btn-primary px-4" 
                                                id="convert-btn"
                                                style={{ minWidth: '100px' }}
                                            >
                                                変換
                                            </button>
                                        </div>
                                    </div>
                                    <div className="yearConverter-error text-danger mb-3 px-2">
                                        <ErrorMessage name="value" id="input-error" />
                                    </div>
                                </Form>

                                {isResultVisible && (
                                    <div className="my-5 py-2">
                                        <h5 className="text-center mb-4">変換結果</h5>
                                        <div 
                                            className="result-container p-4 rounded text-center mx-auto" 
                                            style={{
                                                border: '2px solid',
                                                transition: 'all 0.3s ease',
                                                fontSize: '1.3rem',
                                                fontWeight: 'bold',
                                                backgroundColor: '#f8f9fa',
                                                maxWidth: '500px',
                                                ...getResultStyle()
                                            }}
                                        >
                                            {conversionResult.text}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="era-legend mt-5 pt-3">
                                    <h6 className="text-center mb-3 text-secondary">元号カラーガイド</h6>
                                    <div className="d-flex justify-content-center flex-wrap">
                                        <div className="era-item mx-3 mb-3 px-4 py-2 rounded shadow-sm" style={{backgroundColor: ERA_COLORS.r, color: 'white'}}>
                                            令和
                                        </div>
                                        <div className="era-item mx-3 mb-3 px-4 py-2 rounded shadow-sm" style={{backgroundColor: ERA_COLORS.h, color: 'white'}}>
                                            平成
                                        </div>
                                        <div className="era-item mx-3 mb-3 px-4 py-2 rounded shadow-sm" style={{backgroundColor: ERA_COLORS.s, color: 'white'}}>
                                            昭和
                                        </div>
                                        <div className="era-item mx-3 mb-3 px-4 py-2 rounded shadow-sm" style={{backgroundColor: ERA_COLORS.t, color: 'black'}}>
                                            大正
                                        </div>
                                        <div className="era-item mx-3 mb-3 px-4 py-2 rounded shadow-sm" style={{backgroundColor: '#3f51b5', color: 'white'}}>
                                            西暦
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <HowToUseYearConverter />
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