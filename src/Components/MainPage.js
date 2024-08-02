import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Autocomplete, FormControl, InputLabel, Select, MenuItem, Pagination } from '@mui/material';
import AddUserModal from './AddUserModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

const MainPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [deleteUserEmail, setDeleteUserEmail] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [page, setPage] = useState(1);
    const rowsPerPage = 5; 
    
    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        setUsers(storedUsers);
        applyFilters(storedUsers, searchTerm, roleFilter);
    }, [searchTerm, roleFilter]);

    const applyFilters = (userList, searchTerm, role) => {
        let filtered = userList;
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (role !== 'All') {
            filtered = filtered.filter(user => user.role === role);
        }
        setFilteredUsers(filtered);
        setPage(1);
    };

    const handleOpen = () => {
        setOpen(true);
        setEditUser(null);
    };

    const handleClose = () => {
        setOpen(false);
        setEditUser(null);
    };

    const handleCreate = (newUser) => {
        const formattedUser = {
            name: `${newUser.firstName} ${newUser.lastName}`,
            phone: newUser.phone,
            email: newUser.email,
            location: newUser.location,
            role: newUser.role,
            department: newUser.department
        };

        let updatedUsers;
        if (editUser) {
            updatedUsers = users.map(user =>
                user.email === editUser.email ? formattedUser : user
            );
        } else {
            updatedUsers = [...users, formattedUser];
        }

        setUsers(updatedUsers);
        applyFilters(updatedUsers, searchTerm, roleFilter);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        handleClose();
    };

    const handleSearch = (event, value) => {
        setSearchTerm(value);
        applyFilters(users, value, roleFilter);
    };

    const handleRoleFilterChange = (event) => {
        const newRole = event.target.value;
        setRoleFilter(newRole);
        applyFilters(users, searchTerm, newRole);
    };

    const handleEdit = (user) => {
        const [firstName, lastName] = user.name.split(' ');
        setEditUser({ ...user, firstName, lastName });
        setOpen(true);
    };

    const handleDelete = (email) => {
        setDeleteUserEmail(email);
        setOpenDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        const updatedUsers = users.filter(user => user.email !== deleteUserEmail);
        setUsers(updatedUsers);
        applyFilters(updatedUsers, searchTerm, roleFilter);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setOpenDeleteModal(false);
    };

    return (
        <div className="p-4 bg-white shadow-lg mx-auto mt-4 mb-4 rounded-lg max-w-6xl">
            <div className="p-4 rounded-lg mb-4">
                <div className="bg-gray-100 flex flex-col sm:flex-row justify-between items-center mb-4 p-4 rounded-lg">
                    <Typography variant="h4" color="primary" className=" mb-4 sm:mb-0">Manage Users</Typography>
                    <Button variant="contained" color="primary" onClick={handleOpen}>Add User</Button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
                    <div className="w-full sm:w-2/3 md:w-1/2 lg:w-2/5">
                        <Autocomplete
                            options={users.map(user => user.email)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search by email"
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <>
                                                <SearchIcon color="action" />
                                                {params.InputProps.startAdornment}
                                            </>
                                        ),
                                    }}
                                    fullWidth
                                />
                            )}
                            value={searchTerm}
                            onChange={handleSearch}
                            onInputChange={(event, newInputValue) => {
                                setSearchTerm(newInputValue);
                                handleSearch(event, newInputValue);
                            }}
                            filterOptions={(options, { inputValue }) => {
                                return inputValue ? options.filter(option =>
                                    option.toLowerCase().includes(inputValue.toLowerCase())
                                ) : [];
                            }}
                            freeSolo
                            noOptionsText="No matching emails"
                            open={Boolean(searchTerm)}
                            onOpen={() => { }}
                            onClose={() => { }}
                        />
                    </div>
                    <FormControl className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5">
                        <InputLabel id="role-filter-label">Role</InputLabel>
                        <Select
                            labelId="role-filter-label"
                            id="role-filter"
                            value={roleFilter}
                            label="Role"
                            onChange={handleRoleFilterChange}
                            className="h-10"
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Employee">Employee</MenuItem>
                            <MenuItem value="Recruiter">Recruiter</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow className="bg-gray-200">
                            <TableCell>Name</TableCell>
                            <TableCell>Phone No</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Function</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((user, index) => (
                            <TableRow key={index}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.location}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.department}</TableCell>
                                <TableCell>
                                    <IconButton
                                        aria-label="edit"
                                        color="primary"
                                        onClick={() => handleEdit(user)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        aria-label="delete"
                                        color="error"
                                        onClick={() => handleDelete(user.email)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="flex justify-center mt-4">
                <Pagination
                    count={Math.ceil(filteredUsers.length / rowsPerPage)}
                    page={page}
                    onChange={(event, newPage) => setPage(newPage)}
                    color="primary"
                />
            </div>
            <AddUserModal
                open={open}
                handleClose={handleClose}
                handleCreate={handleCreate}
                editUser={editUser}
                users={users}
            />
            <DeleteConfirmationModal
                open={openDeleteModal}
                handleClose={() => setOpenDeleteModal(false)}
                handleConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default MainPage;
