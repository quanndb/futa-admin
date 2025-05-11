import api, { createQueryParams } from "./api"
import type { PageRequest, PageResponse } from "./types"

export interface Trip {
  id: string
  code: string
  name: string
  description: string
  status: "ACTIVE" | "INACTIVE"
  transitCount: number
  detailsCount: number
  createdAt: string
  lastModifiedAt: string
}

export interface CreateTripDto {
  code: string
  name: string
  description: string
  status: "ACTIVE" | "INACTIVE"
}

export interface UpdateTripDto {
  code?: string
  name?: string
  description?: string
  status?: "ACTIVE" | "INACTIVE"
}

const TripService = {
  getPage: async (pageRequest: PageRequest): Promise<PageResponse<Trip>> => {
    const queryParams = createQueryParams(pageRequest)
    const response = await api.get<PageResponse<Trip>>(`/trips?${queryParams}`)
    return response.data
  },

  getById: async (id: string): Promise<Trip> => {
    const response = await api.get<Trip>(`/trips/${id}`)
    return response.data
  },

  create: async (trip: CreateTripDto): Promise<Trip> => {
    const response = await api.post<Trip>("/trips", trip)
    return response.data
  },

  update: async (id: string, trip: UpdateTripDto): Promise<Trip> => {
    const response = await api.put<Trip>(`/trips/${id}`, trip)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/trips/${id}`)
  },
}

export default TripService
