import {CoolingEntity} from "./CoolingEntity";

export class TapWaterCoolingEntity extends CoolingEntity {
  static readonly waterTemperatureDegreeCelsius = 15;
  waterLitreCHF: number = 0;
  waterLitreCo2: number = 0;
  static readonly maxC5iCoolingPercent = 50;
  static readonly minC5iCoolingPercent = 10;
}