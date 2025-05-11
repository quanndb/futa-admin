import api, { createQueryParams } from "./api"
import type { PageRequest, PageResponse } from "./types"

export interface TripDetail {
  id: string
  tripId: string
  tripCode: string
  fromDate: string
  toDate: string
  type: "SEAT" | "BED" | "VIP"
  price: number
  status: "ACTIVE" | "INACTIVE"
  createdAt: string
  lastModifiedAt: string
}

export interface CreateTripDetailDto {
  tripId: string
  tripCode: string
  fromDate: string
  toDate: string
  type: "SEAT" | "BED" | "VIP"
  price: number
  status: "ACTIVE" | "INACTIVE"
}

export interface UpdateTripDetailDto {
  fromDate?: string
  toDate?: string
  type?: "SEAT" | "BED" | "VIP"
  price?: number
  status?: "ACTIVE" | "INACTIVE"
}

const TripDetailService = {
  getPageByTripId: async (tripId: string, pageRequest: PageRequest): Promise<PageResponse<TripDetail>> => {
    const queryParams = createQueryParams(pageRequest)
    const response = await api.get<PageResponse<TripDetail>>(`/trips/${tripId}/details?${queryParams}`)
    return response.data
  },

  getById: async (tripId: string, detailId: string): Promise<TripDetail> => {
    const response = await api.get<TripDetail>(`/trips/${tripId}/details/${detailId}`)
    return response.data
  },

  create: async (tripId: string, tripDetail: CreateTripDetailDto): Promise<TripDetail> => {
    const response = await api.post<TripDetail>(`/trips/${tripId}/details`, tripDetail)
    return response.data
  },

  update: async (tripId: string, detailId: string, tripDetail: UpdateTripDetailDto): Promise<TripDetail> => {
    const response = await api.put<TripDetail>(`/trips/${tripId}/details/${detailId}`, tripDetail)
    return response.data
  },

  delete: async (tripId: string, detailId: string): Promise<void> => {
    await api.delete(`/trips/${tripId}/details/${detailId}`)
  },
}

export default TripDetailService
