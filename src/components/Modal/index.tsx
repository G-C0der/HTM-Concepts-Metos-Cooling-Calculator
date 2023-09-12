import React from 'react';
import './style.css';
import {Dialog, DialogContent, IconButton, Typography} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ModalProps {
  title?: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  small?: boolean;
  footerChildren?: React.ReactNode;
  children: React.ReactNode;
}

const Modal = ({ title, isOpen, setIsOpen, small, footerChildren, children }: ModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      PaperProps={{ className: small ? 'small-dialog-paper' : 'dialog-paper' }}
    >
      <DialogContent sx={{ overflow: 'hidden', pb: 17 }}>
        <IconButton
          sx={{ position: 'absolute', right: 5, top: 5 }}
          onClick={() => setIsOpen(false)}
        >
          <CloseIcon />
        </IconButton>

        {
          title && (
            <Typography variant="h5" align="center" component='h1' gutterBottom mb={4}>
              {title}
            </Typography>
          )
        }

        {children}
      </DialogContent>
      {footerChildren}
    </Dialog>
  );
};

export {
  Modal
};