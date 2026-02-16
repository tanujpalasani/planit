import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Projects", path: "/dashboard/projects" },
    { name: "Tasks", path: "/dashboard/tasks" },
    { name: "Settings", path: "/dashboard/settings" },
  ];

  return (
    <aside
      style={{
        width: "240px",
        background: "#111827",
        padding: "20px",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo */}
      <h2 className="gradient-text">PlanIt</h2>

      {/* Menu */}
      <nav style={{ marginTop: "30px" }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              style={{
                display: "block",
                padding: "10px",
                marginBottom: "5px",
                borderRadius: "8px",
                textDecoration: "none",
                color: "white",
                background: isActive ? "#1F2937" : "transparent",
              }}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
