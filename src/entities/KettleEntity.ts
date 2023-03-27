import {KettleSizeLitres} from "../enums/KettleSizeLitres";
import {KettleCoolingModes} from "../enums/KettleCoolingModes";
import {getHoursOfDay} from "../utils/time";
import {IceWaterCoolingEntity} from "./IceWaterCoolingEntity";

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
  private c3CoolingPercent: number = 100;
  
  constructor() {
    for (const hour of getHoursOfDay()) {
      this.timeUsageRows.push({ id: hour, time: hour, foodLitres: 0 });
    }
  }

  setC3CoolingPercent = (c3CoolingPercent: number) => {
    if (c3CoolingPercent > 100 || c3CoolingPercent < 50) throw new Error(`c3CoolingPercent has to be between 50 and 100, "${c3CoolingPercent}" provided`);

    this.c3CoolingPercent = c3CoolingPercent;
  };

  getC3CoolingPercent = () => {
    return this.c3CoolingPercent;
  };

  getTimeUsages = (): TimeUsage[] => {
    return this.timeUsageRows.filter(row => row.foodLitres > 0).map(({ id, ...props }) => props);
  };

  getPowerKWUsedByFoodLitres = (foodLitres: number) => {
    const powerKWUsedPerLitre = IceWaterCoolingEntity.maxPowerKWUsedPerLitre / 100 * this.c3CoolingPercent;

    return powerKWUsedPerLitre * foodLitres;
  };
}

export {
  KettleEntity
};

export type {
  TimeUsage,
  TimeUsageRow
};