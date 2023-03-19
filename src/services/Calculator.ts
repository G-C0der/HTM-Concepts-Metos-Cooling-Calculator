import {FIELD_KW_HOUR_CHF, FIELD_LITRE_CHF, IceWaterBankMeasurements, TapWaterBankMeasurements} from "./DataProvider";
import {CauldronEntity} from "../entities/CauldronEntity";

export class Calculator {
  cauldronEntities: CauldronEntity[];
  tapWaterBankMeasurements?: TapWaterBankMeasurements;
  iceWaterBankMeasurements?: IceWaterBankMeasurements;

  constructor(
    cauldronEntities: CauldronEntity[]
  ) {
    this.cauldronEntities = cauldronEntities;
  }

  setTapWaterBankMeasurements = (tapWaterBankMeasurements: TapWaterBankMeasurements) => {
    this.tapWaterBankMeasurements = tapWaterBankMeasurements;
  };

  setIceWaterBankMeasurements = (iceWaterBankMeasurements: IceWaterBankMeasurements) => {
    this.iceWaterBankMeasurements = iceWaterBankMeasurements;
  };

  setTargetRow = () => {
    if (!this.tapWaterBankMeasurements || !this.iceWaterBankMeasurements) return;

    let lowestCostDifference;
    let lowestCostDifferenceIdx: number;
    for (let i = 0; i < this.tapWaterBankMeasurements.length && i < this.iceWaterBankMeasurements.length; i++) {
      const tapWaterBankCost = this.tapWaterBankMeasurements[i][FIELD_LITRE_CHF];
      const iceWaterBankCost = this.iceWaterBankMeasurements[i][FIELD_KW_HOUR_CHF];
      let costDifference;

      if (tapWaterBankCost <= iceWaterBankCost) costDifference = iceWaterBankCost - tapWaterBankCost;
      else costDifference = tapWaterBankCost - iceWaterBankCost;

      if (lowestCostDifference === undefined || lowestCostDifference > costDifference) {
        lowestCostDifference = costDifference;
        lowestCostDifferenceIdx = i;
      }
    }

    this.tapWaterBankMeasurements[lowestCostDifferenceIdx!]['target'] = true;
    this.iceWaterBankMeasurements[lowestCostDifferenceIdx!]['target'] = true;

    return {
      tapWaterBankMeasurements: (this.tapWaterBankMeasurements as TapWaterBankMeasurements),
      iceWaterBankMeasurements: (this.iceWaterBankMeasurements as IceWaterBankMeasurements)
    };
  };
}