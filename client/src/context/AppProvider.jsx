import { useEffect, useState } from "react";
import AppContext from "./AppContext";

const STORAGE_KEY = "planit_v1";

const defaultState = {
  user: {
    id: 1,
    name: "Tanu",
    email: "tanu@example.com",
    role: "Developer",
  },
  teamMembers: [],
  projects: [],
  tasks: [],
};

const getInitialState = () => {
  if (typeof window === "undefined") {
    return defaultState;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return defaultState;
    }

    const parsed = JSON.parse(raw);

    return {
      user: parsed?.user || defaultState.user,
      teamMembers: Array.isArray(parsed?.teamMembers)
        ? parsed.teamMembers
        : defaultState.teamMembers,
      projects: Array.isArray(parsed?.projects)
        ? parsed.projects
        : defaultState.projects,
      tasks: Array.isArray(parsed?.tasks)
        ? parsed.tasks
        : defaultState.tasks,
    };
  } catch (error) {
    console.error("Failed to parse persisted PlanIt data:", error);
    return defaultState;
  }
};

function AppProvider({ children }) {
  const [initialState] = useState(getInitialState);

  const [user, setUser] = useState(initialState.user);

  const [teamMembers, setTeamMembers] = useState(initialState.teamMembers);

  const [projects, setProjects] = useState(initialState.projects);

  const [tasks, setTasks] = useState(initialState.tasks);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user,
          projects,
          tasks,
          teamMembers,
        }),
      );
    } catch (error) {
      console.error("Failed to persist PlanIt data:", error);
    }
  }, [user, projects, tasks, teamMembers]);

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
          : task,
      ),
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prev) =>
      prev.filter((task) => task.id !== taskId),
    );
  };

  const deleteProject = (projectId) => {
    setProjects((prev) =>
      prev.filter((project) => project.id !== projectId),
    );

    setTasks((prev) =>
      prev.filter((task) => task.projectId !== projectId),
    );
  };

  const updateTask = (taskId, updatedData) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, ...updatedData }
          : task,
      ),
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