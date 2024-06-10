import React, {useContext, useEffect, useState} from 'react';
import {ApiError, AuditLog} from "../../types";
import {DataGridPro, GridColDef, GridToolbar} from "@mui/x-data-grid-pro";
import moment from "moment";
import {AdminContext} from "../../contexts";
import {ErrorAlert} from "../ErrorAlert";
import Box from "@mui/material/Box";
import {CircularProgress} from "@mui/material";
import { AuditLogDetailsDataGrid } from '../AuditLogDetailsDataGrid';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LockResetIcon from '@mui/icons-material/LockReset';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import DeleteIcon from '@mui/icons-material/Delete';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import AutoModeIcon from '@mui/icons-material/AutoMode';

interface AuditLogsDataGridProps {
  isAdminModalOpen: boolean;
}

const AuditLogsDataGrid = ({ isAdminModalOpen }: AuditLogsDataGridProps) => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>();
  const [error, setError] = useState<ApiError>();
  const [isLoading, setIsLoading] = useState(true);

  const { listAuditLogs } = useContext(AdminContext);

  const actionDisplayMap = {
    registration: { name: 'Registration', icon: <AppRegistrationIcon sx={{ fontSize: '1rem', mr: 1 }} />  },
    verification: { name: 'Verification', icon: <HowToRegIcon sx={{ fontSize: '1rem', mr: 1 }} /> },
    passwordReset: { name: 'Password Reset', icon: <LockResetIcon sx={{ fontSize: '1rem', mr: 1 }} /> },
    profileEdit: { name: 'Profile Edit', icon: <EditIcon sx={{ fontSize: '1rem', mr: 1 }} /> },
    modeChange: { name: 'Mode Change', icon: <AutoModeIcon sx={{ fontSize: '1rem', mr: 1 }} /> },
    activation: { name: 'Activation', icon: <CheckCircleIcon sx={{ fontSize: '1rem', mr: 1 }} /> },
    deactivation: { name: 'Deactivation', icon: <CancelIcon sx={{ fontSize: '1rem', mr: 1 }} /> },
    save: { name: 'Save', icon: <SaveAltIcon sx={{ fontSize: '1rem', mr: 1 }} /> },
    delete: { name: 'Delete', icon: <DeleteIcon sx={{ fontSize: '1rem', mr: 1 }} /> },
  };

  const columns: GridColDef[] = [
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: ({ value }) => {
        const { name, icon } = actionDisplayMap[value as keyof typeof actionDisplayMap];
        return (
          <>{icon} {name}</>
        );
      }
    },
    {
      field: 'operator',
      headerName: 'Operator',
      width: 300,
      valueGetter: ({ value }) => value.email
    },
    {
      field: 'subject',
      headerName: 'Subject',
      width: 400,
      valueGetter: ({ row: { user, params } }) => params?.name
        ? `Save: "${params.name}"`
        : `User: "${user.email}"`
    },
    {
      field: 'createdAt',
      headerName: 'Timestamp',
      width: 200,
      valueGetter: ({ value }) => moment(value).format('DD.MM.YYYY HH:mm:ss')
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
            <DataGridPro
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
