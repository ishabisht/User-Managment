import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Box } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const DeleteConfirmationModal = ({ open, handleClose, handleConfirm }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="center" color="error.main">
          <WarningIcon fontSize="large" />
        </Box>
        <Typography variant="h6" align="center">
          Are you sure you want to delete this user?
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" align="center">
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          No, Cancel
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          Yes, Delete!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
