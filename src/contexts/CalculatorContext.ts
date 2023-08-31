import { createContext } from "react";
import {IceWaterCoolingEntity, KettleEntity, TapWaterCoolingEntity} from "../entities";
import {ApiDataCalculatorParamsList, ApiResponse, CalculatorParams} from "../types";
import {ContextProviderError} from "../errors";

type CalculatorContextType = {
  saveCalculatorParams: (
    saveName: string,
    iceWaterCoolingEntity: IceWaterCoolingEntity,
    tapWaterCoolingEntity: TapWaterCoolingEntity,
    kettleEntities: KettleEntity[]
  ) => Promise<ApiResponse>;
  updateCalculatorParams: (calculatorParams: CalculatorParams) => Promise<ApiResponse>;
  listCalculatorParams: () => Promise<ApiResponse<ApiDataCalculatorParamsList>>;
};

const providerName = 'CalculatorProvider';
const CalculatorContext = createContext({
  saveCalculatorParams: () => { throw new ContextProviderError(providerName, 'saveCalculatorParams'); },
  updateCalculatorParams: () => { throw new ContextProviderError(providerName, 'updateCalculatorParams'); },
  listCalculatorParams: () => { throw new ContextProviderError(providerName, 'listCalculatorParams'); },
} as CalculatorContextType);

export {
  CalculatorContext
};