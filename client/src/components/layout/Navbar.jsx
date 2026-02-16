function Navbar() {
  return (
    <header
      style={{
        height: "60px",
        background: "#111827",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        borderBottom: "1px solid #1F2937",
      }}
    >
      <h3>Dashboard</h3>

      <div>
        <span>User</span>
      </div>
    </header>
  );
}

export default Navbar;
