import { useState, useEffect, useRef } from "react";


const JsonPretty = ({ transferPage }) => {
    const [inputValue, setInputValue] = useState("");
    const [outputValue, setOutputValue] = useState("");

    useEffect(() => {
        transferPage()
    }, [])

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleButtonClick = (e) => {
        e.preventDefault();
        try {
            const formattedJSON = JSON.stringify(JSON.parse(inputValue), null, 4);
            setOutputValue(formattedJSON);
        } catch (error) {
            setOutputValue("Invalid JSON");
        }
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
                            />
                        </div>
                        <button className="btn btn-primary mt-4 mb-2 form-control" onClick={handleButtonClick}>
                            Make JSON Prettier
                        </button>
                    </form>
                    <div className="mt-3 w-100">
                        <label htmlFor="formattedJsonTextarea">整いました</label>
                        <textarea
                            id="formattedJsonTextarea"
                            className="form-control"
                            rows="20"
                            readOnly
                            value={outputValue}
                            style={{ height: 'auto' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JsonPretty