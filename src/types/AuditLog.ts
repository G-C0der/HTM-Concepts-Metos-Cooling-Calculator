import {User} from "./User";

interface AuditLog {
  id: string;
  action: AuditLogAction;
  operator: User['id'];
  user: User['id'];
  before: object;
  after: object;
  createdAt: Date;
  updatedAt: Date;
}

type AuditLogAction = 'registration' | 'verification' | 'passwordReset' | 'profileEdit' | 'activation' | 'deactivation';

export type {
  AuditLog,
  AuditLogAction
};