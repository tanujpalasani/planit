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

    if (!project.name) {
      console.error("Project must have a name");
      return null;
    }

    const newProject = {
      id: Date.now(),
      createdAt: new Date(),
      ...project,
    };

    setProjects((prev) => [newProject, ...prev]);

    return newProject;
  };


  const addTask = (task) => {

    if (!task.projectId) {
      console.error("Task must include projectId");
      return null;
    }

    const newTask = {
      id: Date.now(),
      createdAt: new Date(),
      status: "Todo",
      priority: "Medium",
      subtasks: [],
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
        task.id === taskId
          ? { ...task, status: newStatus }
          : task
      )
    );

  };


  const deleteTask = (taskId) => {

    setTasks((prev) =>
      prev.filter((task) => task.id !== taskId)
    );

  };


  const deleteProject = (projectId) => {

    setProjects((prev) =>
      prev.filter((project) => project.id !== projectId)
    );

    setTasks((prev) =>
      prev.filter((task) => task.projectId !== projectId)
    );

  };


  const updateTask = (taskId, updatedData) => {

    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, ...updatedData }
          : task
      )
    );

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
    deleteProject,
    updateTask,
  };


  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );

}

export default AppProvider;
