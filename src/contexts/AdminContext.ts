import { createContext } from "react";
import {
  ApiDataAllCalculatorParamsList,
  ApiDataAuditLogList,
  ApiDataEmailSent,
  ApiDataUserList,
  ApiResponse
} from "../types";
import {ContextProviderError} from "../errors";
import {UserMode} from "../enums/UserMode";

type AdminContextType = {
  listUsers: () => Promise<ApiResponse<ApiDataUserList>>;
  changeUserMode: (id: number, mode: UserMode) => Promise<ApiResponse>;
  activateUser: (id: number) => Promise<ApiResponse<ApiDataEmailSent>>;
  deactivateUser: (id: number) => Promise<ApiResponse>;
  listAuditLogs: () => Promise<ApiResponse<ApiDataAuditLogList>>;
  listAllCalculatorParams: () => Promise<ApiResponse<ApiDataAllCalculatorParamsList>>;
};

const providerName = 'AdminProvider';
const AdminContext = createContext({
  listUsers: () => { throw new ContextProviderError(providerName, 'listUsers'); },
  changeUserMode: () => { throw new ContextProviderError(providerName, 'changeUserMode'); },
  activateUser: () => { throw new ContextProviderError(providerName, 'activateUser'); },
  deactivateUser: () => { throw new ContextProviderError(providerName, 'deactivateUser'); },
  listAuditLogs: () => { throw new ContextProviderError(providerName, 'listAuditLogs'); },
  listAllCalculatorParams: () => { throw new ContextProviderError(providerName, 'listAllCalculatorParams'); },
} as AdminContextType);

export {
  AdminContext
};
