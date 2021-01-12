import React from "react";
import styles from "./Timer.module.css";
import worker from "./worker";
import WebWorker from "./workerSetup";

const Timer = ({ startTimer, resetFields, isDone }) => {
  const [isTimerOn, setIsTimerOn] = React.useState(false);
  const [countdown, setCountDown] = React.useState(5);

  React.useEffect(() => {
    if (startTimer) {
      setIsTimerOn(true);
    }
  }, [startTimer]);

  React.useEffect(() => {
    let w = new WebWorker(worker);
    if (isTimerOn) {
      w.postMessage("start");
      w.addEventListener("message", (e) => {
        setCountDown((prevCount) => Number((prevCount - 0.1).toFixed(1)));
      });
    }
    return () => {
      w.terminate();
    };
  }, [isTimerOn]);

  React.useEffect(() => {
    if (countdown === 0) {
      setIsTimerOn(false);
      isDone();
    }
  }, [countdown]);

  const resetTimer = () => {
    setIsTimerOn(false);
    setCountDown(5);
    resetFields();
  };

  return (
    <div className={styles.timer}>
      <p className={countdown === 0 ? styles.highlight : ""}>
        Timer: {countdown.toFixed(1)} s
      </p>
      <Button resetTimer={resetTimer} />
    </div>
  );
};

const Button = ({ resetTimer }) => (
  <button className={styles.button} onClick={resetTimer}>
    Reset
  </button>
);

export default Timer;
