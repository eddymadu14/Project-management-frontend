
export function parseJwt(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch (err) {
    return null;
  }
}

export function getUserRole() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const payload = parseJwt(token);
  return payload?.role || null;
}

