// Export all services from a single file for easier imports
import AuthService from "./auth.service"
import TransitPointService from "./transit-point.service"
import TripService from "./trip.service"
import TripTransitService from "./trip-transit.service"
import TripDetailService from "./trip-detail.service"

// Export types
export type { PageRequest, PageResponse, ApiResponse } from "./types"
export type { TransitPoint, CreateTransitPointDto, UpdateTransitPointDto } from "./transit-point.service"
export type { Trip, CreateTripDto, UpdateTripDto } from "./trip.service"
export type {
  TripTransit,
  CreateTripTransitDto,
  UpdateTripTransitDto,
  ReorderTripTransitDto,
} from "./trip-transit.service"
export type {
  TripDetail,
  CreateTripDetailDto,
  UpdateTripDetailDto,
} from "./trip-detail.service"

export { AuthService, TransitPointService, TripService, TripTransitService, TripDetailService }
