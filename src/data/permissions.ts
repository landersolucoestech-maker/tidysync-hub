export interface Permission {
  id: string;
  label: string;
  description: string;
  type: "toggle" | "dropdown";
}

export interface PermissionCategory {
  id: string;
  label: string;
  permissions: Permission[];
}

export const scheduleVisibilityOptions = [
  { value: "all_days", label: "All Days" },
  { value: "today_tomorrow_6pm", label: "Today + Tomorrow at 6pm" },
  { value: "current_week", label: "Current Week" },
];

// ============================================
// PERMISSION CATEGORIES - TO BE DEFINED
// ============================================

export const permissionCategories: PermissionCategory[] = [];

// Flat list of all permissions
export const allPermissions = permissionCategories.flatMap(cat => cat.permissions);

// Get all permission IDs as a type
export type PermissionId = typeof allPermissions[number]["id"];
