import React, {useContext, useEffect, useState} from 'react';
import './style.css';
import {ApiError, User} from "../../types";
import {AdminContext, AuthContext} from "../../contexts";
import {CircularProgress, MenuItem, Select} from "@mui/material";
import {DataGridPro, GridColDef, GridToolbar} from "@mui/x-data-grid-pro";
import Box from "@mui/material/Box";
import {toAbsoluteUrl} from "../../utils/url";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {ConfirmationDialog} from "../ConfirmationDialog";
import {LoadingButton} from "../LoadingButton";
import {getName} from 'country-list';
import {ErrorAlert} from "../ErrorAlert";
import {userFieldLabels} from "../../constants";
import {UserDetailDataGrid} from "../UserDetailDataGrid";
import {BooleanIcon} from "../BooleanIcon";
import {UserMode} from "../../enums/UserMode";

interface UsersDataGridProps {
  isAdminModalOpen: boolean;
}

const UsersDataGrid = ({ isAdminModalOpen }: UsersDataGridProps) => {
  const [users, setUsers] = useState<User[]>();
  const [error, setError] = useState<ApiError>();
  const [isLoading, setIsLoading] = useState(true);

  const [pendingUser, setPendingUser] = useState<User>();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const [isModeChangeLoading, setIsModeChangeLoading] = useState(false);
  const [isActiveStateChangeLoading, setIsActiveStateChangeLoading] = useState(false);

  const { authenticatedUser } = useContext(AuthContext);
  const { listUsers, changeUserMode, activateUser, deactivateUser } = useContext(AdminContext);

  const columns: GridColDef[] = [
    {
      field: 'company',
      headerName: userFieldLabels['company'],
      width: 200
    },
    {
      field: 'title',
      headerName: userFieldLabels['title'],
      width: 60
    },
    {
      field: 'fname',
      headerName: userFieldLabels['fname'],
      width: 140
    },
    {
      field: 'lname',
      headerName: userFieldLabels['lname'],
      width: 140
    },
    {
      field: 'verified',
      headerName: userFieldLabels['verified'],
      width: 80,
      renderCell: ({ value }) => (
        <BooleanIcon value={value} />
      ),
    },
    {
      field: 'active',
      headerName: userFieldLabels['active'],
      width: 80,
      renderCell: ({ value }) => (
        <BooleanIcon value={value} />
      ),
    },
    {
      field: 'admin',
      headerName: userFieldLabels['admin'],
      width: 80,
      renderCell: ({ value }) => (
        <BooleanIcon value={value} />
      ),
    },
    {
      field: 'email',
      headerName: userFieldLabels['email'],
      width: 300,
      renderCell: ({ value }) => (
        <a href={`mailto:${value}`} target="_blank" rel="noreferrer">
          {value}
        </a>
      ),
    },
    {
      field: 'phone',
      headerName: userFieldLabels['phone'],
      width: 150
    },
    {
      field: 'website',
      headerName: userFieldLabels['website'],
      width: 250,
      renderCell: ({ value }) => (
        <a href={toAbsoluteUrl(value)} target="_blank" rel="noreferrer">
          {value}
        </a>
      ),
    },
    {
      field: 'country',
      headerName: userFieldLabels['country'],
      width: 160,
      valueGetter: ({ value }) => getName(value)
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 270,
      sortable: false,
      renderCell: ({ row }) => {
        const { id, mode, verified: isVerified, active: isActive } = row;
        const isPendingUser = () => pendingUser?.id === id;
        return (
          <>
            {(isModeChangeLoading && isPendingUser()) ? (
              <Box display="flex" justifyContent="center" alignItems="center" sx={{ mr: 8.3, mb: 2, ml: 3 }}>
                <CircularProgress />
              </Box>
              ) : (
              <Select
                label="Modus"
                id="mode"
                name="mode"
                value={mode}
                onChange={(event) => {
                  setPendingUser(row);
                  handeUserModeChangeClick(id, event.target.value);
                }}
                style={{ margin: '0 20px 0 5px', width: 105, height: 30 }}
                disabled={isActiveStateChangeLoading && isPendingUser()}
              >
                {Object.values(UserMode).map((userMode) => (
                  <MenuItem key={userMode} value={userMode}>{userMode}</MenuItem>
                ))}
              </Select>
            )}

            <LoadingButton
              className={`action-button ${isActive ? 'deactivate' : 'activate'}`}
              startIcon={isActive ? <CancelIcon /> : <CheckCircleIcon />}
              onClick={() => {
                setPendingUser(row);
                setIsConfirmDialogOpen(true);
              }}
              loading={isActiveStateChangeLoading && isPendingUser()}
              disabled={(id === authenticatedUser!.id) || (!isVerified && !isActive) || (isModeChangeLoading && isPendingUser())}
            >
              {isActive ? 'Deactivate' : 'Activate'}
            </LoadingButton>
          </>
        );
      }
    }
  ];

  useEffect(() => {
    if (isAdminModalOpen) {
      const setUserList = async () => {
        const userListResponse = await listUsers();

        if (userListResponse.success) setUsers(userListResponse.data!.users);
        else setError(userListResponse.error!);
      }

      setUserList();
    }
  }, [isAdminModalOpen]);

  useEffect(() => {
    if (users) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [users]);

  const handeUserModeChangeClick = async (id: number, mode: UserMode) => {
    setIsModeChangeLoading(true);

    const modeChangeResponse = await changeUserMode(id, mode);
    if (modeChangeResponse.success) {
      setUsers(prevUsers => prevUsers!.map(user => user.id === id ? { ...user, mode } : user));
    }

    setPendingUser(undefined);
    setIsModeChangeLoading(false);
  };

  const handleUserStateChangeClick = async (user: User) => {
    setIsActiveStateChangeLoading(true);
    const { id, active: isActive } = user;

    if (isActive) {
      const deactivateResponse = await deactivateUser(id);
      if (deactivateResponse.success) updateUser(id, { active: !isActive });
    } else {
      const activateResponse = await activateUser(id);
      if (activateResponse.success) updateUser(id, { active: !isActive });
    }

    setPendingUser(undefined);
    setIsActiveStateChangeLoading(false);
  };

  const updateUser = (id: number, props: Partial<User>) =>
    setUsers(prevUsers => prevUsers!.map(user => user.id === id ? { ...user, ...props } : user));

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
            <>
              <DataGridPro
                rows={users!}
                columns={columns}
                sx={{ backgroundColor: '#e3f8fa' }}
                hideFooter
                slots={{ toolbar: GridToolbar }}
                getRowClassName={({ row }) => (row.verified && row.active)
                  ? (row.id === authenticatedUser!.id ? 'data-grid-row-current-row' : '')
                  : 'data-grid-row-inactive-user'}
                getDetailPanelContent={({ row }) => <UserDetailDataGrid user={row} />}
              />

              {
                pendingUser && (
                  <ConfirmationDialog
                    text={`Are you sure you want to ${pendingUser.active ? 'deactivate' : 'activate'} 
                      the user "${pendingUser.email}"?`}
                    pendingAction={() => handleUserStateChangeClick(pendingUser)}
                    isOpen={isConfirmDialogOpen}
                    setIsOpen={setIsConfirmDialogOpen}
                  />
                )
              }
            </>
          )
        }
      </>
  );
};

export {
  UsersDataGrid
};
