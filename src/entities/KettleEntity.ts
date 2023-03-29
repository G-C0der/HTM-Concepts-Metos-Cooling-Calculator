import {KettleSizeLitres} from "../enums/KettleSizeLitres";
import {KettleCoolingModes} from "../enums/KettleCoolingModes";
import {getHoursOfDay} from "../utils/time";
import {IceWaterCoolingEntity} from "./IceWaterCoolingEntity";
import {TapWaterCoolingEntity} from "./TapWaterCoolingEntity";
import {getEnumMinMax} from "../utils/enum";

interface TimeUsage {
  time: string;
  foodLitres: number;
}

interface TimeUsageRow extends TimeUsage {
  id: string;
}

class KettleEntity {
  sizeLitres: KettleSizeLitres = KettleSizeLitres.KettleSizeLitres200;
  private coolingMode: KettleCoolingModes = KettleCoolingModes.C2;
  timeUsageRows: TimeUsageRow[] = [];
  private c3CoolingPercent: number = IceWaterCoolingEntity.maxC5iC3CoolingPercent;
  private c2CoolingPercent: number = TapWaterCoolingEntity.minC5iC2CoolingPercent;
  
  constructor() {
    for (const hour of getHoursOfDay()) {
      this.timeUsageRows.push({ id: hour, time: hour, foodLitres: 0 });
    }
  }

  setCoolingMode = (coolingMode: KettleCoolingModes) => {
    this.coolingMode = coolingMode;

    if (coolingMode !== KettleCoolingModes.C5i && this.c3CoolingPercent !== IceWaterCoolingEntity.maxC5iC3CoolingPercent) {
      this.c3CoolingPercent = IceWaterCoolingEntity.maxC5iC3CoolingPercent;
    }
  };

  getCoolingMode = () => {
    return this.coolingMode;
  };

  /**
   * Set cooling percent for C3 and C2
   * @param c3CoolingPercent
   */
  setCoolingPercent = (c3CoolingPercent: number) => {
    if (c3CoolingPercent > IceWaterCoolingEntity.maxC5iC3CoolingPercent || c3CoolingPercent < IceWaterCoolingEntity.minC5iC3CoolingPercent) {
      throw new Error(`c3CoolingPercent has to be between 50 and 100, "${c3CoolingPercent}" provided`);
    }

    this.c3CoolingPercent = c3CoolingPercent;
    this.c2CoolingPercent = 100 - c3CoolingPercent;
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

  /**
   * One degree Celsius here equals one percent cooled by C2
   * @param foodLitres
   */
  private getWaterLitresUsedPerDegreeCelsius = (foodLitres: number) => {
    const [minKettleSizeLitres, maxKettleSizeLitres] = getEnumMinMax(KettleSizeLitres);
    if (foodLitres > maxKettleSizeLitres || foodLitres < minKettleSizeLitres) {
      throw new Error(`foodLitres has to be between 40 and 400, "${foodLitres}" provided`);
    }

    if (foodLitres === 400) return 10;
    if (foodLitres >= 300) return 9;
    if (foodLitres >= 200) return 8;
    if (foodLitres >= 80) return 7;
    if (foodLitres >= 60) return 6;
    if (foodLitres >= 40) return 5;
  };

  getWaterLitresUsedByFoodLitres = (foodLitres: number) => {
    let waterLitresUsedPerDegreeCelsius = this.getWaterLitresUsedPerDegreeCelsius(foodLitres);

    return waterLitresUsedPerDegreeCelsius! * this.c2CoolingPercent;
  };
}

export {
  KettleEntity
};

export type {
  TimeUsage,
  TimeUsageRow
};