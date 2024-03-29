import {IceWaterCoolingEntity, KettleEntity, TapWaterCoolingEntity} from "../entities";
import {toApiError, toApiResponse} from "./utils";
import calculatorApi from "../services/api/CalculatorApi";
import {KettleCoolingModes} from "../enums/KettleCoolingModes";
import {ApiDataCalculatorParams, ApiDataCalculatorParamsList, CalculatorParams, CalculatorParamsForm} from "../types";

const useCalculator = () => {
  const saveCalculatorParams = async (
    saveName: string,
    iceWaterCoolingEntity: IceWaterCoolingEntity,
    tapWaterCoolingEntity: TapWaterCoolingEntity,
    kettleEntities: KettleEntity[]
  ) => {
    try {
      const mapCalculatorParams = (
        saveName: string,
        iceWaterCoolingEntity: IceWaterCoolingEntity,
        tapWaterCoolingEntity: TapWaterCoolingEntity,
        kettleEntities: KettleEntity[]
      ): CalculatorParamsForm => ({
        name: saveName,
        waterLitreCHF: tapWaterCoolingEntity.waterLitreCHF,
        waterLitreCo2: tapWaterCoolingEntity.waterLitreCo2,
        kwHourCHF: iceWaterCoolingEntity.kwHourCHF,
        kwHourCo2: iceWaterCoolingEntity.kwHourCo2,
        iceWaterCoolingType1Count: iceWaterCoolingEntity.getType1Count(),
        iceWaterCoolingType4Count: iceWaterCoolingEntity.getType4Count(),
        cop: iceWaterCoolingEntity.getCop(),
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

      await calculatorApi.save(mapCalculatorParams(saveName, iceWaterCoolingEntity, tapWaterCoolingEntity, kettleEntities));
      return toApiResponse(true);
    } catch (err: any) {
      return toApiResponse(false, toApiError(err));
    }
  };

  const updateCalculatorParams = async (calculatorParams: CalculatorParams) => {
    try {
      const data = await calculatorApi.save(calculatorParams);
      return toApiResponse<ApiDataCalculatorParams>(true, undefined, data);
    } catch (err: any) {
      return toApiResponse(false, toApiError(err));
    }
  };

  const listCalculatorParams = async (resetParams?: boolean) => {
    try {
      const data = await calculatorApi.list(resetParams);
      return toApiResponse<ApiDataCalculatorParamsList>(true, undefined, data);
    } catch (err: any) {
      return toApiResponse(false, toApiError(err));
    }
  };

  const fetchSelectedCalculatorParams = async () => {
    try {
      const data = await calculatorApi.fetch();
      return toApiResponse<ApiDataCalculatorParams>(true, undefined, data);
    } catch (err: any) {
      return toApiResponse(false, toApiError(err));
    }
  };

  const deleteCalculatorParams = async (id: number) => {
    try {
      await calculatorApi.delete(id);
      return toApiResponse(true);
    } catch (err: any) {
      return toApiResponse(false, toApiError(err));
    }
  };

  return {
    saveCalculatorParams,
    updateCalculatorParams,
    listCalculatorParams,
    fetchSelectedCalculatorParams,
    deleteCalculatorParams
  };
};

export {
  useCalculator
};