import { ICONS } from "../components/admin/Icon";

// "path" ab react-router route (relative to /admin) hai, activePage state nahi.
export const SUPER_ADMIN_NAV_ITEMS = [
    { key: "dashboard", label: "Dashboard", icon: ICONS.grid, type: "link", path: "" },
    { key: "students", label: "Students", icon: ICONS.users, type: "link", path: "students" },
    {
        key: "attendance-group",
        label: "Attendance",
        icon: ICONS.calendar,
        type: "group",
        children: [
            { key: "mark-attendance", label: "Mark Attendance", path: "attendance/mark" },
            { key: "view-attendance", label: "View Attendance", path: "attendance/view" },
            { key: "multi-attendance", label: "Multi Attendance", path: "attendance/multi" },
        ],
    },
    {
        key: "administration-group",
        label: "Administration",
        icon: ICONS.shield,
        type: "group",
        children: [{ key: "administration", label: "Slots", path: "administration" }],
    },
    {
        key: "trainers-group",
        label: "Trainers",
        icon: ICONS.cap,
        type: "group",
        children: [
            { key: "trainers", label: "Trainers", path: "trainers" },
            {
                key: "trainer-attendance-subgroup",
                label: "Attendance",
                type: "subgroup",
                children: [
                    { key: "mark-trainer-attendance", label: "Mark Attendance", path: "trainers/attendance/mark" },
                    { key: "view-trainer-attendance", label: "View Attendance", path: "trainers/attendance/view" },
                    { key: "trainer-attendance-request", label: "Attendance Request", path: "trainers/attendance/request" },
                ],
            },
        ],
    },
    { key: "updation", label: "Updation", icon: ICONS.refresh, type: "link", path: "updation" },
    { key: "profile", label: "Profile", icon: ICONS.user, type: "link", path: "profile" },
];

// Sub Admin sidebar restricted hai: Dashboard, Administration, Updation aur
// Attendance Request nahi milte
export const SUB_ADMIN_NAV_ITEMS = [
    { key: "students", label: "Students", icon: ICONS.users, type: "link", path: "students" },
    {
        key: "attendance-group",
        label: "Attendance",
        icon: ICONS.calendar,
        type: "group",
        children: [
            { key: "mark-attendance", label: "Mark Attendance", path: "attendance/mark" },
            { key: "view-attendance", label: "View Attendance", path: "attendance/view" },
            { key: "multi-attendance", label: "Multi Attendance", path: "attendance/multi" },
        ],
    },
    {
        key: "trainers-group",
        label: "Trainers",
        icon: ICONS.cap,
        type: "group",
        children: [
            { key: "trainers", label: "Trainers", path: "trainers" },
            {
                key: "trainer-attendance-subgroup",
                label: "Attendance",
                type: "subgroup",
                children: [
                    { key: "mark-trainer-attendance", label: "Mark Attendance", path: "trainers/attendance/mark" },
                    { key: "view-trainer-attendance", label: "View Attendance", path: "trainers/attendance/view" },
                ],
            },
        ],
    },
    { key: "profile", label: "Profile", icon: ICONS.user, type: "link", path: "profile" },
];

export function navItemsForRole(role) {
    return role === "Sub Admin" ? SUB_ADMIN_NAV_ITEMS : SUPER_ADMIN_NAV_ITEMS;
}

// Har nav item/child ke label ko uske route path se dhoondta hai — topbar
// heading ke liye use hota hai
export function findActiveNavLabel(pathname, navItems) {
    for (const item of navItems) {
        if (item.type === "link" && matchPath(pathname, item.path)) return item.label;
        if (item.type === "group") {
            for (const child of item.children) {
                if (child.type === "subgroup") {
                    const sub = child.children.find((sc) => matchPath(pathname, sc.path));
                    if (sub) return sub.label;
                } else if (matchPath(pathname, child.path)) {
                    return child.label;
                }
            }
        }
    }
    return "Dashboard";
}

export function navGroupHasActive(item, pathname) {
    return item.children.some((c) => {
        if (c.type === "subgroup") return c.children.some((sc) => matchPath(pathname, sc.path));
        return matchPath(pathname, c.path);
    });
}

function matchPath(pathname, path) {
    // "" (dashboard/index) sirf jab /admin/dashboard ya /admin/dashboard/ pe hon
    if (path === "") return pathname === "/admin/dashboard" || pathname === "/admin/dashboard/";
    return pathname.startsWith(`/admin/dashboard/${path}`);
}