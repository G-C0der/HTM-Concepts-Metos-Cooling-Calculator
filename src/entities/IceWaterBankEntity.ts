import {IceWaterBankKw} from "../enums/IceWaterBankKw";

export class IceWaterBankEntity {
  static readonly rechargeRateKwPerHour: number = 13;
  kw: IceWaterBankKw = 0;
  kwHour: number = 0;
  kwHourCHF: number = 0;
  kwHourCo2: number = 0;
  iceKg: number = 0;
}