import { createContext } from "react";
import {ApiDataAuditLogList, ApiDataEmailSent, ApiDataUserList, ApiResponse} from "../types";

type AdminContextType = {
  listUsers: () => Promise<ApiResponse<ApiDataUserList>>;
  activateUser: (id: string) => Promise<ApiResponse<ApiDataEmailSent>>;
  deactivateUser: (id: string) => Promise<ApiResponse>;
  listAuditLogs: () => Promise<ApiResponse<ApiDataAuditLogList>>;
};

const AdminContext = createContext({
  listUsers: () =>
  { throw new Error('listUsers: AdminProvider is not set up. Wrap the app with an AdminProvider.'); },
  activateUser: () =>
  { throw new Error('activateUser: AdminProvider is not set up. Wrap the app with an AdminProvider.'); },
  deactivateUser: () =>
  { throw new Error('deactivateUser: AdminProvider is not set up. Wrap the app with an AdminProvider.'); },
  listAuditLogs: () =>
  { throw new Error('listAuditLogs: AdminProvider is not set up. Wrap the app with an AdminProvider.'); }
} as AdminContextType);

export {
  AdminContext
};