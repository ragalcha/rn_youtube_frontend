import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../Components/Footer';
import Loading from '../Components/Loading';
function SubscriptionCrudPage() {
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newSubscription, setNewSubscription] = useState({
        name: '',
        description: '',
        price: '',
        duration: ''
    });

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/subscription/subscriptions`);
            setSubscriptions(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            toast.error('Failed to fetch subscriptions.');
        }
    };

    const handleCreateSubscription = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/subscription/create`, newSubscription);
            toast.success('Subscription created successfully.');
            fetchSubscriptions();
            setShowCreateModal(false);
            setNewSubscription({ name: '', description: '', price: '', duration: '' });
        } catch (error) {
            console.error('Error creating subscription:', error);
            toast.error('Failed to create subscription.');
        }
    };

    const handleUpdateSubscription = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/v1/subscription/update/${currentSubscription._id}`, currentSubscription);
            toast.success('Subscription updated successfully.');
            fetchSubscriptions();
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating subscription:', error);
            toast.error('Failed to update subscription.');
        }
    };

    const handleDeleteSubscription = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/subscription/delete/${currentSubscription._id}`);
            toast.success('Subscription deleted successfully.');
            fetchSubscriptions();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting subscription:', error);
            toast.error('Failed to delete subscription.');
        }
    };
     
    if (loading) {
        return (
           <Loading
           text = "Subscriptions"
           title = "Subscriptions"
           />
        )
    }
    return (
        <>
            <Header />
            <div className="main_about clearfix">
                <section id="center" className="center_blog">
                    <div className="container-xl">
                        <div className="row center_o1">
                            <div className="col-md-12">
                                <h2 className="text-white">Subscriptions</h2>
                                <h6 className="mb-0 mt-3 fw-normal col_red">
                                  <Link className="text-light" to="/home">Home</Link>
                                    <span className="mx-2 text-muted">/</span> Subscriptions page
                                </h6>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <div className="container mt-4">
                <div className="d-flex justify-content-between mb-3">
                    <h2>Subscriptions</h2>
                    <Button variant="primary" onClick={() => setShowCreateModal(true)}>Create Subscription</Button>
                </div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscriptions.map((subscription, index) => (
                            <tr key={subscription._id}>
                                <th scope="row">{index + 1}</th>
                                <td>{subscription.name}</td>
                                <td>{subscription.description}</td>
                                <td>${subscription.price}</td>
                                <td>{subscription.duration}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        onClick={() => {
                                            setCurrentSubscription(subscription);
                                            setShowEditModal(true);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        className="ml-2"
                                        onClick={() => {
                                            setCurrentSubscription(subscription);
                                            setShowDeleteModal(true);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Create Subscription Modal */}
                <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Subscription</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newSubscription.name}
                                onChange={(e) => setNewSubscription({ ...newSubscription, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={newSubscription.description}
                                onChange={(e) => setNewSubscription({ ...newSubscription, description: e.target.value })}
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label>Price</label>
                            <input
                                type="number"
                                className="form-control"
                                value={newSubscription.price}
                                onChange={(e) => setNewSubscription({ ...newSubscription, price: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Duration</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newSubscription.duration}
                                onChange={(e) => setNewSubscription({ ...newSubscription, duration: e.target.value })}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleCreateSubscription}>Create</Button>
                    </Modal.Footer>
                </Modal>

                {/* Edit Subscription Modal */}
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Subscription</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {currentSubscription && (
                            <>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={currentSubscription.name}
                                        onChange={(e) => setCurrentSubscription({ ...currentSubscription, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={currentSubscription.description}
                                        onChange={(e) => setCurrentSubscription({ ...currentSubscription, description: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Price</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={currentSubscription.price}
                                        onChange={(e) => setCurrentSubscription({ ...currentSubscription, price: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Duration</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={currentSubscription.duration}
                                        onChange={(e) => setCurrentSubscription({ ...currentSubscription, duration: e.target.value })}
                                    />
                                </div>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleUpdateSubscription}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>

                {/* Delete Subscription Modal */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this subscription?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" onClick={handleDeleteSubscription}>Delete</Button>
                    </Modal.Footer>
                </Modal>

                <Toaster />
            </div>
            <Footer/>
        </>
    );
}

export default SubscriptionCrudPage;
