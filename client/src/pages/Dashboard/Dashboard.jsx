import Card from "../../components/ui/Card";

function Dashboard() {
  return (
    <div>

      {/* Page title */}
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        Dashboard
      </h1>


      {/* Stats section */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <Card title="Total Projects" value="12" />
        <Card title="Active Tasks" value="48" />
        <Card title="Completed Tasks" value="156" />
        <Card title="Team Members" value="8" />
      </div>


      {/* Projects section */}
      <div style={{ marginTop: "40px" }}>

        <h2 style={{ marginBottom: "15px" }}>
          Recent Projects
        </h2>

        <div
          style={{
            background: "#111827",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #1F2937",
          }}
        >
          <p>Project Alpha</p>
          <p>Project Beta</p>
          <p>Project Gamma</p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
