import {Api} from "./Api";

class AuditLogApi extends Api {
  basePath = '/audit-log';

  list = async () => {
    const { data } = await this.api.get(this.basePath);
    return data;
  };
}

export default new AuditLogApi();