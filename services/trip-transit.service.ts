import api, { createQueryParams } from "./api"
import type { PageRequest, PageResponse } from "./types"
import type { TransitPoint } from "./transit-point.service"

export interface TripTransit {
  id: string
  tripId: string
  transitPointId: string
  transitPoint: TransitPoint
  arrivalTime: string
  transitOrder: number
  type: "PICKUP" | "DROPOFF" | "STOP"
}

export interface CreateTripTransitDto {
  transitPointId: string
  arrivalTime: string
  type: "PICKUP" | "DROPOFF" | "STOP"
  transitOrder: number
}

export interface UpdateTripTransitDto {
  arrivalTime?: string
  type?: "PICKUP" | "DROPOFF" | "STOP"
}

export interface ReorderTripTransitDto {
  transitOrders: {
    id: string
    order: number
  }[]
}

const TripTransitService = {
  getPageByTripId: async (tripId: string, pageRequest: PageRequest): Promise<PageResponse<TripTransit>> => {
    const queryParams = createQueryParams(pageRequest)
    const response = await api.get<PageResponse<TripTransit>>(`/trips/${tripId}/transits?${queryParams}`)
    return response.data
  },

  getAvailableTransitPoints: async (tripId: string, pageRequest: PageRequest): Promise<PageResponse<TransitPoint>> => {
    const queryParams = createQueryParams(pageRequest)
    const response = await api.get<PageResponse<TransitPoint>>(
      `/trips/${tripId}/available-transit-points?${queryParams}`,
    )
    return response.data
  },

  create: async (tripId: string, tripTransit: CreateTripTransitDto): Promise<TripTransit> => {
    const response = await api.post<TripTransit>(`/trips/${tripId}/transits`, tripTransit)
    return response.data
  },

  update: async (tripId: string, transitId: string, tripTransit: UpdateTripTransitDto): Promise<TripTransit> => {
    const response = await api.put<TripTransit>(`/trips/${tripId}/transits/${transitId}`, tripTransit)
    return response.data
  },

  delete: async (tripId: string, transitId: string): Promise<void> => {
    await api.delete(`/trips/${tripId}/transits/${transitId}`)
  },

  reorder: async (tripId: string, reorderData: ReorderTripTransitDto): Promise<void> => {
    await api.put(`/trips/${tripId}/transits/reorder`, reorderData)
  },
}

export default TripTransitService
