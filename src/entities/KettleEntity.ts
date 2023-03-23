import {KettleSizeLitres} from "../enums/KettleSizeLitres";
import {KettleCoolingModes} from "../enums/KettleCoolingModes";
import {getHoursOfDay} from "../utils/time";

type UsageTimeRows = {
  id: string;
  time: string;
  foodLitres: number;
}[];

class KettleEntity {
  sizeLitres: KettleSizeLitres = KettleSizeLitres.KettleSizeLitres200;
  coolingMode: KettleCoolingModes = KettleCoolingModes.C2;
  usageTimeRows: UsageTimeRows = [];
  
  constructor() {
    for (const hour of getHoursOfDay()) {
      this.usageTimeRows.push({ id: hour, time: hour, foodLitres: 0 });
    }
  }
}

export {
  KettleEntity
};

export type {
  UsageTimeRows
};