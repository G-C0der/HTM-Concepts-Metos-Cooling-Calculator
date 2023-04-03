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
  private sizeLitres: KettleSizeLitres = KettleSizeLitres.KettleSizeLitres200;
  private coolingMode: KettleCoolingModes = KettleCoolingModes.C2;
  timeUsageRows: TimeUsageRow[] = [];
  private c3CoolingPercent: number = IceWaterCoolingEntity.minCoolingPercent;
  private c2CoolingPercent: number = TapWaterCoolingEntity.maxCoolingPercent;
  
  constructor() {
    for (const hour of getHoursOfDay()) {
      this.timeUsageRows.push({ id: hour, time: hour, foodLitres: 0 });
    }
  }

  setSizeLitres = (sizeLitres: number) => {
    this.sizeLitres = sizeLitres;

    this.timeUsageRows = this.timeUsageRows.map(row =>
      ({ ...row, foodLitres: row.foodLitres > sizeLitres ? sizeLitres : row.foodLitres }));
  };

  getSizeLitres = () => this.sizeLitres;

  setCoolingMode = (coolingMode: KettleCoolingModes) => {
    this.coolingMode = coolingMode;

    if (coolingMode === KettleCoolingModes.C3) {
      this.c3CoolingPercent = IceWaterCoolingEntity.maxCoolingPercent;
      this.c2CoolingPercent = TapWaterCoolingEntity.minCoolingPercent;
    } else if (coolingMode === KettleCoolingModes.C2) {
      this.c2CoolingPercent = TapWaterCoolingEntity.maxCoolingPercent;
      this.c3CoolingPercent = IceWaterCoolingEntity.minCoolingPercent;
    } else if (coolingMode === KettleCoolingModes.C5i) {
      this.c3CoolingPercent = IceWaterCoolingEntity.maxC5iCoolingPercent;
      this.c2CoolingPercent = TapWaterCoolingEntity.minC5iCoolingPercent;
    }
  };

  getCoolingMode = () => this.coolingMode;

  /**
   * Set cooling percent for C3 and C2
   * @param c3CoolingPercent
   */
  setCoolingPercent = (c3CoolingPercent: number) => {
    if (c3CoolingPercent > IceWaterCoolingEntity.maxC5iCoolingPercent
      || c3CoolingPercent < IceWaterCoolingEntity.minC5iCoolingPercent) {
      throw new Error(`c3CoolingPercent has to be between 50 and 100, "${c3CoolingPercent}" provided`);
    }

    this.c3CoolingPercent = c3CoolingPercent;
    this.c2CoolingPercent = 100 - c3CoolingPercent;
  };

  getC3CoolingPercent = () => this.c3CoolingPercent;

  getTimeUsages = (): TimeUsage[] => this.timeUsageRows
    .filter(row => row.foodLitres > 0).map(({ id, ...props }) => props);

  /**
   * Get sum of food litres of the whole day
   */
  getDayFoodLitresSum = () => this.timeUsageRows
    .reduce((partialSum, row) => partialSum + row.foodLitres, 0);

  getPowerKWUsedByFoodLitres = (foodLitres: number, customC3CoolingPercent?: number) => {
    const powerKWUsedPerLitre = IceWaterCoolingEntity.maxPowerKWUsedPerLitre / 100 *
      (customC3CoolingPercent ?? this.c3CoolingPercent);

    return powerKWUsedPerLitre * foodLitres;
  };

  /**
   * Get power kW used of whole day
   */
  getDayPowerKWUsed = () => this.getPowerKWUsedByFoodLitres(this.getDayFoodLitresSum());

  /**
   * One degree Celsius here equals one percent cooled by C2
   * @param foodLitres
   */
  private getWaterLitresUsedPerDegreeCelsius = (foodLitres: number) => {
    const [, maxKettleSizeLitres] = getEnumMinMax(KettleSizeLitres);
    if (foodLitres > maxKettleSizeLitres || foodLitres < 1) {
      throw new Error(`foodLitres has to be between 1 and 400, "${foodLitres}" provided`);
    }

    if (foodLitres === 400) return 10;
    if (foodLitres >= 300) return 9;
    if (foodLitres >= 200) return 8;
    if (foodLitres >= 80) return 7;
    if (foodLitres >= 60) return 6;
    if (foodLitres >= 1) return 5;
  };

  getWaterLitresUsedByFoodLitres = (foodLitres: number, customC2CoolingPercent?: number) => {
    let waterLitresUsedPerDegreeCelsius = this.getWaterLitresUsedPerDegreeCelsius(foodLitres);

    return waterLitresUsedPerDegreeCelsius! * (customC2CoolingPercent ?? this.c2CoolingPercent);
  };

  /**
   * Get water litres used of whole day
   */
  getDayWaterLitresUsed = () => this.getTimeUsages().reduce((partialSum, timeUsage) =>
    partialSum + this.getWaterLitresUsedByFoodLitres(timeUsage.foodLitres) , 0);
}

export {
  KettleEntity
};

export type {
  TimeUsage,
  TimeUsageRow
};