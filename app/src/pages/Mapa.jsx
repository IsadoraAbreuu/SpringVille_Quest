import { useNavigate } from "react-router-dom";

export default function Map() {
  const navigate = useNavigate();

  const places = [
    { id: "escola", name: "🏫 Escola" },
    { id: "lanchonete", name: "🍔 Lanchonete" },
    { id: "casa", name: "🏠 Casa" },
  ];

  return (
    <div className="container">
      <h1>🏡 SpringVille</h1>

      {places.map((p) => (
        <button key={p.id} onClick={() => navigate(`/place/${p.id}`)}>
          {p.name}
        </button>
      ))}
    </div>
  );
}