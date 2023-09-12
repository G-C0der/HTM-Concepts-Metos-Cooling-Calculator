import {KettleCoolingModes} from "../enums/KettleCoolingModes";
import {KettleSizeLitres} from "../enums/KettleSizeLitres";
import {TimeUsage} from "../entities";

type IceWaterCoolingTypeCount = 0 | 1 | 2 | 3 | 4;

interface CalculatorParams {
  id: number;
  name: string;
  inUse: boolean;
  waterLitreCHF: number;
  waterLitreCo2: number;
  kwHourCHF: number;
  kwHourCo2: number;
  iceWaterCoolingType1Count: IceWaterCoolingTypeCount;
  iceWaterCoolingType4Count: IceWaterCoolingTypeCount;
  cop: number;
  kettles: CalculatorParamsKettle[];
  createdAt: Date;
  updatedAt: Date;
}

interface CalculatorParamsKettle {
  sizeLitres: KettleSizeLitres;
  coolingMode: KettleCoolingModes;
  c3CoolingPercent?: number;
  timeUsages: TimeUsage[];
}

type CalculatorParamsForm = Omit<CalculatorParams, 'id' | 'inUse' | 'createdAt' | 'updatedAt'>;

export type {
  IceWaterCoolingTypeCount,
  CalculatorParams,
  CalculatorParamsKettle,
  CalculatorParamsForm
};