import {IceWaterCoolingKw} from "../enums/IceWaterCoolingKw";
import {getHoursOfDay} from "../utils/time";

interface TimePowerUsage {
  time: string;
  powerKW?: number;
}

interface TimePowerUsageRow extends TimePowerUsage {
  id: string;
}

class IceWaterCoolingEntity {
  kw: IceWaterCoolingKw = 0;
  static readonly kwHour: number = 1;
  kwHourCHF: number = 0;
  kwHourCo2: number = 0;
  private type1Count: number = 0;
  private type4Count: number = 0;
  timePowerUsageRows: TimePowerUsageRow[] = [];
  static readonly maxPowerKWUsedPerLitre: number = 0.11;
  static readonly maxC5iC3CoolingPercent = 100;
  static readonly minC5iC3CoolingPercent = 50;

  constructor() {
    for (const hour of getHoursOfDay()) {
      this.timePowerUsageRows.push({ id: hour, time: hour, powerKW: undefined });
    }
  }

  setType1Count = (type1Count: number) => {
    this.type1Count = type1Count;

    this.setTimePowerUsageRows();
  };

  getType1Count = () => {
    return this.type1Count;
  };

  setType4Count = (type4Count: number) => {
    this.type4Count = type4Count;

    this.setTimePowerUsageRows();
  };

  getType4Count = () => {
    return this.type4Count;
  };

  getMaxPowerKW = () => {
    return (this.type1Count * 40) + (this.type4Count * 50);
  };

  getRechargeRateKW = () => {
    return (this.type1Count * 7) + (this.type4Count * 14);
  };

  setTimePowerUsageRows = () => {
    for (const timePowerUsageRow of this.timePowerUsageRows) {
      timePowerUsageRow.powerKW = this.getMaxPowerKW();
    }
  };
}

export {
  IceWaterCoolingEntity
};

export type {
  TimePowerUsage,
  TimePowerUsageRow
};