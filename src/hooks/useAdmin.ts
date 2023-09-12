import {auditLogApi, userApi} from "../services/api";
import {toApiError, toApiResponse} from "./utils";
import {ApiDataAuditLogList, ApiDataEmailSent, ApiDataUserList} from "../types";

const useAdmin = () => {
  const listUsers = async () => {
    try {
      const data = await userApi.list();
      return toApiResponse<ApiDataUserList>(true, undefined, data);
    } catch (err: any) {
      return toApiResponse(false, toApiError(err));
    }
  };

  const activateUser = async (id: number) => {
    try {
      const data = await userApi.changeActiveState(id, true);
      return toApiResponse<ApiDataEmailSent>(true, undefined, data);
    } catch (err: any) {
      return toApiResponse(false, toApiError(err));
    }
  };

  const deactivateUser = async (id: number) => {
    try {
      await userApi.changeActiveState(id, false);
      return toApiResponse(true);
    } catch (err: any) {
      return toApiResponse(false, toApiError(err));
    }
  };

  const listAuditLogs = async () => {
    try {
      const data = await auditLogApi.list();
      return toApiResponse<ApiDataAuditLogList>(true, undefined, data);
    } catch (err: any) {
      return toApiResponse(false, toApiError(err));
    }
  };

  return {
    listUsers,
    activateUser,
    deactivateUser,
    listAuditLogs
  }
};

export {
  useAdmin
};