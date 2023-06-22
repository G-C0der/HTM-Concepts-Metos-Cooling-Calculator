import React, {useContext, useEffect, useState} from 'react';
import {User} from "../../types";
import {UserContext} from "../../contexts";
import {Alert, CircularProgress} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import Box from "@mui/material/Box";

interface UsersDataGridProps {
  isAdminModalOpen: boolean;
}

const UsersDataGrid = ({ isAdminModalOpen }: UsersDataGridProps) => {
  const [users, setUsers] = useState<User[]>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  const { list } = useContext(UserContext);

  useEffect(() => {
    if (isAdminModalOpen) { // TODO: admin check
      const setUserList = async () => {
        const userListResponse = await list();

        if (userListResponse.success) {
          const { users } = userListResponse.data;
          setUsers(users);
        }
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

  const columns: GridColDef[] = [
    {
      field: 'company',
      headerName: 'Company',
      width: 200
    },
    {
      field: 'fname',
      headerName: 'First Name',
      width: 150
    },
    {
      field: 'lname',
      headerName: 'Last Name',
      width: 150
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 300,
      renderCell: (params) => (
        <a href={`mailto:${params.value}`} target="_blank" rel="noreferrer">
          {params.value}
        </a>
      ),
    },
  ];

  return isLoading
    ? (
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
        {
          error ? (
            <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
          ) : (
            <DataGrid
              rows={users!}
              columns={columns}
              pageSizeOptions={[5]}
              sx={{ backgroundColor: '#f3f3f3' }}
              hideFooter
            />
          )
        }
      </>
  );
};

export {
  UsersDataGrid
};