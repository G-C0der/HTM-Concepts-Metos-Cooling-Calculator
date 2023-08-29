import {Api} from "./Api";
import {CalculatorParams} from "../../types";

class CalculatorApi extends Api {
  basePath = '/calculations';

  save = async (calculationData: CalculatorParams) => {
    const { data } = await this.api.post(this.basePath, calculationData);
    return data;
  };
}

export default new CalculatorApi();