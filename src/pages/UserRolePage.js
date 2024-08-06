import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import Header from '../Components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import { getCookie, setCookie } from '../utility/cookieUtils';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
function UserRolePage() {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentRole, setCurrentRole] = useState(null);
    const [newRole, setNewRole] = useState({ name: '', description: '' });

    useEffect(() => {
        const user = getCookie('user');
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.userRole.name == "User") {
            navigate('/home');
            return;
        }
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/v1/userrole/userroles');
            console.log(response.data.data.roles);
            setRoles(response.data.data.roles);
        } catch (error) {
            console.error('Error fetching roles:', error);
            toast.error('Failed to fetch roles.');
        }
    };

    const handleCreateRole = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/v1/userrole/create', newRole);
            toast.success('Role created successfully.');
            fetchRoles();
            setShowCreateModal(false);
            setNewRole({ name: '', description: '' });
        } catch (error) {
            console.error('Error creating role:', error);
            toast.error('Failed to create role.');
        }
    };

    const handleUpdateRole = async () => {
        try {
            const response = await axios.put(`http://localhost:3001/api/v1/userrole/update/${currentRole._id}`, currentRole);
            toast.success('Role updated successfully.');
            fetchRoles();
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error('Failed to update role.');
        }
    };

    const handleDeleteRole = async () => {
        try {
            await axios.delete(`http://localhost:3001/api/v1/userrole/delete/${currentRole._id}`);
            toast.success('Role deleted successfully.');
            fetchRoles();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting role:', error);
            toast.error('Failed to delete role.');
        }
    };

    return (
        <>
          <div className="main clearfix position-relative">
            <Header />
            <div className="main_about clearfix">
                <section id="center" className="center_blog">
                    <div className="container-xl">
                        <div className="row center_o1">
                            <div className="col-md-12">
                                <h2 className="text-white">User Roles</h2>
                                <h6 className="mb-0 mt-3 fw-normal col_red">
                                    <Link className="text-light" to="/home">Home</Link>
                                    <span className="mx-2 text-muted">/</span> User Roles
                                </h6>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <div className="main clearfix position-relative">
                <div className="container">
                    <div className="d-flex justify-content-between mb-3">
                        <h2 className="text-white">User Roles</h2>
                        <Button variant="primary" onClick={() => setShowCreateModal(true)}>Create Role</Button>
                    </div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role, index) => (
                                <tr key={role._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{role.name}</td>
                                    <td>{role.description}</td>
                                    <td>
                                        <Button variant="warning" onClick={() => { setCurrentRole(role); setShowEditModal(true); }}>Edit</Button>
                                        <Button variant="danger" className="ml-2" onClick={() => { setCurrentRole(role); setShowDeleteModal(true); }}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Create Role Modal */}
                <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Role</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newRole.name}
                                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={newRole.description}
                                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                            ></textarea>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleCreateRole}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>

                {/* Edit Role Modal */}
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Role</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={currentRole?.name || ''}
                                onChange={(e) => setCurrentRole({ ...currentRole, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={currentRole?.description || ''}
                                onChange={(e) => setCurrentRole({ ...currentRole, description: e.target.value })}
                            ></textarea>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleUpdateRole}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>

                {/* Delete Role Modal */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Role</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this role?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" onClick={handleDeleteRole}>Delete</Button>
                    </Modal.Footer>
                </Modal>
                <Toaster />
            </div>
            </div>
        </>
    );
}

export default UserRolePage;
