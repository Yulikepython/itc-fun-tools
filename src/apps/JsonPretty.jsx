import { useState, useEffect } from "react";

const JsonPretty = ({ transferPage }) => {
    const [inputValue, setInputValue] = useState("");
    const [outputValue, setOutputValue] = useState("");
    const [status, setStatus] = useState(""); // 状態を管理するステート追加

    useEffect(() => {
        transferPage()
    }, [])

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleButtonClick = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) {
            setStatus("empty");
            setOutputValue("");
            return;
        }
        
        try {
            const formattedJSON = JSON.stringify(JSON.parse(inputValue), null, 4);
            setOutputValue(formattedJSON);
            setStatus("success");
        } catch (error) {
            setOutputValue("");
            setStatus("error");
        }
    };

    // 結果エリアのラベルを動的に生成する関数
    const getOutputLabel = () => {
        switch(status) {
            case "success":
                return "フォーマットされたJSON";
            case "error":
                return "エラー: 無効なJSONです";
            case "empty":
                return "JSON文字列を入力してください";
            default:
                return "結果がここに表示されます";
        }
    };

    // 出力値を取得する関数
    const getOutputValue = () => {
        if (status === "error") {
            return "JSONの構文が正しくありません。入力を確認してください。";
        } else if (status === "empty") {
            return "JSON文字列が入力されていません。";
        }
        return outputValue;
    };

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center h-100 mt-3" style={{ maxWidth: '1200px' }}>
            <div className="card w-100">
                <div className="card-header">
                    <h2 className="text-center">JSON Formatter</h2>
                </div>
                <div className="card-body">
                    <form className="d-flex flex-column justify-content-center align-items-center">
                        <div className="form-group w-100">
                            <label htmlFor="jsonTextarea">JSON文字列を入力</label>
                            <textarea
                                id="jsonTextarea"
                                className="form-control"
                                rows="10"
                                value={inputValue}
                                onChange={handleInputChange}
                                placeholder='{"example": "ここにJSONを入力してください"}'
                            />
                        </div>
                        <button className="btn btn-primary mt-4 mb-2 form-control" onClick={handleButtonClick}>
                            JSONを整形する
                        </button>
                    </form>
                    <div className="mt-3 w-100">
                        <label htmlFor="formattedJsonTextarea">{getOutputLabel()}</label>
                        <textarea
                            id="formattedJsonTextarea"
                            className={`form-control ${status === "error" ? "is-invalid" : status === "success" ? "is-valid" : ""}`}
                            rows="20"
                            readOnly
                            value={getOutputValue()}
                            style={{ height: 'auto' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JsonPretty