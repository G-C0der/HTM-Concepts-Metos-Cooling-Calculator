import { createContext } from "react";
import {ApiDataAuditLogList, ApiDataEmailSent, ApiDataUserList, ApiResponse} from "../types";
import {ContextProviderError} from "../errors";

type AdminContextType = {
  listUsers: () => Promise<ApiResponse<ApiDataUserList>>;
  activateUser: (id: string) => Promise<ApiResponse<ApiDataEmailSent>>;
  deactivateUser: (id: string) => Promise<ApiResponse>;
  listAuditLogs: () => Promise<ApiResponse<ApiDataAuditLogList>>;
};

const providerName = 'AdminProvider';
const AdminContext = createContext({
  listUsers: () => { throw new ContextProviderError(providerName, 'listUsers'); },
  activateUser: () => { throw new ContextProviderError(providerName, 'activateUser'); },
  deactivateUser: () => { throw new ContextProviderError(providerName, 'deactivateUser'); },
  listAuditLogs: () => { throw new ContextProviderError(providerName, 'listAuditLogs'); }
} as AdminContextType);

export {
  AdminContext
};