export const PERMISSION_GROUPS = [
  { key: "DASHBOARD", perms: ["READ"] },
  { key: "STUDENT", perms: ["READ", "UPDATE", "WRITE", "EXPORT"] },
  { key: "ATTENDANCE_VIEW", perms: ["READ", "UPDATE", "WRITE", "EXPORT"] },
  { key: "ATTENDANCE_MARK", perms: ["READ", "WRITE", "UPDATE"] },
  { key: "UPDATION", perms: ["READ", "UPDATE", "WRITE"] },
  { key: "ADMINISTRATION_SLOT", perms: ["READ", "WRITE", "UPDATE"] },
  { key: "TRAINER", perms: ["READ", "WRITE", "UPDATE"] },
  { key: "TRAINER_ATTENDANCE_MARK", perms: ["READ", "WRITE", "UPDATE"] },
  { key: "TRAINER_ATTENDANCE_VIEW", perms: ["READ", "WRITE", "UPDATE"] },
  { key: "TRAINER_ATTENDANCE_REQUEST", perms: ["READ", "WRITE", "UPDATE"] },
];

// Sub Admin ka restricted permission set (attendance + students + trainers read-only)
export const SUB_ADMIN_PERMISSION_GROUPS = [
  { key: "ATTENDANCE_VIEW", perms: ["READ", "WRITE"] },
  { key: "ATTENDANCE_MARK", perms: ["READ", "UPDATE", "WRITE"] },
  { key: "ATTENDANCE_ADD_MULTI", perms: ["READ", "WRITE", "UPDATE"] },
  { key: "STUDENT", perms: ["READ", "WRITE", "UPDATE"] },
  { key: "TRAINER", perms: ["READ"] },
  { key: "TRAINER_ATTENDANCE_MARK", perms: ["READ", "WRITE", "UPDATE"] },
  { key: "TRAINER_ATTENDANCE_VIEW", perms: ["READ", "WRITE"] },
];

export function permissionGroupsForRole(role) {
  return role === "Sub Admin" ? SUB_ADMIN_PERMISSION_GROUPS : PERMISSION_GROUPS;
}

export function roleSlug(role) {
  return (role || "").toUpperCase().replace(/\s+/g, "_");
}
