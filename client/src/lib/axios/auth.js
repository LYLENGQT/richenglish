import api from "./axios";
import useAuthStore from "../zustand/authStore";

export const login = async (email, password, remember = false) => {
  try {
    const response = await api.post("/auth/login", {
      email: email,
      password: password,
      remember: remember,
    });
    const data = response.data;

    const { id, name, email: userEmail, role } = data;

    const { setUser } = useAuthStore.getState();
    setUser(id, name, userEmail, role);

    return { user: data };
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const { clearUser } = useAuthStore.getState();
    const response = await api.delete("/auth/logout");

    clearUser();

    console.log(response);
    return response;
  } catch (error) {
    throw error;
  }
};

export default { login, logout };
