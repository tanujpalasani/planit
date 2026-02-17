import { useState } from "react";
import AppContext from "./AppContext";

function AppProvider({ children }) {
  const [user, setUser] = useState({
    id: 1,
    name: "Tanu",
    email: "tanu@example.com",
    role: "Developer",
  });

  const [teamMembers, setTeamMembers] = useState([]);

  const [projects, setProjects] = useState([]);

  const [tasks, setTasks] = useState([]);

  const addProject = (project) => {
    const newProject = {
      id: Date.now(),
      ...project,
      createdAt: new Date(),
    };
    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  };

  const addTask = (task) => {
    const newTask = {
      id: Date.now(),
      ...task,
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const addTeamMember = (member) => {
    const newMember = {
      id: Date.now(),
      ...member,
    };
    setTeamMembers((prev) => [...prev, newMember]);
    return newMember;
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const value = {
    user,
    setUser,
    teamMembers,
    setTeamMembers,
    projects,
    setProjects,
    tasks,
    setTasks,
    addProject,
    addTask,
    addTeamMember,
    updateTaskStatus,
    deleteTask,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;
