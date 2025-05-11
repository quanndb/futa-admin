import api, { createQueryParams } from "./api"
import type { PageRequest, PageResponse } from "./types"

export interface TransitPoint {
  id: string
  name: string
  address: string
  hotline: string
  type: "PLACE" | "STATION" | "OFFICE" | "TRANSPORT"
  createdAt: string
  lastModifiedAt: string
}

export interface CreateTransitPointDto {
  name: string
  address: string
  hotline: string
  type: "PLACE" | "STATION" | "OFFICE" | "TRANSPORT"
}

export interface UpdateTransitPointDto {
  name?: string
  address?: string
  hotline?: string
  type?: "PLACE" | "STATION" | "OFFICE" | "TRANSPORT"
}

const TransitPointService = {
  getPage: async (pageRequest: PageRequest): Promise<PageResponse<TransitPoint>> => {
    const queryParams = createQueryParams(pageRequest)
    const response = await api.get<PageResponse<TransitPoint>>(`/transit-points?${queryParams}`)
    return response.data
  },

  getById: async (id: string): Promise<TransitPoint> => {
    const response = await api.get<TransitPoint>(`/transit-points/${id}`)
    return response.data
  },

  create: async (transitPoint: CreateTransitPointDto): Promise<TransitPoint> => {
    const response = await api.post<TransitPoint>("/transit-points", transitPoint)
    return response.data
  },

  update: async (id: string, transitPoint: UpdateTransitPointDto): Promise<TransitPoint> => {
    const response = await api.put<TransitPoint>(`/transit-points/${id}`, transitPoint)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/transit-points/${id}`)
  },
}

export default TransitPointService
