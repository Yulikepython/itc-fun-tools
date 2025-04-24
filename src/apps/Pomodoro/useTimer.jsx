import { useState, useEffect } from 'react';

const WORKING_MINUTES = 25;
const WORKING_SECS = 0;

const REST_MINUTES = 5;
const REST_SECS = 0;



const useTimer = () => {
    //作業中 = true
    const [isWorking, setIsWorking] = useState(true);
    const [minutes, setMinutes] = useState(WORKING_MINUTES);
    const [seconds, setSeconds] = useState(WORKING_SECS);
    const [timer, setTimer] = useState(null);
    const [notes, setNotes] = useState([{ value: '', readOnly: false }]);
    //開始ボタンをDisable化する => 時計が停止orリセットでfalse
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    //resetを押したあとの開始ボタンでは、ポモドーロは一個増える
    const [isReset, setIsReset] = useState(false);

    //ポモドーロを追加する関数
    const addOnePomodoro = () => {
        setNotes([...notes, { value: '', readOnly: false }]);
    }

    //作業時間をセット
    const setWorkingTimer = () => {
        setMinutes(WORKING_MINUTES);
        setSeconds(WORKING_SECS);
    }

    //休憩時間をセット
    const setRestTimer = () => {
        setMinutes(REST_MINUTES);
        setSeconds(REST_SECS);
    }

    //Timerが0になったら
    useEffect(() => {
        if (minutes < 0) {
            clearInterval(timer);
            //作業中→休憩への切り替わり
            if (isWorking) {
                setRestTimer();
                //休憩→作業中への切り替わり
            } else {
                setWorkingTimer();
                addOnePomodoro();
            }
            setIsWorking(!isWorking);

            startTimer();
        }
    }, [minutes, isWorking, timer, isTimerRunning]);

    const startTimer = () => {
        if (isReset) {
            addOnePomodoro();
        }
        setIsReset(false);

        //MinutesとSecondsからIntervalを作る。
        const interval = setInterval(() => {
            setSeconds(prevSeconds => {
                if (prevSeconds === 0) {
                    setMinutes(prevMinutes => prevMinutes - 1);
                    return 59;
                }
                return prevSeconds - 1;
            });
        }, 1000);

        setTimer(interval);

        setIsTimerRunning(true);
    };

    const stopTimer = () => {
        clearInterval(timer);
        setIsTimerRunning(false);
    };

    const resetTimer = () => {
        stopTimer();
        setWorkingTimer();
        setIsWorking(true);
        setIsTimerRunning(false);
        setIsReset(true);
    };

    const displayTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const numberOfPomodoro = `${notes.length}`

    return { displayTime, startTimer, stopTimer, resetTimer, numberOfPomodoro, notes, setNotes, isTimerRunning, isWorking };
};

export default useTimer;
