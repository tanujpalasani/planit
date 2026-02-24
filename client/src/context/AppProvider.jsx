import { useEffect, useMemo, useState } from "react";
import AppContext from "./AppContext";
import { normalizeSubtasksArray } from "../utils/subtaskUtils";
import { useToast } from "../hooks/useToast";
import {
  addProject as addProjectService,
  addTask as addTaskService,
  addTeamMember as addTeamMemberService,
  clearLegacyPersistence,
  clearToken,
  deleteProject as deleteProjectService,
  deleteTask as deleteTaskService,
  getCurrentUser,
  getProjects as getProjectsService,
  getTasks as getTasksService,
  getTeamMembers as getTeamMembersService,
  getToken,
  login as loginService,
  registerAdmin as registerAdminService,
  removeTeamMember as removeTeamMemberService,
  saveToken,
  updateTask as updateTaskService,
  updateTaskStatus as updateTaskStatusService,
} from "../services/dataService";

const TEAM_MEMBER_ROLES = {
  ADMIN: "Admin",
  MEMBER: "Member",
};

const VALID_TEAM_MEMBER_ROLES = new Set(Object.values(TEAM_MEMBER_ROLES));

const defaultUser = {
  id: null,
  name: "",
  email: "",
  role: "",
};

const toIdKey = (value) => String(value ?? "");

const normalizeTaskStatus = (statusValue) => {
  const raw = String(statusValue || "").trim();
  const normalized = raw.toLowerCase();

  if (normalized === "todo" || normalized === "to do") {
    return "Todo";
  }
  if (normalized === "in progress" || normalized === "in-progress") {
    return "In Progress";
  }
  if (normalized === "completed" || normalized === "done") {
    return "Completed";
  }

  return "Todo";
};

const resolveTaskCompletionDate = (taskValue, fallbackDate = new Date()) => {
  if (!taskValue || typeof taskValue !== "object") {
    return null;
  }

  const normalizedStatus = normalizeTaskStatus(taskValue.status);
  if (normalizedStatus !== "Completed") {
    return null;
  }

  return taskValue.completedAt || taskValue.updatedAt || taskValue.createdAt || fallbackDate;
};

const normalizeTeamMemberRole = (roleValue) => {
  const role = typeof roleValue === "string" ? roleValue.trim() : "";

  if (VALID_TEAM_MEMBER_ROLES.has(role)) {
    return role;
  }

  return TEAM_MEMBER_ROLES.MEMBER;
};

const normalizeUserRole = (roleValue) => {
  const role = typeof roleValue === "string" ? roleValue.trim() : "";

  if (VALID_TEAM_MEMBER_ROLES.has(role)) {
    return role;
  }

  return "";
};

const sanitizeUser = (user) => {
  if (!user || typeof user !== "object") {
    return defaultUser;
  }

  const id = user.id ?? user._id;
  const name = typeof user.name === "string" ? user.name.trim() : "";
  const email = typeof user.email === "string" ? user.email.trim() : "";
  const role = normalizeUserRole(user.role);

  if (!name || !email) {
    return defaultUser;
  }

  if (typeof id !== "string" && typeof id !== "number") {
    return defaultUser;
  }

  return {
    id,
    name,
    email,
    role,
  };
};

const sanitizeProjects = (projects) => {
  if (!Array.isArray(projects)) {
    return [];
  }

  return projects
    .filter((project) => project && typeof project === "object")
    .map((project) => {
      const id = project.id ?? project._id;
      const titleSource = typeof project.title === "string" ? project.title : project.name;
      const title = typeof titleSource === "string" ? titleSource.trim() : "";
      const description = typeof project.description === "string" ? project.description : "";

      if (!title) {
        return null;
      }

      if (typeof id !== "string" && typeof id !== "number") {
        return null;
      }

      return {
        ...project,
        id,
        title,
        name: project.name || title,
        description,
        memberIds: Array.isArray(project.memberIds)
          ? project.memberIds.map((memberId) => (typeof memberId === "object" ? (memberId._id ?? memberId.id) : memberId))
          : [],
      };
    })
    .filter(Boolean);
};

