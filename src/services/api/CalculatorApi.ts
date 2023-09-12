import {Api} from "./Api";
import {CalculatorParamsForm} from "../../types";

class CalculatorApi extends Api {
  basePath = '/calculations';

  save = async (calculatorParams: CalculatorParamsForm) => {
    const { data } = await this.api.post(this.basePath, calculatorParams);
    return data;
  };

  list = async (resetParams?: boolean) => {
    let path = this.basePath;
    if (resetParams !== undefined) path += `?resetParams=${resetParams}`;
    const { data } = await this.api.get(path);
    return data;
  };

  fetch = async () => {
    const { data } = await this.api.get(`${this.basePath}/in-use`);
    return data;
  };

  delete = async (id: number) => {
    const { data } = await this.api.delete(`${this.basePath}/${id}`);
    return data;
  }
}

export default new CalculatorApi();