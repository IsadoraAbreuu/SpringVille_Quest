import { useState } from "react";

export default function DragGame({ onFinish }) {
  const [done, setDone] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDone(true);
    onFinish();
  };

  return (
    <div>
      <h2>Monte o hambúrguer 🍔</h2>

      <div
        draggable
        onDragStart={(e) => e.dataTransfer.setData("item", "pao")}
        style={{ fontSize: "40px" }}
      >
        🍞
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          marginTop: 40,
          padding: 40,
          border: "2px dashed black",
        }}
      >
        🍔 Monte aqui
      </div>

      {done && <p>✅ Pedido pronto!</p>}
    </div>
  );
}