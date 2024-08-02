import React, { useEffect, useRef } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, MenuItem, Select, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const roles = ['Employee', 'Recruiter'];
const departments = ['Developer', 'Manager', 'Consultant', 'Tester', 'Business Development Team', 'Designers', 'Marketing Team'];

const AddUserModal = ({ open, handleClose, handleCreate, users, editUser }) => {
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      location: '',
      department: ''
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .matches(/^[A-Za-z]+$/, 'First name should contain only alphabets')
        .required('First name is required'),
      lastName: Yup.string()
        .matches(/^[A-Za-z]+$/, 'Last name should contain only alphabets')
        .required('Last name is required'),
      email: Yup.string()
        .email('Invalid email format')
        .test('unique-email', 'Email is already taken', function (value) {
          if (editUser && editUser.email === value) {
            return true; 
          }
          return !users.some((user) => user.email === value);
        })
        .required('Email is required'),
      phone: Yup.string()
        .matches(/^\d{10}$/, 'Phone number should be exactly 10 digits')
        .required('Phone number is required'),
      role: Yup.string().required('Role is required'),
      location: Yup.string().required('Location is required'),
      department: Yup.string().required('Department is required')
    }),
    onSubmit: (values, { resetForm }) => {
      handleCreate(values);
      resetForm(); 
    }
  });

 
  const formikRef = useRef(formik);

  useEffect(() => {
    if (editUser) {
      formikRef.current.setValues({
        firstName: editUser.firstName,
        lastName: editUser.lastName,
        email: editUser.email,
        phone: editUser.phone,
        role: editUser.role,
        location: editUser.location,
        department: editUser.department
      });
    } else {
      formikRef.current.resetForm();
    }
  }, [editUser]);

  const handleCancel = () => {
    formik.resetForm();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle color="primary">{editUser ? 'Edit User' : 'Add User'}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                margin="dense"
                name="firstName"
                label="First Name"
                type="text"
                fullWidth
                variant="outlined"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="lastName"
                label="Last Name"
                type="text"
                fullWidth
                variant="outlined"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="email"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="phone"
                label="Phone No"
                type="text"
                fullWidth
                variant="outlined"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense" error={formik.touched.role && Boolean(formik.errors.role)}>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Role"
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>{role}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>{formik.touched.role && formik.errors.role}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="location"
                label="Location"
                type="text"
                fullWidth
                variant="outlined"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.touched.location && formik.errors.location}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense" error={formik.touched.department && Boolean(formik.errors.department)}>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={formik.values.department}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Department"
                >
                  {departments.map((department) => (
                    <MenuItem key={department} value={department}>{department}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>{formik.touched.department && formik.errors.department}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {editUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddUserModal;
