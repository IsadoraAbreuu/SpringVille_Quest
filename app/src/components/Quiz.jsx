import { useState } from "react";

export default function Quiz({ onFinish }) {
  const [answer, setAnswer] = useState("");

  const check = () => {
    if (answer.toLowerCase() === "matematica") {
      onFinish();
    }
  };

  return (
    <div>
      <h2>Qual matéria é sobre números?</h2>
      <input onChange={(e) => setAnswer(e.target.value)} />
      <button onClick={check}>Responder</button>
    </div>
  );
}