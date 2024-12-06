import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { getCookie, setCookie } from '../utility/cookieUtils';
import { Toaster, toast } from 'react-hot-toast';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { Link } from 'react-router-dom';

function UserProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
    });

    const [trialRemaining, setTrialRemaining] = useState(0);
    const [subscriptionRemaining, setSubscriptionRemaining] = useState(0);
    const navigate = useNavigate();
    const { userId } = useParams();

    const backgroundVideo = `${process.env.REACT_APP_API_URL}/video/file_example_MP4_640_3MG.mp4`;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/user/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${getCookie('accessToken')}`,
                    },
                });
                const userProfile = response.data.data.user;
                setUser(userProfile);
                setCookie('user', userProfile, { maxAge: 3600 });

                setFormData({
                    firstName: userProfile.firstName || '',
                    lastName: userProfile.lastName || '',
                    userName: userProfile.userName || '',
                    email: userProfile.email || '',
                });

                calculateTrialDetails(userProfile);
                calculateSubscriptionDetails(userProfile);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user:', error);
                toast.error('Failed to load user data. Please try again later.');
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const calculateTrialDetails = (userProfile) => {
        if (userProfile.trialActive && userProfile.trialExpiresAt) {
            const trialExpiresAt = new Date(userProfile.trialExpiresAt);
            const currentDate = new Date();
            const daysRemaining = Math.ceil(
                (trialExpiresAt - currentDate) / (1000 * 60 * 60 * 24)
            );
            setTrialRemaining(Math.max(0, daysRemaining));
        }
    };

    const calculateSubscriptionDetails = (userProfile) => {
        if (userProfile.subscriptionActive && userProfile.subscriptionExpiresAt) {
            const subscriptionExpiresAt = new Date(userProfile.subscriptionExpiresAt);
            const currentDate = new Date();
            const daysRemaining = Math.ceil(
                (subscriptionExpiresAt - currentDate) / (1000 * 60 * 60 * 24)
            );
            setSubscriptionRemaining(Math.max(0, daysRemaining));
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/v1/user/update/${userId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${getCookie('accessToken')}`,
                    },
                }
            );
            toast.success('Profile updated successfully');
            setUser(response.data.data.user);
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Failed to update profile.');
        }
    };

    if (loading) {
        return (
            <div className="main clearfix position-relative" style={{ backgroundColor: 'black', height: '100vh' }}>
                <Header />
                <div className="loading-custom d-flex justify-content-center align-items-center">
                    <div className="spinner-grow text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!user) return <p>No user data available.</p>;

    return (
        <div className="main clearfix position-relative" style={{ backgroundColor: 'black', minHeight: '100vh' }}>
            <Header />
            <div className="main-content">
                {/* Background Header */}
                <div
                    className="header profile-header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
                    style={{
                        minHeight: '250px',
                        backgroundImage: `url(${backgroundVideo || 'https://via.placeholder.com/1200x600'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center top',
                    }}
                >
                    <span className="mask bg-gradient-default opacity-8"></span>
                </div>

                {/* Profile Section */}
                <div className="container-fluid mt--7">
                    <div className="row new-user">
                        <div className="col-xl-4 order-xl-2 mb-5 mb-xl-0">
                            <div className="card card-profile shadow">
                                <div className="card-body text-center">
                                    <img
                                        src={user.profileImage || 'https://via.placeholder.com/150'}
                                        className="rounded-circle mb-3"
                                        alt="Profile"
                                        style={{ width: '150px', height: '150px' }}
                                    />
                                    <h3>{user.userName}</h3>
                                    <p>{user.email}</p>
                                    <hr />
                                    {user.trialActive && (
                                        <div>
                                            <h5>Trial Details</h5>
                                            <p>Days Remaining: {trialRemaining}</p>
                                            <p>
                                                Expires On:{' '}
                                                {new Date(user.trialExpiresAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                    {user.subscriptionActive && (
                                        <div>
                                            <h5>Subscription Details</h5>
                                            <p>Plan: {user.subscriptionPlan?.name || 'N/A'}</p>
                                            <p>Days Remaining: {subscriptionRemaining}</p>
                                            <p>
                                                Expires On:{' '}
                                                {new Date(user.subscriptionExpiresAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                    {!user.trialActive && !user.subscriptionActive && (
                                        <div>
                                            <h5>No Active Subscription</h5>
                                            <Link to="/subscription" className="btn btn-primary">
                                                Subscribe Now
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Edit Profile Section */}
                        <div className="col-xl-8 order-xl-1">
                            <div className="card bg-secondary shadow">
                                <div className="card-header bg-white border-0">
                                    <div className="row align-items-center">
                                        <div className="col-8">
                                            <h3 className="mb-0">My Account</h3>
                                        </div>
                                        <div className="col-4 text-right">
                                            <button
                                                onClick={handleSubmit}
                                                className="btn btn-sm btn-primary"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <h6 className="heading-small text-muted mb-4">
                                            User Information
                                        </h6>
                                        <div className="pl-lg-4">
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="form-group focused">
                                                        <label className="form-control-label" htmlFor="userName">
                                                            Username
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="userName"
                                                            className="form-control form-control-alternative"
                                                            placeholder="Username"
                                                            value={formData.userName}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="form-group">
                                                        <label className="form-control-label" htmlFor="email">
                                                            Email address
                                                        </label>
                                                        <input
                                                            type="email"
                                                            id="email"
                                                            className="form-control form-control-alternative"
                                                            placeholder="Email address"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="form-group focused">
                                                        <label className="form-control-label" htmlFor="firstName">
                                                            First Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="firstName"
                                                            className="form-control form-control-alternative"
                                                            placeholder="First Name"
                                                            value={formData.firstName}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="form-group focused">
                                                        <label className="form-control-label" htmlFor="lastName">
                                                            Last Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="lastName"
                                                            className="form-control form-control-alternative"
                                                            placeholder="Last Name"
                                                            value={formData.lastName}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
            <Toaster position="bottom-center" />
        </div>
    );
}

export default UserProfilePage;
