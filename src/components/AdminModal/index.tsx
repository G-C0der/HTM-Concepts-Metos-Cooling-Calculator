import React from 'react';
import './style.css';
import {Dialog, DialogContent} from "@mui/material";
import {UsersDataGrid} from "../UsersDataGrid";

interface AdminModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AdminModal = ({ isOpen, setIsOpen }: AdminModalProps) => {
  return (
    <Dialog className='modal' open={isOpen} onClose={() => setIsOpen(false)}>
      <DialogContent>
        <UsersDataGrid isAdminModalOpen={isOpen} />
      </DialogContent>
    </Dialog>
  );
};

export {
  AdminModal
};