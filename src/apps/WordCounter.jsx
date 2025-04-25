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
    const [charWithoutSpace, setCharWithoutSpace] = useState(0)
    
    useEffect(() => {
        transferPage()
    }, [])

    const handleChange = e => {
        const text = e.target.value;
        switch (e.target.name) {
            case "text":
                setWordCount(() => text.length)
                setCounter(() => HankakuAndZenkakuCounter(text))
                setCharWithoutSpace(() => text.replace(/\s+/g, '').length)
                break;
            default:
                console.log("That name is not found.")
        }
    }
    
    return (
        <div className="wordcounter-container">
            <div className="wordcounter-header">
                <h1>ワードカウンター</h1>
                <p className="wordcounter-description">
                    テキストの文字数をカウントします。全角・半角の区別や空白を除いた文字数も確認できます。
                </p>
            </div>

            <div className="wordcounter-content">
                <div className="textarea-container">
                    <form>
                        <textarea 
                            name="text" 
                            onChange={handleChange} 
                            rows={15} 
                            placeholder="ここにテキストを入力してください..."
                            className="wordcounter-textarea"
                        />
                    </form>
                </div>

                <div className="wordcounter-results">
                    <div className="result-card">
                        <div className="result-icon">🔤</div>
                        <div className="result-value">{wordCount}</div>
                        <div className="result-label">文字数（全て1として換算）</div>
                    </div>
                    
                    <div className="result-card">
                        <div className="result-icon">📏</div>
                        <div className="result-value">{counter}</div>
                        <div className="result-label">全角文字数（半角は0.5として換算）</div>
                    </div>
                    
                    <div className="result-card">
                        <div className="result-icon">📝</div>
                        <div className="result-value">{charWithoutSpace}</div>
                        <div className="result-label">空白を除いた文字数</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WordCounter