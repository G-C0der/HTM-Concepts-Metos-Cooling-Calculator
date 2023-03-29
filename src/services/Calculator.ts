import {FIELD_KWH_CHF, FIELD_LITRE_CHF, IceWaterCoolingMeasurements, TapWaterCoolingMeasurements} from "./DataProvider";
import {KettleEntity} from "../entities/KettleEntity";
import {IceWaterCoolingEntity, TimePowerUsageRow} from "../entities/IceWaterCoolingEntity";
import {KettleCoolingModes} from "../enums/KettleCoolingModes";
import {sortArrayOfObjectsByProperty} from "../utils/array";
import {Result, TotalResult} from "../components/ResultDisplay/types";
import {TapWaterCoolingEntity} from "../entities/TapWaterCoolingEntity";

export class Calculator {
  kettleEntities: KettleEntity[];
  tapWaterCoolingMeasurements?: TapWaterCoolingMeasurements;
  iceWaterCoolingMeasurements?: IceWaterCoolingMeasurements;
  tapWaterCoolingEntity: TapWaterCoolingEntity;
  iceWaterCoolingEntity: IceWaterCoolingEntity;
  timePowerUsageRows: TimePowerUsageRow[];

  constructor(
    kettleEntities: KettleEntity[],
    tapWaterCoolingEntity: TapWaterCoolingEntity,
    iceWaterCoolingEntity: IceWaterCoolingEntity,
    timePowerUsageRows: TimePowerUsageRow[]
  ) {
    this.kettleEntities = kettleEntities;
    this.tapWaterCoolingEntity = tapWaterCoolingEntity;
    this.iceWaterCoolingEntity = iceWaterCoolingEntity;
    this.timePowerUsageRows = timePowerUsageRows;
  }

  setTapWaterCoolingMeasurements = (tapWaterCoolingMeasurements: TapWaterCoolingMeasurements) =>
    this.tapWaterCoolingMeasurements = tapWaterCoolingMeasurements;

  setIceWaterCoolingMeasurements = (iceWaterCoolingMeasurements: IceWaterCoolingMeasurements) =>
    this.iceWaterCoolingMeasurements = iceWaterCoolingMeasurements;

  calculateMeasurementsTargetRow = () => {
    if (!this.tapWaterCoolingMeasurements || !this.iceWaterCoolingMeasurements) return;

    let lowestCostDifference;
    let lowestCostDifferenceIdx: number;
    for (let i = 0; i < this.tapWaterCoolingMeasurements.length && i < this.iceWaterCoolingMeasurements.length; i++) {
      const tapWaterCoolingCost = this.tapWaterCoolingMeasurements[i][FIELD_LITRE_CHF];
      const iceWaterCoolingCost = this.iceWaterCoolingMeasurements[i][FIELD_KWH_CHF];
      let costDifference;

      if (tapWaterCoolingCost <= iceWaterCoolingCost) costDifference = iceWaterCoolingCost - tapWaterCoolingCost;
      else costDifference = tapWaterCoolingCost - iceWaterCoolingCost;

      if (lowestCostDifference === undefined || lowestCostDifference > costDifference) {
        lowestCostDifference = costDifference;
        lowestCostDifferenceIdx = i;
      }
    }

    this.tapWaterCoolingMeasurements[lowestCostDifferenceIdx!]['target'] = true;
    this.iceWaterCoolingMeasurements[lowestCostDifferenceIdx!]['target'] = true;

    return {
      tapWaterCoolingMeasurements: (this.tapWaterCoolingMeasurements as TapWaterCoolingMeasurements),
      iceWaterCoolingMeasurements: (this.iceWaterCoolingMeasurements as IceWaterCoolingMeasurements)
    };
  };

