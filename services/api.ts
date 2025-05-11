import axios from "axios"
import type { PageRequest } from "./types"

// Tạo một instance Axios với cấu hình mặc định
const api = axios.create({
  baseURL: "https://better-unduly-shiner.ngrok-free.app",
  headers: {
    "Content-Type": "application/json",
  },
})

// Thêm interceptor request để bao gồm token xác thực
api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("authToken")

    // Nếu token tồn tại, thêm vào headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Thêm interceptor response để xử lý lỗi
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Xử lý lỗi unauthorized (401)
    if (error.response && error.response.status === 401) {
      // Xóa localStorage và chuyển hướng đến trang đăng nhập
      localStorage.removeItem("isAuthenticated")
      localStorage.removeItem("authToken")
      window.location.href = "/login"
    }

    return Promise.reject(error)
  },
)

// Hàm hỗ trợ để chuyển đổi PageRequest thành query params
export const createQueryParams = (pageRequest: PageRequest): string => {
  const params = new URLSearchParams()

  params.append("pageIndex", pageRequest.pageIndex.toString())
  params.append("pageSize", pageRequest.pageSize.toString())

  if (pageRequest.keyword) {
    params.append("keyword", pageRequest.keyword)
  }

  if (pageRequest.ids && pageRequest.ids.length > 0) {
    pageRequest.ids.forEach((id) => params.append("ids", id))
  }

  if (pageRequest.excludeIds && pageRequest.excludeIds.length > 0) {
    pageRequest.excludeIds.forEach((id) => params.append("excludeIds", id))
  }

  return params.toString()
}

export default api
