import {IceWaterCoolingEntity, KettleEntity, TapWaterCoolingEntity} from "../entities";
import {toApiError, toApiResponse} from "./utils";
import calculatorApi from "../services/api/CalculatorApi";
import {KettleCoolingModes} from "../enums/KettleCoolingModes";
import {CalculationData} from "../types";

const useCalculator = () => {
  const save = async (
    iceWaterCoolingEntity: IceWaterCoolingEntity,
    tapWaterCoolingEntity: TapWaterCoolingEntity,
    kettleEntities: KettleEntity[]
  ) => {
    try {
      const mapCalculationData = (
        iceWaterCoolingEntity: IceWaterCoolingEntity,
        tapWaterCoolingEntity: TapWaterCoolingEntity,
        kettleEntities: KettleEntity[]
      ): CalculationData => ({
        waterLitreCHF: tapWaterCoolingEntity.waterLitreCHF,
        waterLitreCo2: tapWaterCoolingEntity.waterLitreCo2,
        kwHourCHF: iceWaterCoolingEntity.kwHourCHF,
        kwHourCo2: iceWaterCoolingEntity.kwHourCo2,
        type1Count: iceWaterCoolingEntity.getType1Count(),
        type4Count: iceWaterCoolingEntity.getType4Count(),
        kettles: kettleEntities.map(kettle => ({
          sizeLitres: kettle.getSizeLitres(),
          coolingMode: kettle.getCoolingMode(),
          ...(kettle.getCoolingMode() === KettleCoolingModes.C5i && { c3CoolingPercent: kettle.getC3CoolingPercent() }),
          timeUsages: kettle.timeUsageRows.filter(timeUsageRow => timeUsageRow.foodLitres).map(timeUsageRow => ({
            time: timeUsageRow.time,
            foodLitres: timeUsageRow.foodLitres
          }))
        }))
      });

      await calculatorApi.save(mapCalculationData(iceWaterCoolingEntity, tapWaterCoolingEntity, kettleEntities));
      return toApiResponse(true);
    } catch (err: any) {
      return toApiResponse(false, toApiError(err));
    }
  };

  return {
    save
  };
};

export {
  useCalculator
};