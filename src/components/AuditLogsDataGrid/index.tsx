import React, {useContext, useEffect, useState} from 'react';
import {ApiError, AuditLog, AuditLogAction} from "../../types";
import {DataGridPremium, GridColDef, GridToolbar} from "@mui/x-data-grid-premium";
import moment from "moment";
import {AdminContext} from "../../contexts";
import {ErrorAlert} from "../ErrorAlert";
import Box from "@mui/material/Box";
import {CircularProgress} from "@mui/material";
import { AuditLogDetailsDataGrid } from '../AuditLogDetailsDataGrid';

interface AuditLogsDataGridProps {
  isAdminModalOpen: boolean;
}

const AuditLogsDataGrid = ({ isAdminModalOpen }: AuditLogsDataGridProps) => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>();
  const [error, setError] = useState<ApiError>();
  const [isLoading, setIsLoading] = useState(true);

  const { listAuditLogs } = useContext(AdminContext);

  const actionDisplayMap = {
    registration: 'Registration',
    verification: 'Verification',
    passwordReset: 'Password Reset',
    profileEdit: 'Profile Edit',
    activation: 'Activation',
    deactivation: 'Deactivation'
  };

  const columns: GridColDef[] = [
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      valueGetter: (params) => getActionDisplayName(params.value)
    },
    {
      field: 'operator',
      headerName: 'Operator',
      width: 300,
      valueGetter: (params) => params.value.email
    },
    {
      field: 'user',
      headerName: 'User',
      width: 300,
      valueGetter: (params) => params.value.email
    },
    {
      field: 'createdAt',
      headerName: 'Timestamp',
      width: 200,
      valueGetter: (params) => moment(params.value).format('DD.MM.YYYY HH:mm:ss')
    }
  ];

  useEffect(() => {
    if (isAdminModalOpen) {
      const setAuditLogList = async () => {
        const auditLogListResponse = await listAuditLogs();

        if (auditLogListResponse.success) setAuditLogs(auditLogListResponse.data!.auditLogs);
        else setError(auditLogListResponse.error!);
      };

      setAuditLogList();
    }
  }, [isAdminModalOpen]);

  useEffect(() => {
    if (auditLogs) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [auditLogs]);

  const getActionDisplayName = (action: AuditLogAction) => actionDisplayMap.hasOwnProperty(action)
    ? actionDisplayMap[action as keyof typeof actionDisplayMap]
    : action;

  return error
    ? (
      <ErrorAlert error={error} />
    ) : (
      <>
        {
          isLoading ? (
            <Box style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}>
              <CircularProgress size={80} />
            </Box>
          ) : (
            <DataGridPremium
              rows={auditLogs!}
              columns={columns}
              density='compact'
              sx={{ backgroundColor: '#e3f8fa' }}
              hideFooter
              slots={{ toolbar: GridToolbar }}
              getDetailPanelContent={({ row }) => <AuditLogDetailsDataGrid before={row.before} after={row.after} />}
            />
          )
        }
      </>
  );
};

export {
  AuditLogsDataGrid
};