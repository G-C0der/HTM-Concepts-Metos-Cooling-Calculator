import {KettleCoolingModes} from "../enums/KettleCoolingModes";
import {KettleSizeLitres} from "../enums/KettleSizeLitres";
import {TimeUsage} from "../entities";

type IceWaterCoolingTypeCount = 0 | 1 | 2 | 3 | 4;

interface CalculationData {
  waterLitreCHF: number,
  waterLitreCo2: number
  kwHourCHF: number,
  kwHourCo2: number,
  type1Count: IceWaterCoolingTypeCount
  type4Count: IceWaterCoolingTypeCount,
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