const sanitizeTeamMembers = (teamMembers) => {
  if (!Array.isArray(teamMembers)) {
    return [];
  }

  return teamMembers
    .filter((member) => member && typeof member === "object")
    .map((member) => {
      const id = member.id ?? member._id;
      const name = typeof member.name === "string" ? member.name.trim() : "";
      const email = typeof member.email === "string" ? member.email.trim() : "";
      const password = typeof member.password === "string" ? member.password : "";

      if (!name || !email) {
        return null;
      }

      if (typeof id !== "string" && typeof id !== "number") {
        return null;
      }

      return {
        ...member,
        id,
        name,
        email,
        password,
        role: normalizeTeamMemberRole(member.role),
      };
    })
    .filter(Boolean);
};

const sanitizeTasks = (tasks) => {
  if (!Array.isArray(tasks)) {
    return [];
  }

  return tasks
    .filter((task) => task && typeof task === "object")
    .map((task) => {
      const id = task.id ?? task._id;
      const title = typeof task.title === "string" ? task.title.trim() : "";
      const projectIdRaw = task.projectId;
      const projectId = typeof projectIdRaw === "object"
        ? (projectIdRaw._id ?? projectIdRaw.id)
        : projectIdRaw;
      const priority = typeof task.priority === "string" && task.priority.trim() ? task.priority : "Medium";
      const status = normalizeTaskStatus(task.status);
      const completedAt = resolveTaskCompletionDate(task, null);

      if (!title) {
        return null;
      }

      if (typeof id !== "string" && typeof id !== "number") {
        return null;
      }

      if (typeof projectId !== "string" && typeof projectId !== "number") {
        return null;
      }

      return {
        ...task,
        id,
        title,
        status,
        completedAt,
        projectId,
        priority,
        subtasks: normalizeSubtasksArray(
          Array.isArray(task.subtasks)
            ? task.subtasks.map((subtask) => ({
                ...subtask,
                id: subtask.id ?? subtask._id,
                assigneeId: typeof subtask.assigneeId === "object"
                  ? (subtask.assigneeId._id ?? subtask.assigneeId.id)
                  : subtask.assigneeId,
              }))
            : [],
        ),
      };
    })
    .filter(Boolean);
};

const extractApiMessage = (error, fallbackMessage) => {
  const apiMessage = error?.response?.data?.message;
  return typeof apiMessage === "string" && apiMessage.trim() ? apiMessage : fallbackMessage;
};

