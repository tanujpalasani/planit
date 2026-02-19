export function normalizeSubtask(raw) {
  if (!raw || typeof raw !== "object") return null;

  return {
    id: raw.id ?? Date.now(),
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
            id: `legacy-${index}-${Date.now()}`,
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
