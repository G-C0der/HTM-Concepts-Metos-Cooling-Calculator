interface Result {
  costCHF: number;
  co2Grams: number;
}

interface TotalResult extends Result {
  timeMin: number;
}

export type {
  Result,
  TotalResult
};