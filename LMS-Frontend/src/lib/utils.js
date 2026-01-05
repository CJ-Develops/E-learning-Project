import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Database Role Constants
export const ROLES = {
  STUDENT: 0,
  TEACHER: 1,
  ADMIN: 2,
};

export const ROLE_LABELS = {
  [ROLES.STUDENT]: 'student',
  [ROLES.TEACHER]: 'teacher',
  [ROLES.ADMIN]: 'admin',
};

export function getRoleName(roleId) {
  return ROLE_LABELS[roleId] || 'student';
}

export function getRoleId(roleName) {
  const entry = Object.entries(ROLE_LABELS).find(([key, val]) => val === roleName.toLowerCase());
  return entry ? parseInt(entry[0]) : ROLES.STUDENT;
}
