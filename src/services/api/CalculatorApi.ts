import {Api} from "./Api";
import {CalculatorParamsForm} from "../../types";

class CalculatorApi extends Api {
  basePath = '/calculations';

  save = async (calculatorParams: CalculatorParamsForm) => {
    const { data } = await this.api.post(this.basePath, calculatorParams);
    return data;
  };

  list = async () => {
    const { data } = await this.api.get(this.basePath);
    return data;
  };
}

export default new CalculatorApi();