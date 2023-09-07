import { createContext } from "react";
import {IceWaterCoolingEntity, KettleEntity, TapWaterCoolingEntity} from "../entities";
import {ApiDataCalculatorParams, ApiDataCalculatorParamsList, ApiResponse, CalculatorParams} from "../types";
import {ContextProviderError} from "../errors";

type CalculatorContextType = {
  saveCalculatorParams: (
    saveName: string,
    iceWaterCoolingEntity: IceWaterCoolingEntity,
    tapWaterCoolingEntity: TapWaterCoolingEntity,
    kettleEntities: KettleEntity[]
  ) => Promise<ApiResponse>;
  updateCalculatorParams: (calculatorParams: CalculatorParams) => Promise<ApiResponse<ApiDataCalculatorParams>>;
  listCalculatorParams: (resetParams?: boolean) => Promise<ApiResponse<ApiDataCalculatorParamsList>>;
  fetchSelectedCalculatorParams: () => Promise<ApiResponse<ApiDataCalculatorParams>>;
  deleteCalculatorParams: (id: number) => Promise<ApiResponse>;
};

const providerName = 'CalculatorProvider';
const CalculatorContext = createContext({
  saveCalculatorParams: () => { throw new ContextProviderError(providerName, 'saveCalculatorParams'); },
  updateCalculatorParams: () => { throw new ContextProviderError(providerName, 'updateCalculatorParams'); },
  listCalculatorParams: () => { throw new ContextProviderError(providerName, 'listCalculatorParams'); },
  fetchSelectedCalculatorParams: () => { throw new ContextProviderError(providerName, 'fetchSelectedCalculatorParams'); },
  deleteCalculatorParams: () => { throw new ContextProviderError(providerName, 'deleteCalculatorParams'); },
} as CalculatorContextType);

export {
  CalculatorContext
};