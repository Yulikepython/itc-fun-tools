import React, { useEffect, useState } from "react"

function isHalfAlphabet(str) {
    return !!str.match(/^[A-Za-z0-9]*$/);
}
//半角は1、全角は2
function HankakuAndZenkakuCounter(text) {
    let wordCounter = 0
    for (var i = 0; i < text.length; i++) {
        if (isHalfAlphabet(text[i])) {
            wordCounter += 0.5
        } else {
            wordCounter += 1
        }
    }
    return wordCounter
}


const WordCounter = ({ transferPage }) => {
    const [wordCount, setWordCount] = useState(0)
    const [counter, setCounter] = useState(0)
    useEffect(() => {
        transferPage()
    }, [])

    const handleChange = e => {
        switch (e.target.name) {
            case "text":
                setWordCount(() => e.target.value.length)
                setCounter(() => HankakuAndZenkakuCounter(e.target.value))
                break;
            default:
                console.log("That name is not found.")
        }
    }
    return (
        <div className="wordcounterContainer">
            <h1>ワードカウンター：文字数カウント</h1>
            <form>
                <textarea name="text" onChange={handleChange} rows={15} cols={30} />
            </form>
            <div className="mb-4 mt-2">
                文字数：{wordCount}（全て1として換算）
            </div>
            <div>
                全角文字数：{counter}（半角は0.5として換算）
            </div>
        </div>
    )
}

export default WordCounter