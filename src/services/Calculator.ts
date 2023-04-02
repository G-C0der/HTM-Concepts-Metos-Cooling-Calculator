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

  calculateConsumption = () => {
    const waterConsumption: Consumption = { costCHF: 0, co2Grams: 0 };
    const electricityConsumption: Consumption = { costCHF: 0, co2Grams: 0 };
    const totalConsumption: Consumption = { costCHF: 0, co2Grams: 0 };

    // Calculate water and power used
    let waterLitresUsed = 0;
    let powerKWUsed = 0;

    for (const kettleEntity of this.kettleEntities) {
      waterLitresUsed += kettleEntity.getDayWaterLitresUsed();
      powerKWUsed += kettleEntity.getDayPowerKWUsed();
    }

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
      powerKWUsed
    };
  };
  
  calculateC5iRecommendationsRows = (): C5iRecommendationsRow[] => {
    // Fill up C5i C3 cooling percent
    // const c3CoolingPercents = [];
    // const { maxC5iCoolingPercent, minC5iCoolingPercent } = IceWaterCoolingEntity;
    //
    // for (let c5iC3CoolingPercent = maxC5iCoolingPercent; c5iC3CoolingPercent >= minC5iCoolingPercent; c5iC3CoolingPercent -= 10) {
    //   c3CoolingPercents.push(c5iC3CoolingPercent);
    // }
    //
    // // Fill up rows
    // const rows = [];
    //
    // for (const c3CoolingPercent of c3CoolingPercents) {
    //   rows.push({
    //     id: c3CoolingPercent,
    //     c2CoolingPercent: 100 - c3CoolingPercent,
    //     c3CoolingPercent,
    //     waterCostCHF:
    //   });
    // }

    return [
      {
        id: '100',
        c2CoolingPercent: 0,
        c3CoolingPercent: 100,
        waterCostCHF: 80,
        waterCO2Grams: 0,
        timePlus: 0,
        electricityCostCHF: 0,
        electricityCO2Grams: 0
      },
      {
        id: '90',
        c2CoolingPercent: 10,
        c3CoolingPercent: 90,
        waterCostCHF: 160,
        waterCO2Grams: 0,
        timePlus: 2,
        electricityCostCHF: 0,
        electricityCO2Grams: 0
      },
      {
        id: '80',
        c2CoolingPercent: 20,
        c3CoolingPercent: 80,
        waterCostCHF: 240,
        waterCO2Grams: 0,
        timePlus: 4,
        electricityCostCHF: 0,
        electricityCO2Grams: 0
      },
      {
        id: '70',
        c2CoolingPercent: 30,
        c3CoolingPercent: 70,
        waterCostCHF: 320,
        waterCO2Grams: 0,
        timePlus: 6,
        electricityCostCHF: 0,
        electricityCO2Grams: 0
      },
      {
        id: '60',
        c2CoolingPercent: 40,
        c3CoolingPercent: 60,
        waterCostCHF: 400,
        waterCO2Grams: 0,
        timePlus: 8,
        electricityCostCHF: 0,
        electricityCO2Grams: 0
      },
      {
        id: '50',
        c2CoolingPercent: 50,
        c3CoolingPercent: 50,
        waterCostCHF: 480,
        waterCO2Grams: 0,
        timePlus: 10,
        electricityCostCHF: 0,
        electricityCO2Grams: 0
      }
    ];
  };
}