  calculateTimeTablePowerPercentages = () => {
    const iceWaterCoolingType1Count = this.iceWaterCoolingEntity.getType1Count();
    const iceWaterCoolingType4Count = this.iceWaterCoolingEntity.getType4Count();
    if (
      iceWaterCoolingType1Count <= 0
      && iceWaterCoolingType4Count <= 0
      || iceWaterCoolingType1Count > 4
      || iceWaterCoolingType4Count > 4
    ) return;

    // Set all rows to default value
    this.iceWaterCoolingEntity.setTimePowerUsageRows();

    // Make array of used power kW per time
    const electricCoolingModes = [KettleCoolingModes.C3, KettleCoolingModes.C5i];
    const electricCoolingModeKettleEntities = this.kettleEntities
      .filter(kettleEntity => electricCoolingModes.includes(kettleEntity.getCoolingMode()));
    const timeUsedPowerMap: { time: string, usedPowerKW: number }[] = [];

    for (const kettleEntity of electricCoolingModeKettleEntities) {
      for (const usageTime of kettleEntity.getTimeUsages()) {
        const existingTimePowerEntry = timeUsedPowerMap.find(timeUsedPowerEntry => timeUsedPowerEntry.time === usageTime.time);
        const usedPowerKW = kettleEntity.getPowerKWUsedByFoodLitres(usageTime.foodLitres);

        if (existingTimePowerEntry) {
          existingTimePowerEntry.usedPowerKW += usedPowerKW;
        } else {
          timeUsedPowerMap.push({ time: usageTime.time, usedPowerKW });
        }
      }
    }

    // Make array of used power kW by row index
    const timeIndexUsedPowerMap = timeUsedPowerMap.map(timeUsedPowerEntry => ({
      rowIndex: this.timePowerUsageRows.map(timePowerUsageRow => timePowerUsageRow.time).indexOf(timeUsedPowerEntry.time),
      usedPowerKW: timeUsedPowerEntry.usedPowerKW
    }));

    if (!timeIndexUsedPowerMap.length) return;

    // Sort smaller time indexes first
    sortArrayOfObjectsByProperty(timeIndexUsedPowerMap, 'rowIndex');

    // Calculate and set row values
    const usedPowerRowIndexes = timeIndexUsedPowerMap.map(timeIndexUsedPowerEntry => timeIndexUsedPowerEntry.rowIndex);
    const maxTimeIndex = 23;
    const maxPowerKW = this.iceWaterCoolingEntity.getMaxPowerKW();
    const rechargeRateKW = this.iceWaterCoolingEntity.getRechargeRateKW();

    let lastRowPowerKW;
    for (let rowIndex = timeIndexUsedPowerMap[0].rowIndex; rowIndex <= maxTimeIndex; rowIndex++) {
      // Recharge
      if (lastRowPowerKW && lastRowPowerKW < maxPowerKW) {
        const powerKWAfterRecharge = lastRowPowerKW + rechargeRateKW;
        this.timePowerUsageRows[rowIndex].powerKW! = powerKWAfterRecharge;
        if (powerKWAfterRecharge > maxPowerKW) this.timePowerUsageRows[rowIndex].powerKW! = maxPowerKW;
      }

      // Subtract cooling
      if (usedPowerRowIndexes.includes(rowIndex)) {
        this.timePowerUsageRows[rowIndex].powerKW! -= timeIndexUsedPowerMap.find(timeIndexUsedPowerEntry => timeIndexUsedPowerEntry.rowIndex === rowIndex)!.usedPowerKW;
      }

      // Assigning row power kW to buffer for next iteration usage
      lastRowPowerKW = this.timePowerUsageRows[rowIndex].powerKW!;
    }

    return (this.timePowerUsageRows as TimePowerUsageRow[]);
  };

  calculateResult = () => {
    const waterResult: Result = { costCHF: 0, co2Grams: 0 };
    const electricityResult: Result = { costCHF: 0, co2Grams: 0 };
    const totalResult: TotalResult = { costCHF: 0, co2Grams: 0, timeMin: 0 };

    // Calculate water and power used
    let waterLitresUsed = 0;
    let powerKWUsed = 0;

    for (const kettleEntity of this.kettleEntities) {
      waterLitresUsed += kettleEntity.getDayWaterLitresUsed();
      powerKWUsed += kettleEntity.getDayPowerKWUsed();
    }

    // Calculate cost, co2 & time
    waterResult.costCHF = this.tapWaterCoolingEntity.waterLitreCHF * waterLitresUsed;
    waterResult.co2Grams = this.tapWaterCoolingEntity.waterLitreCo2 * waterLitresUsed;

    electricityResult.costCHF = this.iceWaterCoolingEntity.kwHourCHF * powerKWUsed;
    electricityResult.co2Grams = this.iceWaterCoolingEntity.kwHourCo2 * powerKWUsed;

    totalResult.costCHF = waterResult.costCHF + electricityResult.costCHF;
    totalResult.co2Grams = waterResult.co2Grams + electricityResult.co2Grams;

    return {
      waterResult,
      electricityResult,
      totalResult
    };
  };
}