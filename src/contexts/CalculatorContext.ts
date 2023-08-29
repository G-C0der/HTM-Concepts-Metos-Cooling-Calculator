import { createContext } from "react";
import {IceWaterCoolingEntity, KettleEntity, TapWaterCoolingEntity} from "../entities";
import {ApiResponse, CalculatorParams} from "../types";
import {ContextProviderError} from "../errors";

type CalculatorContextType = {
  save: (
    saveName: string,
    iceWaterCoolingEntity: IceWaterCoolingEntity,
    tapWaterCoolingEntity: TapWaterCoolingEntity,
    kettleEntities: KettleEntity[]
  ) => Promise<ApiResponse>;
  list: () => Promise<ApiResponse<CalculatorParams>>;
};

const providerName = 'CalculatorProvider';
const CalculatorContext = createContext({
  save: () => { throw new ContextProviderError(providerName, 'save'); },
  list: () => { throw new ContextProviderError(providerName, 'list'); }
} as CalculatorContextType);

export {
  CalculatorContext
};