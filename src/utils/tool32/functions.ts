import { BMWService, MileageUnit, MaintenanceStatus } from './enums'
import type { ServiceEntry } from './types'

import InvalidArgumentException from './exceptions/InvalidArgumentException'

export function createServiceHistoryEntryArg(
  date: Date,
  mileage: number,
  mileageUnit: MileageUnit,
  serviceType: BMWService,
  dealerName: string,
  maintenanceStatus: MaintenanceStatus,
  services: ServiceEntry[]
): string {
  if (services.length == 0)
    throw new InvalidArgumentException('Cannot generate argument, if there are no service entries')

  const day: string = padZero(date.getDate()).toString()
  const month: string = padZero(date.getMonth() + 1).toString() // Months are zero-based
  const year: string = date.getFullYear().toString()
  const actualMileage = mileageUnit == MileageUnit.MI ? miToKm(mileage) : mileage

  let argument = `${day};${month};${year};0;${actualMileage};${serviceType.toString()};${dealerName};${maintenanceStatus.toString()};${services.length}`

  for (const { item, status, distanceRemaining, monthsRemaining } of services) {
    if (status == MaintenanceStatus.ON_TIME && distanceRemaining != 0 && monthsRemaining != 0)
      throw new InvalidArgumentException(
        'Illegal state, cannot service on time and have remaining distance or mileage left.'
      )
    const actualDistance =
      mileageUnit == MileageUnit.MI ? miToKm(distanceRemaining) : distanceRemaining
    argument += `;${item.toString()};${status.toString()};${actualDistance};${monthsRemaining};`
  }

  return argument
}

function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`
}

function miToKm(mi: number): number {
  if (mi == 0) return 0
  if (mi < 0) throw new InvalidArgumentException('Miles cannot be zero or negative')
  return Math.round(mi / 0.621371)
}
