import { useCallback, useEffect, useMemo, useState } from "react";
import AppContext from "./AppContext";
import { normalizeSubtasksArray } from "../utils/subtaskUtils";
import { useToast } from "../hooks/useToast";

const STORAGE_KEY = "planit_v1";
const TEAM_MEMBER_ROLES = {
  ADMIN: "Admin",
  MEMBER: "Member",
};

const VALID_TEAM_MEMBER_ROLES = new Set(Object.values(TEAM_MEMBER_ROLES));

const defaultUser = {
  id: null,
  name: "",
  email: "",
  password: "",
  role: "",
};

const defaultState = {
  user: defaultUser,
  activeWorkspaceId: "",
  workspacesById: {},
};

const toIdKey = (value) => String(value ?? "");

const createEmptyWorkspace = () => ({
  teamMembers: [],
  projects: [],
  tasks: [],
});

const getWorkspaceIdFromAdminEmail = (emailValue) =>
  `admin:${String(emailValue || "").trim().toLowerCase()}`;

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

  const id = user.id;
  const name = typeof user.name === "string" ? user.name.trim() : "";
  const email = typeof user.email === "string" ? user.email.trim() : "";
  const password = typeof user.password === "string" ? user.password : "";
  const role = normalizeUserRole(user.role);

  if (!name || !email) {
    return defaultUser;
  }

  if (typeof id !== "string" && typeof id !== "number") {
    return defaultUser;
  }

  return {
    ...defaultUser,
    ...user,
    id,
    name,
    email,
    password,
    role,
  };
};

const sanitizeProjects = (projects) => {
  if (!Array.isArray(projects)) {
    return [];
  }

  const sanitizeMemberIds = (memberIds) => {
    if (!Array.isArray(memberIds)) {
      return [];
    }

    const deduped = [];
    const seen = new Set();

    memberIds.forEach((memberId) => {
      const isValidType = typeof memberId === "string" || typeof memberId === "number";
      if (!isValidType) {
        return;
      }

      const key = `${typeof memberId}:${memberId}`;
      if (seen.has(key)) {
        return;
      }

      seen.add(key);
      deduped.push(memberId);
    });

    return deduped;
  };

  return projects
    .filter((project) => project && typeof project === "object")
    .map((project) => {
      const id = project.id;
      const titleSource = typeof project.title === "string"
        ? project.title
        : project.name;
      const title = typeof titleSource === "string"
        ? titleSource.trim()
        : "";
      const description = typeof project.description === "string"
        ? project.description
        : "";

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
        memberIds: sanitizeMemberIds(project.memberIds),
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
      const id = member.id;
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
      const id = task.id;
      const title = typeof task.title === "string" ? task.title.trim() : "";
      const projectId = task.projectId;
      const priority = typeof task.priority === "string" && task.priority.trim()
        ? task.priority
        : "Medium";

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
        status: normalizeTaskStatus(task.status),
        projectId,
        priority,
        subtasks: normalizeSubtasksArray(task.subtasks),
      };
    })
    .filter(Boolean);
};

const sanitizeWorkspace = (workspace) => {
  if (!workspace || typeof workspace !== "object") {
    return createEmptyWorkspace();
  }

  const teamMembers = sanitizeTeamMembers(workspace.teamMembers);
  const projects = sanitizeProjects(workspace.projects);
  const tasks = sanitizeTasks(workspace.tasks);
  const teamMemberIdSet = new Set(teamMembers.map((member) => toIdKey(member.id)));
  const projectIdSet = new Set(projects.map((project) => toIdKey(project.id)));

  const reconciledProjects = projects.map((project) => ({
    ...project,
    memberIds: Array.isArray(project.memberIds)
      ? project.memberIds.filter((memberId) => teamMemberIdSet.has(toIdKey(memberId)))
      : [],
  }));

  const reconciledTasks = tasks
    .filter((task) => projectIdSet.has(toIdKey(task.projectId)))
    .map((task) => ({
      ...task,
      assigneeId: teamMemberIdSet.has(toIdKey(task.assigneeId)) ? task.assigneeId : null,
      subtasks: normalizeSubtasksArray(task.subtasks).map((subtask) => ({
        ...subtask,
        assigneeId: teamMemberIdSet.has(toIdKey(subtask.assigneeId)) ? subtask.assigneeId : null,
      })),
    }));

  return {
    teamMembers,
    projects: reconciledProjects,
    tasks: reconciledTasks,
  };
};

