import {KettleCoolingModes} from "../enums/KettleCoolingModes";
import {KettleSizeLitres} from "../enums/KettleSizeLitres";
import {TimeUsage} from "../entities";
import {IceWaterCoolingCount} from "../enums/IceWaterCoolingCount";

interface CalculatorParams {
  id: number;
  name: string;
  inUse: boolean;
  waterLitreCHF: number;
  waterLitreCo2: number;
  kwHourCHF: number;
  kwHourCo2: number;
  iceWaterCoolingType1Count: IceWaterCoolingCount;
  iceWaterCoolingType4Count: IceWaterCoolingCount;
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
  CalculatorParams,
  CalculatorParamsKettle,
  CalculatorParamsForm
};
