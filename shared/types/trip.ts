import type { RideProvider } from '../constants/providers'

export type { RideProvider } from '../constants/providers'

export type Trip = {
  provider: RideProvider
  startedAt: Date
  endedAt: Date | null
  pickup: string | null
  dropoff: string | null
  fare: number | null
  currency: string | null
  distanceKm: number | null
  status: string | null
  vehicleType: string | null
  pickupLat: number | null
  pickupLng: number | null
  dropoffLat: number | null
  dropoffLng: number | null
  sourceFile: string
}
