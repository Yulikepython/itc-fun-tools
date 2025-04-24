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
    useEffect(() => {
        transferPage()
    }, [])

    const handleChange = e => {
        switch (e.target.name) {
            case "text":
                const bTxt = stringToHex(e.target.value)
                setByteCount(() => bTxt.length / 2);
                setByteStr(() => bTxt);
                break;
            default:
                console.log("That name is not found.")
        }
    }
    return (
        <div className="wordcounterContainer">
            <h1>バイト数カウントツール：HEXに変換/2</h1>
            <form>
                <textarea name="text" onChange={handleChange} rows={15} cols={30} />
            </form>
            <div className="mb-4 mt-2">
                HEX（16進数）：{byteStr}
            </div>
            <div className="mb-4 mt-2">
                バイト数（utf-8）：{byteCount}
            </div>
        </div>
    )
}

export default ByteCounter