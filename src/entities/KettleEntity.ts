import {KettleSizeLitres} from "../enums/KettleSizeLitres";
import {KettleCoolingModes} from "../enums/KettleCoolingModes";
import {getHoursOfDay} from "../utils/time";

interface UsageTime {
  time: string;
  foodLitres: number;
}

interface UsageTimeRow extends UsageTime {
  id: string;
}

class KettleEntity {
  sizeLitres: KettleSizeLitres = KettleSizeLitres.KettleSizeLitres200;
  coolingMode: KettleCoolingModes = KettleCoolingModes.C2;
  usageTimeRows: UsageTimeRow[] = [];
  
  constructor() {
    for (const hour of getHoursOfDay()) {
      this.usageTimeRows.push({ id: hour, time: hour, foodLitres: 0 });
    }
  }

  getUsageTimes = (): UsageTime[] => {
    return this.usageTimeRows.filter(row => row.foodLitres > 0).map(({ id, ...props }) => props);
  };
}

export {
  KettleEntity
};

export type {
  UsageTime,
  UsageTimeRow
};