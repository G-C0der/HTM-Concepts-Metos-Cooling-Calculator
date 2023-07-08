import React from 'react';
import './style.css';
import {Dialog, DialogContent} from "@mui/material";

interface SettingsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SettingsModal = ({ isOpen, setIsOpen }: SettingsModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      PaperProps={{ className: 'dialogPaper' }}
    >
      <DialogContent>

      </DialogContent>
    </Dialog>
  );
};

export {
  SettingsModal
};