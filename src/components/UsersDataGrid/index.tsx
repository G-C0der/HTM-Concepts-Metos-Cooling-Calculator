import React, {useContext, useEffect, useState} from 'react';
import {User} from "../../types";
import {UserContext} from "../../contexts";
import {Alert} from "@mui/material";

interface UsersDataGridProps {
  isAdminModalOpen: boolean;
}

const UsersDataGrid = ({ isAdminModalOpen }: UsersDataGridProps) => {
  const [users, setUsers] = useState<User[]>();
  const [error, setError] = useState<string>();

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

  return error
    ? (
      <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
    ) : (
    <></>
  );
};

export {
  UsersDataGrid
};