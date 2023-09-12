import React from "react";
import {AuditLog, CalculatorParams, User, UserFormEdit} from ".";

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

interface ApiDataCalculatorParamsList {
  calculatorParamsList: CalculatorParams[];
}

interface ApiDataCalculatorParams {
  calculatorParams: CalculatorParams;
}

export type {
  ApiResponse,
  ApiError,
  ApiErrorSeverity,

  ApiDataEmailSent,
  ApiDataUserFormEdit,
  ApiDataUserList,
  ApiDataAuditLogList,
  ApiDataCalculatorParamsList,
  ApiDataCalculatorParams
};