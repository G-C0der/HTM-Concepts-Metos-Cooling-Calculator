import {Api} from "./Api";
import {CalculationData} from "../../types";

class CalculatorApi extends Api {
  basePath = '/calculations';

  save = async (calculationData: CalculationData) => {
    const { data } = await this.api.post(this.basePath, calculationData);
    return data;
  };
}

export default new CalculatorApi();