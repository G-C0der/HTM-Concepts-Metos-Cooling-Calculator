import { createContext } from "react";
import {IceWaterCoolingEntity, KettleEntity, TapWaterCoolingEntity} from "../entities";
import {ApiResponse} from "../types";
import {ContextProviderError} from "../errors";

type CalculatorContextType = {
  save: (
    iceWaterCoolingEntity: IceWaterCoolingEntity,
    tapWaterCoolingEntity: TapWaterCoolingEntity,
    kettleEntities: KettleEntity[]
  ) => Promise<ApiResponse>;
};

const providerName = 'CalculatorProvider';
const CalculatorContext = createContext({
  save: () => { throw new ContextProviderError(providerName, 'save'); }
} as CalculatorContextType);

export {
  CalculatorContext
};