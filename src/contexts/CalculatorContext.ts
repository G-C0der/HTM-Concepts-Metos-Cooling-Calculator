import { createContext } from "react";
import {IceWaterCoolingEntity, KettleEntity, TapWaterCoolingEntity} from "../entities";
import {ApiDataCalculatorParamsList, ApiResponse} from "../types";
import {ContextProviderError} from "../errors";

type CalculatorContextType = {
  saveCalculatorParams: (
    saveName: string,
    iceWaterCoolingEntity: IceWaterCoolingEntity,
    tapWaterCoolingEntity: TapWaterCoolingEntity,
    kettleEntities: KettleEntity[]
  ) => Promise<ApiResponse>;
  listCalculatorParams: () => Promise<ApiResponse<ApiDataCalculatorParamsList>>;
};

const providerName = 'CalculatorProvider';
const CalculatorContext = createContext({
  saveCalculatorParams: () => { throw new ContextProviderError(providerName, 'saveCalculatorParams'); },
  listCalculatorParams: () => { throw new ContextProviderError(providerName, 'listCalculatorParams'); }
} as CalculatorContextType);

export {
  CalculatorContext
};