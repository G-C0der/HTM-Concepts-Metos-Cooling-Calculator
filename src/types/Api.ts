import React from "react";
import {AuditLog, User, UserFormEdit} from ".";

interface ApiResponse<T = never> {
  readonly success?: boolean;
  readonly error?: ApiError;
  readonly data?: T;
}

interface ApiError {
  readonly message: string;
  readonly severity: ApiErrorSeverity;
  modifiedMessage?: string | React.ReactNode;
}

type ApiErrorSeverity = 'error' | 'warning';

interface ApiDataEmailSent {
  wasEmailSent: boolean;
}

interface ApiDataUserFormEdit {
  form: UserFormEdit;
}

interface ApiDataUserList {
  users: User[];
}

interface ApiDataAuditLogList {
  auditLogs: AuditLog[];
}

export type {
  ApiResponse,
  ApiError,
  ApiErrorSeverity,

  ApiDataEmailSent,
  ApiDataUserFormEdit,
  ApiDataUserList,
  ApiDataAuditLogList
};