const getWorkspaceSnapshot = (workspacesById, workspaceId) => {
  if (!workspaceId || !workspacesById[workspaceId]) {
    return createEmptyWorkspace();
  }

  return sanitizeWorkspace(workspacesById[workspaceId]);
};

function sanitizeStorageData(data) {
  if (!data || typeof data !== "object") {
    return null;
  }

  const user = sanitizeUser(data.user);
  let workspacesById = {};

  if (data.workspacesById && typeof data.workspacesById === "object") {
    Object.entries(data.workspacesById).forEach(([workspaceId, workspaceValue]) => {
      if (!workspaceId) {
        return;
      }

      workspacesById[workspaceId] = sanitizeWorkspace(workspaceValue);
    });
  } else {
    const legacyWorkspaceId = (
      user.role === TEAM_MEMBER_ROLES.ADMIN && user.email
        ? getWorkspaceIdFromAdminEmail(user.email)
        : "workspace:legacy"
    );

    workspacesById = {
      [legacyWorkspaceId]: sanitizeWorkspace({
        teamMembers: data.teamMembers,
        projects: data.projects,
        tasks: data.tasks,
      }),
    };
  }

  let activeWorkspaceId = typeof data.activeWorkspaceId === "string"
    ? data.activeWorkspaceId.trim()
    : "";

  if (!activeWorkspaceId || !workspacesById[activeWorkspaceId]) {
    if (user.role === TEAM_MEMBER_ROLES.ADMIN && user.email) {
      const adminWorkspaceId = getWorkspaceIdFromAdminEmail(user.email);
      activeWorkspaceId = workspacesById[adminWorkspaceId]
        ? adminWorkspaceId
        : Object.keys(workspacesById)[0] || "";
    } else {
      activeWorkspaceId = Object.keys(workspacesById)[0] || "";
    }
  }

  if (user.role === TEAM_MEMBER_ROLES.ADMIN && user.email) {
    const adminWorkspaceId = getWorkspaceIdFromAdminEmail(user.email);
    const currentWorkspace = workspacesById[adminWorkspaceId] || createEmptyWorkspace();
    const adminEmailLower = user.email.trim().toLowerCase();
    const nextTeamMembers = [
      {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password || "",
        role: TEAM_MEMBER_ROLES.ADMIN,
      },
      ...currentWorkspace.teamMembers.filter(
        (member) => member.email.trim().toLowerCase() !== adminEmailLower,
      ),
    ];

    workspacesById = {
      ...workspacesById,
      [adminWorkspaceId]: {
        ...currentWorkspace,
        teamMembers: nextTeamMembers,
      },
    };

    activeWorkspaceId = activeWorkspaceId || adminWorkspaceId;
  }

  return {
    user,
    activeWorkspaceId,
    workspacesById,
  };
}

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
    const sanitized = sanitizeStorageData(parsed);

    if (!sanitized) {
      return defaultState;
    }

    return sanitized;
  } catch {
    return defaultState;
  }
};

