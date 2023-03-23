import {IceWaterCoolingKw} from "../enums/IceWaterCoolingKw";

export class IceWaterCoolingEntity {
  kw: IceWaterCoolingKw = 0;
  kwHour: number = 0;
  kwHourCHF: number = 0;
  kwHourCo2: number = 0;
  // used: boolean = true;
  type1Count: number = 0;
  type4Count: number = 0;

  getMaxPowerKw: () => number = () => {
    return (this.type1Count * 40) + (this.type4Count * 50);
  };

  getRechargeRateKw: () => number = () => {
    return (this.type1Count * 7) + (this.type4Count * 14);
  };
}