import { expect, it, describe, beforeAll } from 'vitest'
import { BMWService, MaintenanceStatus, MileageUnit, ServiceItem } from '@/utils/tool32/enums'
import type { ServiceEntry } from '../../../utils/tool32/types'
import { createServiceHistoryEntryArg } from '@/utils/tool32/functions'
import InvalidArgumentException from '@/utils/tool32/exceptions/InvalidArgumentException'

describe('#createServiceHistoryEntryArg', () => {
  const testDate = new Date(2024, 3, 13)
  const testMileage = 40000
  const testServiceType = BMWService.NO
  const testDealerName = 'BMAUTOT'
  const testMaintenanceStatus = MaintenanceStatus.ON_TIME

  it('should generate an argument successfully', () => {
    const testMileageUnit = MileageUnit.KM
    const testServices: ServiceEntry[] = [
      {
        item: ServiceItem.ENGINE_OIL,
        status: MaintenanceStatus.ON_TIME,
        distanceRemaining: 0,
        monthsRemaining: 0
      }
    ]

    const expectedResult = '13;04;2024;0;40000;0;BMAUTOT;0x1;1;1;0x1;0;0;'

    const actualResult = createServiceHistoryEntryArg(
      testDate,
      testMileage,
      testMileageUnit,
      testServiceType,
      testDealerName,
      testMaintenanceStatus,
      testServices
    )

    expect(actualResult).toEqual(expectedResult)
  })

  it('should convert miles to kilometres', () => {
    const testMileageUnit = MileageUnit.MI
    const testServices: ServiceEntry[] = [
      {
        item: ServiceItem.ENGINE_OIL,
        status: MaintenanceStatus.ON_TIME,
        distanceRemaining: 0,
        monthsRemaining: 0
      }
    ]

    const expectedResult = '13;04;2024;0;64374;0;BMAUTOT;0x1;1;1;0x1;0;0;'

    const actualResult = createServiceHistoryEntryArg(
      testDate,
      testMileage,
      testMileageUnit,
      testServiceType,
      testDealerName,
      testMaintenanceStatus,
      testServices
    )

    expect(actualResult).toEqual(expectedResult)
  })

  it('should throw InvalidArgumentException when no services are provided', () => {
    const testServices: ServiceEntry[] = []

    expect(() =>
      createServiceHistoryEntryArg(
        testDate,
        testMileage,
        MileageUnit.KM,
        testServiceType,
        testDealerName,
        testMaintenanceStatus,
        testServices
      )
    ).toThrowErrorMatchingSnapshot(
      'InvalidArgumentException: Cannot generate argument, if there are no service entries'
    )
  })

  it('should throw InvalidArgumentException when an entry has on time service with remaining distance or mileage', () => {
    const testServices: ServiceEntry[] = [
      {
        item: ServiceItem.ENGINE_OIL,
        status: MaintenanceStatus.ON_TIME,
        distanceRemaining: 100,
        monthsRemaining: 1
      }
    ]

    expect(() =>
      createServiceHistoryEntryArg(
        testDate,
        testMileage,
        MileageUnit.KM,
        testServiceType,
        testDealerName,
        testMaintenanceStatus,
        testServices
      )
    ).toThrowErrorMatchingSnapshot(
      'InvalidArgumentException: Cannot generate argument, if there are no service entries'
    )
  })
})
