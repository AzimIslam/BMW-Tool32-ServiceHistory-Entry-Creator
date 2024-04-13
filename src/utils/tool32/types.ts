import { ServiceItem, MaintenanceStatus } from './enums'

export type ServiceEntry = {
  item: ServiceItem
  status: MaintenanceStatus
  distanceRemaining: number
  monthsRemaining: number
}
