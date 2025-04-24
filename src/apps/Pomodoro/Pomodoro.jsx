import React, { useState, useEffect } from 'react';
import useTimer from './useTimer';

const Pomodoro = () => {
    const { displayTime, startTimer, stopTimer, resetTimer, numberOfPomodoro, notes, setNotes, isTimerRunning, isWorking } = useTimer();

    useEffect(() => {

    }, [notes])

    const handleNotesChange = (index, event) => {
        const values = [...notes];
        values[index].value = event.target.value;
        setNotes(values);
    };

    const handleRemoveClick = (index) => {
        const values = [...notes];
        values.splice(index, 1);
        setNotes(values);
    };

    const handleToggleReadOnly = (index) => {
        const values = [...notes];
        values[index].readOnly = !values[index].readOnly;
        setNotes(values);
    };

    return (
        <div className="container pomodoro pt-2">
            <div className="w-100">
                <h1 className="text-start">ポモドーロ・タイマー</h1>
            </div>
            <div className="m-4">
                <p className="tag-p">
                    {isWorking && isTimerRunning && <span className="badge bg-primary">作業中</span>}
                    {!isWorking && isTimerRunning && <span className="badge bg-danger">休憩中</span>}
                </p>

                <p className="text-title">{displayTime}</p>
            </div>
            <div className="btn-area">
                <button className="btn btn-primary" onClick={startTimer} disabled={isTimerRunning} id="start-btn">開始</button>
                <button className="btn btn-warning" onClick={stopTimer} id="stop-btn">一時停止</button>
                <button className="btn btn-danger" onClick={resetTimer} id="reset-btn">リセット</button>
            </div>
            <div className="pomodoro-area">
                {notes.length > 0 && <p className="pomodoro-title mt-4 mb-3">作業内容を記録しよう</p>}
                <p className="text-end" id="pomodoro-sum"><span className="badge bg-info">本日のポモドーロ合計数：{numberOfPomodoro}</span></p>
                {notes.map((note, index) => (
                    <div key={index} className="input-group mb-3 form-row">
                        <span>{index + 1}. </span>
                        <input
                            className='form-control memo-input'
                            type="text"
                            value={note.value}
                            onChange={(event) => handleNotesChange(index, event)}
                            readOnly={note.readOnly}
                            aria-describedby={`button-addon-${index}`}
                        />
                        <button
                            className="btn btn-outline-secondary edit-btn"
                            type="button"
                            id={`button-addon-${index}`}
                            onClick={() => handleToggleReadOnly(index)}
                        >
                            {note.readOnly ? 'EDIT' : 'SAVE'}
                        </button>
                        {notes.length !== 1 && <button
                            onClick={() => handleRemoveClick(index)}
                            className="btn btn-outline-danger remover-btn"
                        >
                            削除
                        </button>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Pomodoro;
