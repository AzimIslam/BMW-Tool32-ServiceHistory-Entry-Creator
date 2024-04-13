export enum MaintenanceStatus {
  ON_TIME = '0x1',
  LATE = '0x2',
  INCOMPLETE = '0x3'
}

export enum MileageUnit {
  MI,
  KM
}

export enum BMWService {
  NO = 0,
  YES = 1
}

export enum ServiceItem {
  ENGINE_OIL = 1,
  FRONT_BRAKES = 2,
  BRAKE_FLUID = 3,
  MICROFILTER = 4,
  RECIRCULATION_FILTER = 5,
  REAR_BRAKES = 6,
  SPARK_PLUGS = 10,
  AIR_FILTER_ELEMENT = 11,
  FUEL_FILTER = 12,
  STATUTORY_VEHICLE_INSPECTION = 32,
  VEHICLE_INSPECTION = 100
}
