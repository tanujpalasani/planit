import { useEffect, useState } from "react";
import AppContext from "./AppContext";
import { normalizeSubtasksArray } from "../utils/subtaskUtils";

const STORAGE_KEY = "planit_v1";
const TEAM_MEMBER_ROLES = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
};

const VALID_TEAM_MEMBER_ROLES = new Set(Object.values(TEAM_MEMBER_ROLES));

const defaultUser = {
  id: null,
  name: "",
  email: "",
};

const defaultState = {
  user: defaultUser,
  teamMembers: [],
  projects: [],
  tasks: [],
};

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

const sanitizeUser = (user) => {
  if (!user || typeof user !== "object") {
    return defaultUser;
  }

  const id = user.id;
  const name = typeof user.name === "string" ? user.name.trim() : "";
  const email = typeof user.email === "string" ? user.email.trim() : "";

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
  };
};

const sanitizeProjects = (projects) => {
  if (!Array.isArray(projects)) {
    return defaultState.projects;
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
    return defaultState.teamMembers;
  }

  return teamMembers
    .filter((member) => member && typeof member === "object")
    .map((member) => {
      const id = member.id;
      const name = typeof member.name === "string" ? member.name.trim() : "";
      const email = typeof member.email === "string" ? member.email.trim() : "";

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
        role: normalizeTeamMemberRole(member.role),
      };
    })
    .filter(Boolean);
};

const enforceSingleOwner = (teamMembers) => {
  let ownerFound = false;

  return teamMembers.map((member) => {
    if (member.role !== TEAM_MEMBER_ROLES.OWNER) {
      return member;
    }

    if (!ownerFound) {
      ownerFound = true;
      return member;
    }

    return {
      ...member,
      role: TEAM_MEMBER_ROLES.ADMIN,
    };
  });
};

const ensureCurrentUserOwner = (user, teamMembers) => {
  const hasValidUser = Boolean(
    user &&
    (typeof user.id === "string" || typeof user.id === "number") &&
    typeof user.name === "string" &&
    user.name.trim() &&
    typeof user.email === "string" &&
    user.email.trim(),
  );

  if (!hasValidUser) {
    return teamMembers;
  }

  const normalizedUserEmail = user.email.trim().toLowerCase();
  let matchedCurrentUser = false;

  const nextTeamMembers = teamMembers.map((member) => {
    const sameId = member.id === user.id;
    const sameEmail = member.email.trim().toLowerCase() === normalizedUserEmail;

    if (!sameId && !sameEmail) {
      return member;
    }

    matchedCurrentUser = true;

    return {
      ...member,
      id: user.id,
      name: user.name,
      email: user.email,
      role: TEAM_MEMBER_ROLES.OWNER,
    };
  });

  if (!matchedCurrentUser) {
    nextTeamMembers.push({
      id: user.id,
      name: user.name,
      email: user.email,
      role: TEAM_MEMBER_ROLES.OWNER,
    });
  }

  return nextTeamMembers;
};

const reconcileTeamMembers = (user, teamMembers) => {
  const withCurrentUserOwner = ensureCurrentUserOwner(user, teamMembers);
  return enforceSingleOwner(withCurrentUserOwner);
};

const getOwnerId = (teamMembers) => {
  const owner = teamMembers.find((member) => member.role === TEAM_MEMBER_ROLES.OWNER);
  return owner ? owner.id : null;
};

const reconcileProjectMembers = (projects, ownerId) => {
  return projects.map((project) => {
    const nextMemberIds = Array.isArray(project.memberIds)
      ? [...project.memberIds]
      : [];

    const ownerMissing = (
      (typeof ownerId === "string" || typeof ownerId === "number") &&
      !nextMemberIds.some((memberId) => memberId === ownerId)
    );

    if (ownerMissing) {
      nextMemberIds.push(ownerId);
    }

    if (nextMemberIds.length === 0 && (typeof ownerId === "string" || typeof ownerId === "number")) {
      nextMemberIds.push(ownerId);
    }

    return {
      ...project,
      memberIds: nextMemberIds,
    };
  });
};

const sanitizeTasks = (tasks) => {
  if (!Array.isArray(tasks)) {
    return defaultState.tasks;
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

function sanitizeStorageData(data) {
  if (!data || typeof data !== "object") return null;

  const user = sanitizeUser(data.user);
  const projects = sanitizeProjects(data.projects);
  const tasks = sanitizeTasks(data.tasks);
  const teamMembers = sanitizeTeamMembers(data.teamMembers);
  const reconciledTeamMembers = reconcileTeamMembers(user, teamMembers);
  const ownerId = getOwnerId(reconciledTeamMembers);
  const reconciledProjects = reconcileProjectMembers(projects, ownerId);

  return {
    user,
    projects: reconciledProjects,
    tasks,
    teamMembers: reconciledTeamMembers,
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

    return {
      user: sanitized.user,
      teamMembers: sanitized.teamMembers,
      projects: sanitized.projects,
      tasks: sanitized.tasks,
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
    const titleSource = typeof project?.title === "string" && project.title.trim()
      ? project.title
      : project?.name;
    const title = typeof titleSource === "string" ? titleSource.trim() : "";

    if (!title) {
      console.error("Project must have a name");
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

    const ownerId = getOwnerId(teamMembers);
    const ownerExists = typeof ownerId === "string" || typeof ownerId === "number";
    const ownerAlreadyAssigned = ownerExists && dedupedMemberIds.some((memberId) => memberId === ownerId);
    if (ownerExists && !ownerAlreadyAssigned) {
      dedupedMemberIds.push(ownerId);
    }
    if (dedupedMemberIds.length === 0 && ownerExists) {
      dedupedMemberIds.push(ownerId);
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
      role: normalizeTeamMemberRole(member?.role),
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
