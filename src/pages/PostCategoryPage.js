import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import Header from '../Components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import { getCookie, setCookie } from '../utility/cookieUtils';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
function PostCategoryPage() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({ title: '', description: '' });

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
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://rn-youtube-backend.onrender.com/api/v1/category/categories');
            console.log(response.data.data);
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to fetch categories.');
        }
    };

    const handleCreateCategory = async () => {
        try {
            const response = await axios.post('https://rn-youtube-backend.onrender.com/api/v1/category/create', newCategory);
            toast.success('Category created successfully.');
            fetchCategories();
            setShowCreateModal(false);
            setNewCategory({ title: '', description: '' });
        } catch (error) {
            console.error('Error creating category:', error);
            toast.error('Failed to create category.');
        }
    };

    const handleUpdateCategory = async () => {
        try {
            const response = await axios.put(`https://rn-youtube-backend.onrender.com/api/v1/category/update/${currentCategory._id}`, currentCategory);
            toast.success('Category updated successfully.');
            fetchCategories();
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating category:', error);
            toast.error('Failed to update category.');
        }
    };

    const handleDeleteCategory = async () => {
        try {
            await axios.delete(`https://rn-youtube-backend.onrender.com/api/v1/category/delete/${currentCategory._id}`);
            toast.success('Category deleted successfully.');
            fetchCategories();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Failed to delete category.');
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
                                <h2 className="text-white">Categories</h2>
                                <h6 className="mb-0 mt-3 fw-normal col_red">
                                <Link className="text-light" to="/home">Home</Link>
                                    <span className="mx-2 text-muted">/</span> About Us
                                </h6>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <div className="main clearfix position-relative">
                <div className="container">
                    <div className="d-flex justify-content-between mb-3">
                        <h2 className="text-white">Categories</h2>
                        <Button variant="primary" onClick={() => setShowCreateModal(true)}>Create Category</Button>
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
                            {categories.map((category, index) => (
                                <tr key={category._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{category.title}</td>
                                    <td>{category.description}</td>
                                    <td>
                                        <Button variant="warning" onClick={() => { setCurrentCategory(category); setShowEditModal(true); }}>Edit</Button>
                                        <Button variant="danger" className="ml-2" onClick={() => { setCurrentCategory(category); setShowDeleteModal(true); }}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Create Category Modal */}
                <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newCategory.title}
                                onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={newCategory.description}
                                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                            ></textarea>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleCreateCategory}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>

                {/* Edit Category Modal */}
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                className="form-control"
                                value={currentCategory?.title || ''}
                                onChange={(e) => setCurrentCategory({ ...currentCategory, title: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={currentCategory?.description || ''}
                                onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                            ></textarea>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleUpdateCategory}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>

                {/* Delete Category Modal */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this category?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" onClick={handleDeleteCategory}>Delete</Button>
                    </Modal.Footer>
                </Modal>

                <Toaster />
            </div>
            </div>
        </>
    );
}

export default PostCategoryPage;
