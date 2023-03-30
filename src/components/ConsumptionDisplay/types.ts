interface Consumption {
  costCHF: number;
  co2Grams: number;
}

interface ConsumptionResult {
  waterConsumption: Consumption;
  electricityConsumption: Consumption;
  totalConsumption: Consumption;
  waterLitresUsed: number;
  powerKWUsed: number;
}

export type {
  Consumption,
  ConsumptionResult
};