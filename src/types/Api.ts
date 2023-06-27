import React from "react";

interface ApiResponse {
  readonly success?: boolean;
  readonly error?: ApiError;
  readonly data?: any;
}

interface ApiError {
  readonly message: string;
  readonly severity: ApiErrorSeverity;
  modifiedMessage?: string | React.ReactNode;
}

type ApiErrorSeverity = 'error' | 'warning';

export type {
  ApiResponse,
  ApiError,
  ApiErrorSeverity
};