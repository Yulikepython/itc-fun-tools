import React from "react";

export const HowToUseYearConverter = () => {
    return (
        <div className="modal fade" id="howToUseYearConverter" tabIndex="-1" role="dialog" aria-labelledby="howToUseYearConverterModal" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="howToUseYearConverterModalTitle">
                            西暦・和暦変換ツールの使い方
                        </h5>

                    </div>
                    <div className="modal-body">
                        <ul>
                            <li>年-月-日とハイフンで区切ること</li>
                            <li>西暦の場合は、4桁、2桁、1桁で入力可能。1,2桁の場合は、19**と1900年代に変換されます</li>
                            <li>和暦の場合は、令和「r」、平成「h」、昭和「s」、大正「t」から始めること
                            </li>
                            <li>大正以前の年月はエラーになります</li>
                        </ul>
                        <div>
                            <div className="title">（例）</div>
                            <div className="seireki">
                                <div>西暦の場合</div>
                                <div>【年月日】2000-1-1</div>
                                <div>【年のみ】2000</div>
                                <div>【2桁】90-1-1</div>
                            </div>
                            <div className="wareki">
                                <div>和暦の場合</div>
                                <div>【年月日】r1-1-1</div>
                                <div>【年のみ】h60</div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary form-control w-50 mx-auto" data-dismiss="modal" id="modal-close-btn">Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const ShowResultModal = ({ inputValue, result }) => {
    return (
        <div className="showResultModal-container">
            {/* <!-- Button trigger modal --> */}
            <button type="button" className="btn btn-primary d-none" data-toggle="modal" data-target="#showResultModal" id="showResultModalBtn">
                showResult
            </button>
            <div className="modal fade" id="showResultModal" tabIndex="-1" role="dialog" aria-labelledby="showResultModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="showResultModalLabel">
                                【入力した値】{inputValue}
                            </h5>
                        </div>
                        <div className="modal-body">
                            <div className="resultFont">
                                {result}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success form-control" data-dismiss="modal">OK</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}