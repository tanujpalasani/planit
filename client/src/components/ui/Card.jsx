function Card({ title, value }) {
  return (
    <div
      style={{
        background: "#111827",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid #1F2937",
        minWidth: "200px",
      }}
    >
      <p style={{ color: "#9CA3AF", fontSize: "14px" }}>{title}</p>

      <h2 className="gradient-text" style={{ marginTop: "10px" }}>
        {value}
      </h2>
    </div>
  );
}

export default Card;