function AppProvider({ children }) {
  const [user, setUserState] = useState(defaultUser);
  const [token, setTokenState] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const { addToast } = useToast();

  const isAdmin = useMemo(() => user?.role === TEAM_MEMBER_ROLES.ADMIN, [user?.role]);

  const showAccessDenied = (message) => {
    if (message) {
      addToast(message, "error");
    }
  };

  const resetAppState = () => {
    setUserState(defaultUser);
    setTokenState(null);
    setTeamMembers([]);
    setProjects([]);
    setTasks([]);
  };

  const hydrateDomainData = async (currentUser) => {
    const [projectsData, tasksData] = await Promise.all([
      getProjectsService(),
      getTasksService(),
    ]);

    let membersData = [];
    if (currentUser.role === TEAM_MEMBER_ROLES.ADMIN) {
      try {
        membersData = await getTeamMembersService();
      } catch {
        membersData = [];
      }
    }

    const safeUser = sanitizeUser(currentUser);
    const safeMembers = sanitizeTeamMembers(membersData);
    const withCurrentUser = [
      safeUser,
      ...safeMembers.filter((member) => toIdKey(member.id) !== toIdKey(safeUser.id)),
    ];

    setTeamMembers(withCurrentUser);
    setProjects(sanitizeProjects(projectsData));
    setTasks(sanitizeTasks(tasksData));
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      clearLegacyPersistence();
      const storedToken = getToken();
      if (!storedToken) {
        if (isMounted) {
          setIsBootstrapping(false);
        }
        return;
      }

      try {
        saveToken(storedToken);
        const me = await getCurrentUser();
        const safeUser = sanitizeUser(me);
        if (!safeUser.role) {
          throw new Error("Invalid user session");
        }

        if (!isMounted) {
          return;
        }

        setTokenState(storedToken);
        setUserState(safeUser);
        await hydrateDomainData(safeUser);
      } catch {
        clearToken();
        if (isMounted) {
          resetAppState();
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const registerAdminAccount = async (adminData) => {
    const name = typeof adminData?.name === "string" ? adminData.name.trim() : "";
    const email = typeof adminData?.email === "string" ? adminData.email.trim().toLowerCase() : "";
    const password = typeof adminData?.password === "string" ? adminData.password : "";

    if (!name || !email || !password) {
      return null;
    }

    try {
      const result = await registerAdminService({ name, email, password });
      if (!result?.token || !result?.user) {
        return null;
      }

      const safeUser = sanitizeUser(result.user);
      saveToken(result.token);
      setTokenState(result.token);
      setUserState(safeUser);
      await hydrateDomainData(safeUser);
      return safeUser;
    } catch (error) {
      addToast(extractApiMessage(error, "Could not create account. Try again."), "error");
      return null;
    }
  };

  const authenticateUser = async (emailValue, passwordValue) => {
    const email = String(emailValue || "").trim().toLowerCase();
    const password = String(passwordValue || "");

    if (!email || !password) {
      return null;
    }

    try {
      const result = await loginService({ email, password });
      if (!result?.token || !result?.user) {
        return null;
      }

      const safeUser = sanitizeUser(result.user);
      saveToken(result.token);
      setTokenState(result.token);
      setUserState(safeUser);
      await hydrateDomainData(safeUser);
      return safeUser;
    } catch (error) {
      addToast(extractApiMessage(error, "Invalid email or password."), "error");
      return null;
    }
  };

  const logout = async () => {
    clearToken();
    resetAppState();
    return true;
  };

  const updateCurrentUserProfile = async (profileData) => {
    const currentUser = sanitizeUser(user);
    if (!currentUser.role) {
      showAccessDenied("You must be logged in to update your profile");
      return null;
    }

    const name = typeof profileData?.name === "string" ? profileData.name.trim() : "";
    const email = typeof profileData?.email === "string" ? profileData.email.trim() : "";
    if (!name || !email) {
      addToast("Name and email are required", "error");
      return null;
    }

    const nextUser = {
      ...currentUser,
      name,
      email,
    };

    setUserState(nextUser);
    setTeamMembers((prevMembers) =>
      prevMembers.map((member) =>
        toIdKey(member.id) === toIdKey(currentUser.id)
          ? { ...member, name, email }
          : member,
      ),
    );

    addToast("Profile updated successfully", "success");
    return nextUser;
  };

  const addProject = async (project) => {
    if (!isAdmin) {
      showAccessDenied("Only admins can create projects");
      return null;
    }

    const titleSource = typeof project?.title === "string" && project.title.trim() ? project.title : project?.name;
    const title = typeof titleSource === "string" ? titleSource.trim() : "";
    if (!title) {
      showAccessDenied("Project name is required");
      return null;
    }

    try {
      const createdProject = await addProjectService({
        title,
        description: typeof project?.description === "string" ? project.description : "",
        memberIds: Array.isArray(project?.memberIds) ? project.memberIds : [],
      });

      if (!createdProject) {
        return null;
      }

      const safeProject = sanitizeProjects([createdProject])[0];
      setProjects((prev) => [safeProject, ...prev.filter((item) => toIdKey(item.id) !== toIdKey(safeProject.id))]);
      return safeProject;
    } catch (error) {
      showAccessDenied(extractApiMessage(error, "Failed to create project"));
      return null;
    }
  };

  const addTask = async (task) => {
    if (!isAdmin) {
      showAccessDenied("Only admins can create tasks");
      return null;
    }

    if (!task?.projectId) {
      showAccessDenied("Task must include a project");
      return null;
    }

    try {
      const createdTask = await addTaskService({
        ...task,
        title: String(task.title || "").trim(),
        status: normalizeTaskStatus(task.status),
        subtasks: normalizeSubtasksArray(task.subtasks || []),
      });

      if (!createdTask) {
        return null;
      }

      const safeTask = sanitizeTasks([createdTask])[0];
      setTasks((prev) => [safeTask, ...prev.filter((item) => toIdKey(item.id) !== toIdKey(safeTask.id))]);
      return safeTask;
    } catch (error) {
      showAccessDenied(extractApiMessage(error, "Failed to create task"));
      return null;
    }
  };

  const addTeamMember = async (member) => {
    if (!isAdmin) {
      showAccessDenied("Only admins can add team members");
      return null;
    }

    try {
      const createdMember = await addTeamMemberService(member);
      if (!createdMember) {
        return null;
      }

      const safeMember = sanitizeTeamMembers([createdMember])[0];
      setTeamMembers((prev) => [...prev, safeMember]);
      return safeMember;
    } catch (error) {
      showAccessDenied(extractApiMessage(error, "Failed to add member"));
      return null;
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    const matchingTask = tasks.find((task) => toIdKey(task.id) === toIdKey(taskId));
    if (!matchingTask) {
      return false;
    }

    const isMemberAssigned = user?.role === TEAM_MEMBER_ROLES.MEMBER &&
      String(matchingTask.assigneeId || "") === String(user?.id || "");

    if (!isAdmin && !isMemberAssigned) {
      showAccessDenied("You do not have permission to update this task");
      return false;
    }

    try {
      const updatedTask = await updateTaskStatusService(taskId, normalizeTaskStatus(newStatus));
      if (!updatedTask) {
        return false;
      }

      const safeTask = sanitizeTasks([updatedTask])[0];
      setTasks((prev) =>
        prev.map((task) => (toIdKey(task.id) === toIdKey(taskId) ? safeTask : task)),
      );
      return true;
    } catch (error) {
      showAccessDenied(extractApiMessage(error, "Failed to update task status"));
      return false;
    }
  };

  const deleteTask = async (taskId) => {
    if (!isAdmin) {
      showAccessDenied("Only admins can delete tasks");
      return false;
    }

    try {
      await deleteTaskService(taskId);
      setTasks((prev) => prev.filter((task) => toIdKey(task.id) !== toIdKey(taskId)));
      return true;
    } catch (error) {
      showAccessDenied(extractApiMessage(error, "Failed to delete task"));
      return false;
    }
  };

  const deleteProject = async (projectId) => {
    if (!isAdmin) {
      showAccessDenied("Only admins can delete projects");
      return false;
    }

    try {
      await deleteProjectService(projectId);
      setProjects((prev) => prev.filter((project) => toIdKey(project.id) !== toIdKey(projectId)));
      setTasks((prev) => prev.filter((task) => toIdKey(task.projectId) !== toIdKey(projectId)));
      return true;
    } catch (error) {
      showAccessDenied(extractApiMessage(error, "Failed to delete project"));
      return false;
    }
  };

  const updateTask = async (taskId, updatedData) => {
    if (!isAdmin) {
      showAccessDenied("Only admins can edit tasks");
      return false;
    }

    try {
      const updatedTask = await updateTaskService(taskId, updatedData);
      if (!updatedTask) {
        return false;
      }

      const safeTask = sanitizeTasks([updatedTask])[0];
      setTasks((prev) =>
        prev.map((task) => (toIdKey(task.id) === toIdKey(taskId) ? safeTask : task)),
      );
      return true;
    } catch (error) {
      showAccessDenied(extractApiMessage(error, "Failed to update task"));
      return false;
    }
  };

  const removeTeamMember = async (memberId) => {
    if (!isAdmin) {
      showAccessDenied("Only admins can remove team members");
      return false;
    }

    const memberToRemove = teamMembers.find((member) => toIdKey(member.id) === toIdKey(memberId));
    if (memberToRemove?.role === TEAM_MEMBER_ROLES.ADMIN) {
      showAccessDenied("Admin account cannot be removed");
      return false;
    }

    try {
      await removeTeamMemberService(memberId);
      setTeamMembers((prev) => prev.filter((member) => toIdKey(member.id) !== toIdKey(memberId)));
      setProjects((prev) =>
        prev.map((project) => ({
          ...project,
          memberIds: Array.isArray(project.memberIds)
            ? project.memberIds.filter((id) => toIdKey(id) !== toIdKey(memberId))
            : [],
        })),
      );
      setTasks((prev) =>
        prev.map((task) => ({
          ...task,
          assigneeId: toIdKey(task.assigneeId) === toIdKey(memberId) ? null : task.assigneeId,
          subtasks: normalizeSubtasksArray(task.subtasks).map((subtask) => ({
            ...subtask,
            assigneeId: toIdKey(subtask.assigneeId) === toIdKey(memberId) ? null : subtask.assigneeId,
          })),
        })),
      );
      return true;
    } catch (error) {
      showAccessDenied(extractApiMessage(error, "Failed to remove member"));
      return false;
    }
  };

  const value = {
    user,
    token,
    isBootstrapping,
    authenticateUser,
    registerAdminAccount,
    updateCurrentUserProfile,
    logout,
    teamMembers,
    projects,
    tasks,
    addProject,
    addTask,
    addTeamMember,
    removeTeamMember,
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
