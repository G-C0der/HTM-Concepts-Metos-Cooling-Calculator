import {KettleCoolingModes} from "../enums/KettleCoolingModes";
import {KettleSizeLitres} from "../enums/KettleSizeLitres";
import {TimeUsage} from "../entities";

type IceWaterCoolingTypeCount = 0 | 1 | 2 | 3 | 4;

interface CalculationData {
  name: string,
  waterLitreCHF: number,
  waterLitreCo2: number
  kwHourCHF: number,
  kwHourCo2: number,
  iceWaterCoolingType1Count: IceWaterCoolingTypeCount
  iceWaterCoolingType4Count: IceWaterCoolingTypeCount,
  cop: number,
  kettles: {
    sizeLitres: KettleSizeLitres,
    coolingMode: KettleCoolingModes,
    c3CoolingPercent?: number,
    timeUsages: TimeUsage[]
  }[]
}

export type {
  IceWaterCoolingTypeCount,
  CalculationData
};