import {IceWaterCoolingKw} from "../enums/IceWaterCoolingKw";

export class IceWaterCoolingEntity {
  static readonly rechargeRateKwPerHour: number = 13;
  kw: IceWaterCoolingKw = 0;
  kwHour: number = 0;
  kwHourCHF: number = 0;
  kwHourCo2: number = 0;
}