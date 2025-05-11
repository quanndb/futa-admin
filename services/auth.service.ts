import api from "./api"

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    role: string
  }
}

const AuthService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/iam/auth/login", credentials)
    return response.data
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/iam/auth/logout")
    } catch (error) {
      console.error("Lỗi đăng xuất:", error)
    } finally {
      // Xóa local storage bất kể phản hồi API
      localStorage.removeItem("authToken")
      localStorage.removeItem("isAuthenticated")
    }
  },

  getCurrentUser: async () => {
    const response = await api.get("/iam/auth/me")
    return response.data
  },
}

export default AuthService
