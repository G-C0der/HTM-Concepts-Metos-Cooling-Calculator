import {IceWaterCoolingKw} from "../enums/IceWaterCoolingKw";
import {getHoursOfDay} from "../utils/time";
import {CoolingEntity} from "./CoolingEntity";

interface TimePowerUsage {
  time: string;
  powerKW?: number;
}

interface TimePowerUsageRow extends TimePowerUsage {
  id: string;
}

class IceWaterCoolingEntity extends CoolingEntity {
  kw: IceWaterCoolingKw = 0;
  static readonly kwHour: number = 1;
  kwHourCHF: number = 0;
  kwHourCo2: number = 0;
  private type1Count: number = 0;
  private type4Count: number = 0;
  timePowerUsageRows: TimePowerUsageRow[] = [];
  static readonly maxPowerKWUsedPerLitre: number = 0.11;
  static readonly maxC5iCoolingPercent = 100;
  static readonly minC5iCoolingPercent = 50;

  constructor() {
    super();

    for (const hour of getHoursOfDay()) {
      this.timePowerUsageRows.push({ id: hour, time: hour, powerKW: undefined });
    }
  }

  setType1Count = (type1Count: number) => {
    this.type1Count = type1Count;

    this.setTimePowerUsageRows();
  };

  getType1Count = () => this.type1Count;

  setType4Count = (type4Count: number) => {
    this.type4Count = type4Count;

    this.setTimePowerUsageRows();
  };

  getType4Count = () => this.type4Count;

  getMaxPowerKW = () => (this.type1Count * 40) + (this.type4Count * 50);

  getRechargeRateKW = () => (this.type1Count * 7) + (this.type4Count * 14);

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