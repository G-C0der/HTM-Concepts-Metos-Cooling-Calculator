import {IceWaterCoolingKw} from "../enums/IceWaterCoolingKw";

export class IceWaterCoolingEntity {
  kw: IceWaterCoolingKw = 0;
  kwHour: number = 0;
  kwHourCHF: number = 0;
  kwHourCo2: number = 0;
  type1Count: number = 0;
  type4Count: number = 0;

  getMaxPowerKW: () => number = () => {
    return (this.type1Count * 40) + (this.type4Count * 50);
  };

  getRechargeRateKW: () => number = () => {
    return (this.type1Count * 7) + (this.type4Count * 14);
  };
}