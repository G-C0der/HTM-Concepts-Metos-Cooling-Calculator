import {KettleSizeLitres} from "../enums/KettleSizeLitres";
import {KettleCoolingModes} from "../enums/KettleCoolingModes";
import {getHoursOfDay} from "../utils/time";

interface TimeUsage {
  time: string;
  foodLitres: number;
}

interface TimeUsageRow extends TimeUsage {
  id: string;
}

class KettleEntity {
  sizeLitres: KettleSizeLitres = KettleSizeLitres.KettleSizeLitres200;
  coolingMode: KettleCoolingModes = KettleCoolingModes.C2;
  timeUsageRows: TimeUsageRow[] = [];
  
  constructor() {
    for (const hour of getHoursOfDay()) {
      this.timeUsageRows.push({ id: hour, time: hour, foodLitres: 0 });
    }
  }

  getTimeUsages = (): TimeUsage[] => {
    return this.timeUsageRows.filter(row => row.foodLitres > 0).map(({ id, ...props }) => props);
  };
}

export {
  KettleEntity
};

export type {
  TimeUsage,
  TimeUsageRow
};