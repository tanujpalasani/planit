import apiClient, {
  clearStoredToken,
  getStoredToken,
  setApiToken,
  setStoredToken,
} from "./apiClient";

const LEGACY_KEYS = ["planit_v1", "planit_v2", "planit_v2_token"];

export const clearLegacyPersistence = () => {
  if (typeof window === "undefined") {
    return;
  }

  LEGACY_KEYS.forEach((key) => {
    window.localStorage.removeItem(key);
  });
};

const normalizeId = (value) => {
  if (!value || typeof value !== "object") {
    return value;
  }

  const id = value.id ?? value._id ?? null;
  return {
    ...value,
    id,
  };
};

const normalizeUser = (user) => {
  const normalized = normalizeId(user);
  if (!normalized) {
    return null;
  }

  return {
    ...normalized,
    adminId: normalized.adminId ?? null,
  };
};

const normalizeProject = (project) => {
  const normalized = normalizeId(project);
  if (!normalized) {
    return null;
  }

  return {
    ...normalized,
    memberIds: Array.isArray(normalized.memberIds)
      ? normalized.memberIds.map((memberId) => (typeof memberId === "object" ? (memberId._id ?? memberId.id) : memberId))
      : [],
  };
};

const normalizeTask = (task) => {
  const normalized = normalizeId(task);
  if (!normalized) {
    return null;
  }

  return {
    ...normalized,
    projectId: typeof normalized.projectId === "object"
      ? (normalized.projectId._id ?? normalized.projectId.id)
      : normalized.projectId,
    assigneeId: typeof normalized.assigneeId === "object"
      ? (normalized.assigneeId._id ?? normalized.assigneeId.id)
      : normalized.assigneeId,
    subtasks: Array.isArray(normalized.subtasks)
      ? normalized.subtasks.map((subtask) => ({
          ...subtask,
          id: subtask?.id ?? subtask?._id ?? null,
          assigneeId: typeof subtask?.assigneeId === "object"
            ? (subtask.assigneeId._id ?? subtask.assigneeId.id)
            : (subtask?.assigneeId ?? null),
        }))
      : [],
  };
};

export const getToken = () => getStoredToken();

export const saveToken = (token) => {
  setStoredToken(token);
  setApiToken(token);
};

export const clearToken = () => {
  clearStoredToken();
  setApiToken(null);
};

export const registerAdmin = async (payload) => {
  const { data } = await apiClient.post("/auth/register", payload);
  return {
    token: data?.token ?? null,
    user: normalizeUser(data?.user),
  };
};

export const login = async (payload) => {
  const { data } = await apiClient.post("/auth/login", payload);
  return {
    token: data?.token ?? null,
    user: normalizeUser(data?.user),
  };
};

export const getCurrentUser = async () => {
  const { data } = await apiClient.get("/auth/me");
  return normalizeUser(data?.user);
};

export const getTeamMembers = async () => {
  const { data } = await apiClient.get("/users");
  const users = Array.isArray(data?.users) ? data.users : [];
  return users.map(normalizeUser).filter(Boolean);
};

export const addTeamMember = async (payload) => {
  const { data } = await apiClient.post("/users", payload);
  return normalizeUser(data?.user);
};

export const removeTeamMember = async (memberId) => {
  await apiClient.delete(`/users/${memberId}`);
  return true;
};

export const getProjects = async () => {
  const { data } = await apiClient.get("/projects");
  const projects = Array.isArray(data?.projects) ? data.projects : [];
  return projects.map(normalizeProject).filter(Boolean);
};

export const addProject = async (payload) => {
  const { data } = await apiClient.post("/projects", payload);
  return normalizeProject(data?.project);
};

export const updateProject = async (projectId, payload) => {
  const { data } = await apiClient.put(`/projects/${projectId}`, payload);
  return normalizeProject(data?.project);
};

export const deleteProject = async (projectId) => {
  await apiClient.delete(`/projects/${projectId}`);
  return true;
};

export const getTasks = async () => {
  const { data } = await apiClient.get("/tasks");
  const tasks = Array.isArray(data?.tasks) ? data.tasks : [];
  return tasks.map(normalizeTask).filter(Boolean);
};

export const addTask = async (payload) => {
  const { data } = await apiClient.post("/tasks", payload);
  return normalizeTask(data?.task);
};

export const updateTask = async (taskId, payload) => {
  const { data } = await apiClient.put(`/tasks/${taskId}`, payload);
  return normalizeTask(data?.task);
};

export const updateTaskStatus = async (taskId, status) => {
  const { data } = await apiClient.patch(`/tasks/${taskId}/status`, { status });
  return normalizeTask(data?.task);
};

export const deleteTask = async (taskId) => {
  await apiClient.delete(`/tasks/${taskId}`);
  return true;
};
