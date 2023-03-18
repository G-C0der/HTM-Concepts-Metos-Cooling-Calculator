import {DataProvider, IceWaterBankMeasurements, TapWaterBankMeasurements} from "./DataProvider";
import {TapWaterBankEntity} from "../entities/TapWaterBankEntity";
import {IceWaterBankEntity} from "../entities/IceWaterBankEntity";
import {CauldronEntity} from "../entities/CauldronEntity";

export class Calculator {
  cauldronEntities: CauldronEntity[];
  tapWaterBankEntity: TapWaterBankEntity;
  iceWaterBankEntity: IceWaterBankEntity;
  tapWaterBankMeasurements?: TapWaterBankMeasurements;
  iceWaterBankMeasurements?: IceWaterBankMeasurements;
  result = 0;
  dataProvider;

  constructor(
    cauldronEntities: CauldronEntity[],
    tapWaterBankEntity: TapWaterBankEntity,
    iceWaterBankEntity: IceWaterBankEntity
  ) {
    this.cauldronEntities = cauldronEntities;
    this.tapWaterBankEntity = tapWaterBankEntity;
    this.iceWaterBankEntity = iceWaterBankEntity;

    this.dataProvider = new DataProvider(
      tapWaterBankEntity,
      iceWaterBankEntity
    );

    this.calculateResult();
  }

  calculateResult() {
    this.result = 0;

    const { iceWaterBankMeasurements, tapWaterBankMeasurements } = this.dataProvider.fetch();
    this.tapWaterBankMeasurements = tapWaterBankMeasurements;
    this.iceWaterBankMeasurements = iceWaterBankMeasurements;
    console.log(this.tapWaterBankMeasurements, this.iceWaterBankMeasurements)
    // for (const cauldronEntity of this.cauldronEntities) {
    //   this.result += cauldronEntity.sizeLitres;
    // }
    //
    // this.result += this.tapWaterBankEntity.waterLitreCHF + this.tapWaterBankEntity.waterLitreCo2;
    // this.result += this.iceWaterBankEntity.kwHourCo2 + this.iceWaterBankEntity.kwHourCHF;

    return this.result;
  }
}