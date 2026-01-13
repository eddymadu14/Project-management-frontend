import api from "./api";

// --- Helper for saving and retrieving auth token ---
const TOKEN_KEY = "authToken";

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  delete api.defaults.headers.common["Authorization"];
};

// --- Register User ---
export const register = async (data) => {
  try {
    const res = await api.post("/register", data);
    const { token, user } = res.data;

    if (token) setToken(token);
    return { user, token, success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};


// --- Register Admin ---
export const registerAdmin = async (data) => {
  try {
    const res = await api.post("/adminreg", data);
    const { token, user } = res.data;

    if (token) setToken(token);
    return { user, token, success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

// --- Login User ---
export const login = async (data) => {
  try {
    const res = await api.post("/login", data);
    const { token, user } = res.data;

    if (token) setToken(token);
    return { user, token, success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

// --- Get Logged-in User Profile ---
export const getProfile = async () => {
  try {
    const res = await api.get("/api/user/me");
    return { user: res.data, success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

// --- Logout User ---
export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    clearToken();
  }
};

// --- Initialize token on page load ---
const existingToken = getToken();
if (existingToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${existingToken}`;
}
