import React, { useEffect, useState } from "react"

function byte_to_hex(byte_num) {
    var digits = (byte_num).toString(16);
    if (byte_num < 16) return '0' + digits;
    return digits;
}

// バイト配列を16進文字列に変換
function bytes_to_hex_string(bytes) {
    var result = "";

    for (var i = 0; i < bytes.length; i++) {
        result += byte_to_hex(bytes[i]);
    }
    return result;
}

function utf8_hex_string_to_string(hex_str1) {
    var bytes2 = hex_string_to_bytes(hex_str1);
    var str2 = utf8_bytes_to_string(bytes2);
    return str2;
}
// 文字列をUTF8のバイト配列に変換
function string_to_utf8_bytes(text) {
    var result = [];
    if (text == null)
        return result;
    for (var i = 0; i < text.length; i++) {
        var c = text.charCodeAt(i);
        if (c <= 0x7f) {
            result.push(c);
        } else if (c <= 0x07ff) {
            result.push(((c >> 6) & 0x1F) | 0xC0);
            result.push((c & 0x3F) | 0x80);
        } else {
            result.push(((c >> 12) & 0x0F) | 0xE0);
            result.push(((c >> 6) & 0x3F) | 0x80);
            result.push((c & 0x3F) | 0x80);
        }
    }
    return result;
}

const stringToHex = (str) => {
    var bytes1 = string_to_utf8_bytes(str);
    var hex_str1 = bytes_to_hex_string(bytes1);
    return hex_str1;
}

const ByteCounter = ({ transferPage }) => {
    const [byteCount, setByteCount] = useState(0)
    const [byteStr, setByteStr] = useState("")
    const [text, setText] = useState("")
    
    useEffect(() => {
        transferPage()
    }, [])

    const handleChange = e => {
        const inputText = e.target.value;
        setText(inputText);
        
        switch (e.target.name) {
            case "text":
                const bTxt = stringToHex(inputText)
                setByteCount(() => bTxt.length / 2);
                setByteStr(() => bTxt);
                break;
            default:
                console.log("That name is not found.")
        }
    }
    
    const copyToClipboard = (content) => {
        navigator.clipboard.writeText(content);
        alert('クリップボードにコピーしました');
    };
    
    return (
        <div className="bytecounter-container">
            <div className="bytecounter-header">
                <h1>バイト数カウントツール</h1>
                <p className="bytecounter-description">
                    テキストのバイト数を計算し、UTF-8エンコーディングでのHEX（16進数）表現を表示します。
                </p>
            </div>
            
            <div className="bytecounter-content">
                <div className="textarea-container">
                    <form>
                        <textarea 
                            name="text" 
                            onChange={handleChange} 
                            value={text}
                            rows={15} 
                            placeholder="ここにテキストを入力してください..."
                            className="bytecounter-textarea"
                        />
                    </form>
                </div>
                
                <div className="bytecounter-results">
                    <div className="result-panel">
                        <div className="result-header">
                            <h3>バイト数 (UTF-8)</h3>
                            <div className="byte-count">{byteCount} bytes</div>
                        </div>
                        
                        <div className="result-info">
                            <div className="info-icon">ℹ️</div>
                            <div className="info-text">1文字が複数バイトで表現される場合があります（特に日本語などの多バイト文字）</div>
                        </div>
                    </div>
                    
                    {byteStr && (
                        <div className="hex-result">
                            <div className="hex-header">
                                <h3>HEX（16進数）表現</h3>
                                <button 
                                    className="copy-button" 
                                    onClick={() => copyToClipboard(byteStr)}
                                    title="HEX表現をクリップボードにコピー"
                                >
                                    コピー
                                </button>
                            </div>
                            <div className="hex-code">
                                {byteStr.length > 0 ? (
                                    <div className="hex-content">
                                        {byteStr}
                                    </div>
                                ) : (
                                    <div className="hex-placeholder">テキストを入力するとHEX表現が表示されます</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ByteCounter