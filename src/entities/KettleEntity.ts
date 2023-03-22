import {KettleSizeLitres} from "../enums/KettleSizeLitres";
import {KettleCoolingModes} from "../enums/KettleCoolingModes";

export class KettleEntity {
  sizeLitres: KettleSizeLitres = KettleSizeLitres.KettleSizeLitres200;
  foodLitres: number = 0;
  coolingMode: KettleCoolingModes = KettleCoolingModes.C2;
  usageTimes: readonly string[] = [];
}