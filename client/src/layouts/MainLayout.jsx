import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>

      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        <Navbar />

        <main style={{ flex: 1, padding: "20px" }}>
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default MainLayout;
