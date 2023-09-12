import {
  FIELD_KWH_CHF,
  FIELD_LITRE_CHF,
  IceWaterCoolingMeasurements,
  Measurements,
  TapWaterCoolingMeasurements
} from "./DataProvider";
import {KettleEntity} from "../entities/KettleEntity";
import {IceWaterCoolingEntity, TimePowerUsageRow} from "../entities/IceWaterCoolingEntity";
import {KettleCoolingModes} from "../enums/KettleCoolingModes";
import {sortArrayOfObjectsByProperty} from "../utils/array";
import {Consumption} from "../components/ConsumptionDisplay/types";
import {TapWaterCoolingEntity} from "../entities/TapWaterCoolingEntity";
import {C5iRecommendationsRow} from "../components/C5iRecommendationsDataGrid/types";

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

  calculateMeasurementsTargetRow = (): Measurements | undefined => {
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

  calculateTimePowerRows = (): TimePowerUsageRow[] | undefined => {
    const iceWaterCoolingType1Count = this.iceWaterCoolingEntity.getType1Count();
    const iceWaterCoolingType4Count = this.iceWaterCoolingEntity.getType4Count();
    if (
      (iceWaterCoolingType1Count === 0
      && iceWaterCoolingType4Count === 0)
      || (iceWaterCoolingType1Count > 4
      || iceWaterCoolingType4Count > 4)
      || (iceWaterCoolingType1Count < 0
      || iceWaterCoolingType4Count < 0)
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

  calculateConsumption = () => {
    const waterConsumption: Consumption = { costCHF: 0, co2Grams: 0 };
    const electricityConsumption: Consumption = { costCHF: 0, co2Grams: 0 };
    const totalConsumption: Consumption = { costCHF: 0, co2Grams: 0 };

    // Calculate water and power used
    let foodLitresTotal = 0;
    let waterLitresUsed = 0;
    let powerKWUsed = 0;

    for (const kettleEntity of this.kettleEntities) {
      foodLitresTotal += kettleEntity.getDayFoodLitresSum();
      waterLitresUsed += kettleEntity.getDayWaterLitresUsed();
      powerKWUsed += kettleEntity.getDayPowerKWUsed();
    }
    powerKWUsed /= this.iceWaterCoolingEntity.getCop();

    // Calculate cost, co2 & time
    waterConsumption.costCHF = this.tapWaterCoolingEntity.waterLitreCHF * waterLitresUsed;
    waterConsumption.co2Grams = this.tapWaterCoolingEntity.waterLitreCo2 * waterLitresUsed;

    electricityConsumption.costCHF = this.iceWaterCoolingEntity.kwHourCHF * powerKWUsed;
    electricityConsumption.co2Grams = this.iceWaterCoolingEntity.kwHourCo2 * powerKWUsed;

    totalConsumption.costCHF = waterConsumption.costCHF + electricityConsumption.costCHF;
    totalConsumption.co2Grams = waterConsumption.co2Grams + electricityConsumption.co2Grams;

    return {
      waterConsumption,
      electricityConsumption,
      totalConsumption,
      waterLitresUsed,
      powerKWUsed,
      foodLitresTotal
    };
  };
  
  calculateC5iRecommendationsRows = (iceWaterCoolingEntity: IceWaterCoolingEntity): C5iRecommendationsRow[] => {
    // Fill up C5i C3 cooling percent
    const c3CoolingPercents = [];
    const { maxC5iCoolingPercent, minC5iCoolingPercent } = IceWaterCoolingEntity;

    for (let c5iC3CoolingPercent = maxC5iCoolingPercent; c5iC3CoolingPercent >= minC5iCoolingPercent; c5iC3CoolingPercent -= 10) {
      c3CoolingPercents.push(c5iC3CoolingPercent);
    }

    // Fill up rows
    const foodLitres = 200;
    let timePlus = 0;
    const rows = [];

    for (const c3CoolingPercent of c3CoolingPercents) {
      const c2CoolingPercent = 100 - c3CoolingPercent;

      const waterLitresUsed = KettleEntity.getWaterLitresUsedByFoodLitres(foodLitres, c2CoolingPercent);
      const powerKWUsed = KettleEntity.getPowerKWUsedByFoodLitres(foodLitres, c3CoolingPercent) / iceWaterCoolingEntity.getCop(); // TODO: put COP divisor into kettleEntity.getPowerKWUsedByFoodLitres functions if COP also needed for kettle time usage calculation

      const waterCostCHF = this.tapWaterCoolingEntity.waterLitreCHF * waterLitresUsed;
      const powerCostCHF = this.iceWaterCoolingEntity.kwHourCHF * powerKWUsed;
      const totalCostCHF = waterCostCHF + powerCostCHF;

      const waterCO2Grams = this.tapWaterCoolingEntity.waterLitreCo2 * waterLitresUsed;
      const powerCO2Grams = this.iceWaterCoolingEntity.kwHourCo2 * powerKWUsed;
      const totalCO2Grams = waterCO2Grams + powerCO2Grams;

      rows.push({
        id: c3CoolingPercent.toString(),
        c2CoolingPercent,
        c3CoolingPercent,
        waterLitresUsed,
        powerKWUsed,
        totalCostCHF,
        totalCO2Grams,
        timePlus
      });

      timePlus += 2;
    }

    return rows;
  };
}