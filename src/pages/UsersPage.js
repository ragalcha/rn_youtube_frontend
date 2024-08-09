import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import Header from '../Components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import { getCookie, setCookie } from '../utility/cookieUtils';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Footer from '../Components/Footer';
import Loading from '../Components/Loading';
function UsersPage() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newUser, setNewUser] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: '',
        userRole: ''
    });

    useEffect(() => {
        const user = getCookie('user');
        if (!user) {
            navigate('/login');
            return;
        }

        if (user?.userRole?.name == "User") {
            navigate('/home');
            return;
        }
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/user/users`, {
                headers: {
                    'Authorization': `Bearer ${getCookie('accessToken')}`
                }
            });
            console.log("users",response.data.data.customers);
            setUsers(response.data.data.customers);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users.');
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/userrole/userroles`);
            setRoles(response.data.data.roles);
            console.log("roles",response.data.data.roles);
        } catch (error) {
            console.error('Error fetching roles:', error);
            toast.error('Failed to fetch roles.');
        }
    };

    const handleCreateUser = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/user/register`, newUser);
            toast.success('User created successfully.');
            fetchUsers();
            setShowCreateModal(false);
            setNewUser({
                firstName: '',
                lastName: '',
                userName: '',
                email: '',
                password: '',
                userRole: ''
            });
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error('Failed to create user.');
        }
    };

    const handleUpdateUser = async () => {
        try {
            console.log("token",getCookie('accessToken'),"userid",currentUser._id,"newuser",currentUser);
            await axios.put(`${process.env.REACT_APP_API_URL}/api/v1/user/update/${currentUser._id}`, currentUser, {
                headers: {
                    'Authorization': `Bearer ${getCookie('accessToken')}`
                }
            });
            toast.success('User updated successfully.');
            fetchUsers();
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Failed to update user.');
        }
    };

    const handleDeleteUser = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/user/delete/${currentUser._id}`, {
                headers: {
                    'Authorization': `Bearer ${getCookie('accessToken')}`
                }
            });
            toast.success('User deleted successfully.');
            fetchUsers();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user.');
        }
    };
    if (loading) {
        return (
           <Loading
           text = "Users"
           title = "Users"
           />
        )
    }
    return (
        <>
            <div className="main clearfix position-relative">
                <Header />
                <div className="main_about clearfix">
                    <section id="center" className="center_blog">
                        <div className="container-xl">
                            <div className="row center_o1">
                                <div className="col-md-12">
                                    <h2 className="text-white">Users</h2>
                                    <h6 className="mb-0 mt-3 fw-normal col_red">
                                        <Link className="text-light" to="/home">Home</Link>
                                        <span className="mx-2 text-muted">/</span> Users
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <div className="main clearfix position-relative">
                    <div className="container">
                        <div className="d-flex justify-content-between mb-3">
                            <h2 className="text-white">Users</h2>
                            <Button variant="primary" onClick={() => setShowCreateModal(true)}>Create User</Button>
                        </div>
                        <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user._id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.userName}</td>
                                        <td>{user.email}</td>
                                        <td>{user?.userRole?.name}</td>
                                        <td>
                                            <Button variant="warning" onClick={() => { setCurrentUser(user); setShowEditModal(true); }}>Edit</Button>
                                            <Button variant="danger" className="ml-2" onClick={() => { setCurrentUser(user); setShowDeleteModal(true); }}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </div>

                    {/* Create User Modal */}
                    <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create User</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formBasicFirstName">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newUser.firstName}
                                        onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicLastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newUser.lastName}
                                        onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicUserName">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newUser.userName}
                                        onChange={(e) => setNewUser({ ...newUser, userName: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicRole">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={newUser.userRole._id}
                                        onChange={(e) => setNewUser({ ...newUser, userRole: e.target.value })}
                                    >
                                        <option value="">Select Role</option>
                                        {roles.map(role => (
                                            <option key={role._id} value={role._id}>{role.name}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Close</Button>
                            <Button variant="primary" onClick={handleCreateUser}>Save Changes</Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Edit User Modal */}
                    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit User</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formBasicFirstName">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={currentUser?.firstName || ''}
                                        onChange={(e) => setCurrentUser({ ...currentUser, firstName: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicLastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={currentUser?.lastName || ''}
                                        onChange={(e) => setCurrentUser({ ...currentUser, lastName: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicUserName">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={currentUser?.userName || ''}
                                        onChange={(e) => setCurrentUser({ ...currentUser, userName: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={currentUser?.email || ''}
                                        onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicRole">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={currentUser?.userRole || ''}
                                        onChange={(e) => setCurrentUser({ ...currentUser, userRole: e.target.value })}
                                    >
                                        <option value="">Select Role</option>
                                        {roles.map(role => (
                                            <option key={role._id} value={role._id}>{role.name}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
                            <Button variant="primary" onClick={handleUpdateUser}>Save Changes</Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Delete User Modal */}
                    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Delete User</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to delete this user?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                            <Button variant="danger" onClick={handleDeleteUser}>Delete</Button>
                        </Modal.Footer>
                    </Modal>

                    <Toaster />
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default UsersPage;
