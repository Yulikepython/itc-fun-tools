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
      return "変換できない年代です（大正以前はサポートしていません）";
    }
    
    return `${result.eraName}${result.year}年${monthPart.replace('-', '')}${dayPart.replace('-', '')}`;
  }
  // 和暦の場合（アルファベットで始まる）
  else {
    const eraChar = yearPart[0].toLowerCase();
    const eraYear = yearPart.substring(1);
    
    if (!ERA_NAMES[eraChar]) {
      return "不正な元号です（r, h, s, tのいずれかで始めてください）";
    }
    
    // 西暦に変換
    const adYear = convertToAD(eraChar, eraYear);
    
    // 変換できない場合
    if (!adYear) {
      return "変換できない年代です";
    }
    
    return `西暦${adYear}年${monthPart.replace('-', '')}${dayPart.replace('-', '')}`;
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
    const [result, setResult] = useState("");

    useEffect(() => {
        transferPage()
    }, [])

    const submitHandler = (values, actions) => {
        const showResult = document.getElementById("showResultYearConverter")
        
        // 結果表示領域をクリア
        showResult.style.display = "none"
        while (showResult.firstChild) {
            showResult.removeChild(showResult.lastChild)
        }
        
        // クライアントサイドで変換処理
        const convertedResult = convertDate(values.value);
        
        // 結果を表示
        var resultDiv = document.createElement("div")
        resultDiv.innerText = convertedResult
        showResult.appendChild(resultDiv)
        showResult.style.display = "flex"

        // フォームをリセット
        actions.resetForm({
            values: {
                value: "",
            }
        })
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
                    <div className="yearConverter-container">
                        <h2>西暦・和暦変換アプリ</h2>
                        <div className="how-to">
                            <button
                                type="button"
                                data-toggle="modal"
                                data-target="#howToUseYearConverter"
                                className="modalBtn-howto"
                            >
                                ※使い方はこちら
                            </button>
                        </div>
                        <Form>
                            <Field
                                name="value"
                                type="text"
                                placeholder="年-月-日"
                                className="form-control my-3"
                                id="input-datetime"
                            >
                            </Field>
                            <div className="yearConverter-error">
                                <ErrorMessage name="value" id="input-error" />
                            </div>
                            <button type="submit" id="convert-btn">
                                変換する
                            </button>
                        </Form>

                        <HowToUseYearConverter />
                        <div id="showResultYearConverter"></div>
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