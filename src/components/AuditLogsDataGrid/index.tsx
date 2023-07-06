import React, {useContext, useEffect, useState} from 'react';
import {ApiError, AuditLog, AuditLogAction} from "../../types";
import {DataGrid, GridColDef, GridToolbar} from "@mui/x-data-grid";
import moment from "moment";
import {AdminContext} from "../../contexts";
import {ErrorAlert} from "../ErrorAlert";
import Box from "@mui/material/Box";
import {CircularProgress} from "@mui/material";

interface AuditLogsDataGridProps {
  isAdminModalOpen: boolean;
}

const AuditLogsDataGrid = ({ isAdminModalOpen }: AuditLogsDataGridProps) => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>();
  const [error, setError] = useState<ApiError>();
  const [isLoading, setIsLoading] = useState(true);

  const { listAuditLogs } = useContext(AdminContext);

  const actionDisplayMap = {
    passwordReset: 'password reset',
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
      headerName: 'Date',
      width: 200,
      valueGetter: (params) => moment(params.value).format('DD.MM.YYYY HH:mm:ss')
    },
    {
      field: 'before',
      headerName: 'Before',
      width: 500,
      valueGetter: (params) => JSON.stringify(params.value)
    },
    {
      field: 'after',
      headerName: 'After',
      width: 500,
      valueGetter: (params) => JSON.stringify(params.value)
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
            <DataGrid
              rows={auditLogs!}
              columns={columns}
              sx={{ backgroundColor: '#e3f8fa' }}
              hideFooter
              slots={{ toolbar: GridToolbar }}
              getDetailPanelContent={({ row }) => <></>}
            />
          )
        }
      </>
  );
};

export {
  AuditLogsDataGrid
};