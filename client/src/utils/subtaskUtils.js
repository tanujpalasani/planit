function createSubtaskId(prefix = "subtask") {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

export function normalizeSubtask(raw) {
  if (!raw || typeof raw !== "object") return null;

  return {
    id: raw.id ?? createSubtaskId(),
    title: typeof raw.title === "string" ? raw.title : "",
    completed: Boolean(raw.completed),
    dueDate: raw.dueDate ?? null,
    assigneeId: raw.assigneeId ?? null,
  };
}

export function normalizeSubtasksArray(arr) {
  if (!Array.isArray(arr)) return [];

  return arr
    .map((item, index) =>
      typeof item === "string"
        ? {
            id: createSubtaskId(`legacy-${index}`),
            title: item,
            completed: false,
            dueDate: null,
            assigneeId: null,
          }
        : item,
    )
    .map(normalizeSubtask)
    .filter(Boolean);
}
