export const ASSIGNABLE_ROLES = ["pending", "admin", "manager", "user"];
export const USER_STATUSES = ["pending", "approved", "rejected"];

export const decodeJwtPayload = (token) => {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const base64Url = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64Url.padEnd(
      base64Url.length + ((4 - (base64Url.length % 4)) % 4),
      "="
    );
    const jsonStr = decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
};

export const buildFormState = (sourceUser = {}, jwtPayload = null) => {
  const fullName =
    sourceUser?.name ??
    jwtPayload?.name ??
    `${sourceUser?.firstName || ""} ${sourceUser?.lastName || ""}`.trim();

  return {
    _id: sourceUser?._id ?? jwtPayload?.userId ?? "",
    name: fullName || "",
    firstName: sourceUser?.firstName ?? "",
    lastName: sourceUser?.lastName ?? "",
    email: sourceUser?.email ?? jwtPayload?.email ?? "",
    phone: sourceUser?.phone ?? "",
    role: (sourceUser?.role ?? jwtPayload?.role ?? "user").toLowerCase(),
    status: (sourceUser?.status ?? "pending").toLowerCase(),
    isActive: Boolean(sourceUser?.isActive ?? false),
    isEmailVerified: Boolean(sourceUser?.isEmailVerified ?? false),
  };
};