function AppProvider({ children }) {
  const [initialState] = useState(getInitialState);
  const [user, setUserState] = useState(initialState.user);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(initialState.activeWorkspaceId || "");
  const [workspacesById, setWorkspacesById] = useState(initialState.workspacesById || {});
  const { addToast } = useToast();

  const workspaceSnapshot = useMemo(
    () => getWorkspaceSnapshot(workspacesById, activeWorkspaceId),
    [activeWorkspaceId, workspacesById],
  );
  const teamMembers = workspaceSnapshot.teamMembers;
  const projects = workspaceSnapshot.projects;
  const tasks = workspaceSnapshot.tasks;

  const isAdmin = useMemo(
    () => user?.role === TEAM_MEMBER_ROLES.ADMIN,
    [user?.role],
  );

  const showAccessDenied = (message) => {
    if (message) {
      addToast(message, "error");
    }
  };

  const setUser = useCallback((nextUser) => {
    setUserState((prevUser) => {
      const resolvedUser = typeof nextUser === "function"
        ? nextUser(prevUser)
        : nextUser;

      return sanitizeUser(resolvedUser);
    });
  }, []);

  const updateCurrentWorkspace = useCallback((updater) => {
    if (!activeWorkspaceId) {
      return;
    }

    setWorkspacesById((prevWorkspaces) => {
      const currentWorkspace = sanitizeWorkspace(
        prevWorkspaces[activeWorkspaceId] || createEmptyWorkspace(),
      );
      const nextWorkspace = updater(currentWorkspace);

      return {
        ...prevWorkspaces,
        [activeWorkspaceId]: sanitizeWorkspace(nextWorkspace),
      };
    });
  }, [activeWorkspaceId]);

  const setTeamMembers = useCallback((nextTeamMembers) => {
    updateCurrentWorkspace((workspace) => {
      const prevTeamMembers = workspace.teamMembers || [];
      const resolvedTeamMembers = typeof nextTeamMembers === "function"
        ? nextTeamMembers(prevTeamMembers)
        : nextTeamMembers;

      return {
        ...workspace,
        teamMembers: sanitizeTeamMembers(resolvedTeamMembers),
      };
    });
  }, [updateCurrentWorkspace]);

  const setProjects = useCallback((nextProjects) => {
    updateCurrentWorkspace((workspace) => {
      const prevProjects = workspace.projects || [];
      const resolvedProjects = typeof nextProjects === "function"
        ? nextProjects(prevProjects)
        : nextProjects;

      return {
        ...workspace,
        projects: sanitizeProjects(resolvedProjects),
      };
    });
  }, [updateCurrentWorkspace]);

  const setTasks = useCallback((nextTasks) => {
    updateCurrentWorkspace((workspace) => {
      const prevTasks = workspace.tasks || [];
      const resolvedTasks = typeof nextTasks === "function"
        ? nextTasks(prevTasks)
        : nextTasks;

      return {
        ...workspace,
        tasks: sanitizeTasks(resolvedTasks),
      };
    });
  }, [updateCurrentWorkspace]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user,
          activeWorkspaceId,
          workspacesById,
        }),
      );
    } catch {
      // Ignore persistence failures (e.g. quota/privacy mode); app continues in memory.
    }
  }, [activeWorkspaceId, user, workspacesById]);

  const registerAdminAccount = (adminData) => {
    const name = typeof adminData?.name === "string" ? adminData.name.trim() : "";
    const email = typeof adminData?.email === "string" ? adminData.email.trim() : "";
    const password = typeof adminData?.password === "string" ? adminData.password : "";

    if (!name || !email || !password) {
      return null;
    }

    const workspaceId = getWorkspaceIdFromAdminEmail(email);
    const currentWorkspace = workspacesById[workspaceId] || createEmptyWorkspace();
    const emailLower = email.toLowerCase();
    const adminUser = {
      id: Date.now(),
      name,
      email,
      password,
      role: TEAM_MEMBER_ROLES.ADMIN,
    };
    const nextWorkspace = {
      ...currentWorkspace,
      teamMembers: [
        adminUser,
        ...currentWorkspace.teamMembers.filter(
          (member) => member.email.trim().toLowerCase() !== emailLower,
        ),
      ],
    };

    setWorkspacesById((prevWorkspaces) => ({
      ...prevWorkspaces,
      [workspaceId]: nextWorkspace,
    }));
    setActiveWorkspaceId(workspaceId);
    setUserState(adminUser);

    return adminUser;
  };

  const authenticateUser = (emailValue, passwordValue) => {
    const normalizedEmail = String(emailValue || "").trim().toLowerCase();
    const password = String(passwordValue || "");

    if (!normalizedEmail || !password) {
      return null;
    }

    for (const [workspaceId, workspace] of Object.entries(workspacesById)) {
      const members = sanitizeTeamMembers(workspace.teamMembers);
      const matchedUser = members.find(
        (member) =>
          member.email.trim().toLowerCase() === normalizedEmail &&
          String(member.password || "") === password,
      );

      if (!matchedUser) {
        continue;
      }

      const role = matchedUser.role === TEAM_MEMBER_ROLES.ADMIN
        ? TEAM_MEMBER_ROLES.ADMIN
        : TEAM_MEMBER_ROLES.MEMBER;
      const nextUser = {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        password: matchedUser.password || "",
        role,
      };

      setActiveWorkspaceId(workspaceId);
      setUserState(nextUser);

      return nextUser;
    }

    return null;
  };

  const logout = () => {
    setUserState(defaultUser);
    setActiveWorkspaceId("");
  };

  const addProject = (project) => {
    if (!isAdmin) {
      showAccessDenied("Only admins can create projects");
      return null;
    }

    const titleSource = typeof project?.title === "string" && project.title.trim()
      ? project.title
      : project?.name;
    const title = typeof titleSource === "string" ? titleSource.trim() : "";

    if (!title) {
      showAccessDenied("Project name is required");
      return null;
    }

    const rawMemberIds = Array.isArray(project.memberIds)
      ? project.memberIds.filter((memberId) => typeof memberId === "string" || typeof memberId === "number")
      : [];
    const dedupedMemberIds = [];
    const seenMemberIds = new Set();
    rawMemberIds.forEach((memberId) => {
      const key = `${typeof memberId}:${memberId}`;
      if (seenMemberIds.has(key)) {
        return;
      }
      seenMemberIds.add(key);
      dedupedMemberIds.push(memberId);
    });

    if (user?.id && !dedupedMemberIds.some((memberId) => toIdKey(memberId) === toIdKey(user.id))) {
      dedupedMemberIds.push(user.id);
    }

    const newProject = {
      id: Date.now(),
      createdAt: new Date(),
      ...project,
      title,
      name: project.name || title,
      description: typeof project.description === "string" ? project.description : "",
      memberIds: dedupedMemberIds,
    };

    setProjects((prev) => [newProject, ...prev]);

    return newProject;
  };

  const addTask = (task) => {
    if (!isAdmin) {
      showAccessDenied("Only admins can create tasks");
      return null;
    }
    if (!task.projectId) {
      showAccessDenied("Task must include a project");
      return null;
    }

    const projectExists = projects.some(
      (project) => toIdKey(project.id) === toIdKey(task.projectId),
    );

    if (!projectExists) {
      showAccessDenied("Task project does not exist");
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
    if (!isAdmin) {
      showAccessDenied("Only admins can add team members");
      return null;
    }

    const normalizedEmail = String(member?.email || "").trim().toLowerCase();
    const duplicateEmail = teamMembers.some(
      (teamMember) => teamMember.email.trim().toLowerCase() === normalizedEmail,
    );

    if (duplicateEmail) {
      showAccessDenied("A member with this email already exists");
      return null;
    }

    const newMember = {
      id: Date.now(),
      ...member,
      role: TEAM_MEMBER_ROLES.MEMBER,
    };

    setTeamMembers((prev) => [...prev, newMember]);

    return newMember;
  };

  const updateTaskStatus = (taskId, newStatus) => {
    const matchingTask = tasks.find(
      (task) => toIdKey(task.id) === toIdKey(taskId),
    );
    if (!matchingTask) {
      return;
    }

    const isMemberAssigned = (
      user?.role === TEAM_MEMBER_ROLES.MEMBER &&
      String(matchingTask.assigneeId || "") === String(user?.id || "")
    );

    if (!isAdmin && !isMemberAssigned) {
      showAccessDenied("You do not have permission to update this task");
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        toIdKey(task.id) === toIdKey(taskId)
          ? { ...task, status: newStatus }
          : task,
      ),
    );
  };

  const deleteTask = (taskId) => {
    if (!isAdmin) {
      showAccessDenied("Only admins can delete tasks");
      return;
    }

    setTasks((prev) =>
      prev.filter((task) => toIdKey(task.id) !== toIdKey(taskId)),
    );
  };

  const deleteProject = (projectId) => {
    if (!isAdmin) {
      showAccessDenied("Only admins can delete projects");
      return;
    }

    setProjects((prev) =>
      prev.filter((project) => toIdKey(project.id) !== toIdKey(projectId)),
    );

    setTasks((prev) =>
      prev.filter((task) => toIdKey(task.projectId) !== toIdKey(projectId)),
    );
  };

  const updateTask = (taskId, updatedData) => {
    if (!isAdmin) {
      showAccessDenied("Only admins can edit tasks");
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        toIdKey(task.id) === toIdKey(taskId)
          ? { ...task, ...updatedData }
          : task,
      ),
    );
  };

  const removeTeamMember = (memberId) => {
    if (!isAdmin) {
      showAccessDenied("Only admins can remove team members");
      return;
    }

    const memberToRemove = teamMembers.find(
      (member) => toIdKey(member.id) === toIdKey(memberId),
    );

    if (memberToRemove?.role === TEAM_MEMBER_ROLES.ADMIN) {
      showAccessDenied("Admin account cannot be removed from this workspace");
      return;
    }

    setTeamMembers((prev) =>
      prev.filter((member) => toIdKey(member.id) !== toIdKey(memberId)),
    );

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
          assigneeId: toIdKey(subtask.assigneeId) === toIdKey(memberId)
            ? null
            : subtask.assigneeId,
        })),
      })),
    );
  };

  const value = {
    user,
    setUser,
    activeWorkspaceId,
    authenticateUser,
    registerAdminAccount,
    logout,
    teamMembers,
    setTeamMembers,
    projects,
    setProjects,
    tasks,
    setTasks,
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
