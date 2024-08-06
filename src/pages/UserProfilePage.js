import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { getCookie, setCookie } from '../utility/cookieUtils';
import { Toaster, toast } from 'react-hot-toast';
import Header from '../Components/Header';

function UserProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const { userId } = useParams();
    const backgroundVideo = 'https://rn-youtube-backend.onrender.com/video/file_example_MP4_640_3MG.mp4';

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`https://rn-youtube-backend.onrender.com/api/v1/user/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${getCookie('accessToken')}`
                    }
                });
                const userProfile = response.data.data.user;
                setUser(userProfile);
                setCookie('user', userProfile, { maxAge: 3600 });
                setFormData({
                    firstName: userProfile.firstName,
                    lastName: userProfile.lastName,
                    userName: userProfile.userName,
                    email: userProfile.email,
                    password: ''
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user:', error);
                toast.error("Failed to load user");
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log()
            const response = await axios.put(`https://rn-youtube-backend.onrender.com/api/v1/user/update/${userId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${getCookie('accessToken')}`
                }
            });
            console.log("newu updated used ", response);
            toast.success("Profile updated successfully");
            navigate(`/user/${userId}`);
            setCookie('user', response.data.data.user, { maxAge: 3600 });
            setUser(response.data.data.user);
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error("Failed to update profile");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!user) return <p>No user data available.</p>;

    return (
        <>
            <div className="main clearfix position-relative">
                <Header />
                <div className="main-content">
                    <div className="header profile-header pb-8 pt-5 pt-lg-8 d-flex align-items-center" style={{ minHeight: "250px", backgroundImage: `url(${backgroundVideo || "https://via.placeholder.com/1200x600"})`, backgroundSize: "cover", backgroundPosition: "center top" }}>
                        <span className="mask bg-gradient-default opacity-8"></span>
                        <div className="underlay-photo">
                            <video autoPlay muted loop id="background-video">
                                <source src="/video/file_example_MP4_640_3MG.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <div className="underlay-black"></div>
                    </div>

                    <div className="container-fluid mt--7">
                        <div className="row new-user">
                            <div className="col-xl-4 order-xl-2 mb-5 mb-xl-0">
                                <div className="card card-profile shadow">
                                    <div className="row justify-content-center">
                                        <div className="col-lg-3 order-lg-2">
                                            <div className="card-profile-image">
                                                <a href="#">
                                                    <img src={user.profileImage || "https://via.placeholder.com/150"} className="rounded-circle" alt="Profile" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                                        <div className="d-flex justify-content-between">
                                            <a href="#" className="btn btn-sm btn-info mr-4">Connect</a>
                                            <a href="#" className="btn btn-sm btn-default float-right">Message</a>
                                        </div>
                                    </div> */}
                                    <div className="card-body pt-0 pt-md-4 user-profile-card">
                                        <div className="row">
                                            <div className="col">
                                                <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                                                    <div>
                                                        <span className="description">{user.userRole.name}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <h3>
                                                {user.userName}
                                            </h3>
                                            <div className="h5 font-weight-300">
                                                <i className="ni location_pin mr-2"></i>{user.email}
                                            </div>
                                            <div className="h5 mt-4">
                                                <i className="ni business_briefcase-24 mr-2"></i>{user.createdAt}
                                            </div>
                                            <div>
                                                <i className="ni education_hat mr-2"></i>{user.updatedAt}
                                            </div>
                                            <hr className="my-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-8 order-xl-1">
                                <div className="card bg-secondary shadow">
                                    <div className="card-header bg-white border-0">
                                        <div className="row align-items-center">
                                            <div className="col-8">
                                                <h3 className="mb-0">My account</h3>
                                            </div>
                                            <div className="col-4 text-right profile_edit_save_button">
                                                <button onClick={handleSubmit} className="btn btn-sm btn-primary">Save Changes</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <h6 className="heading-small text-muted mb-4">User information</h6>
                                            <div className="pl-lg-4">
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="form-group focused">
                                                            <label className="form-control-label" htmlFor="input-username">Username</label>
                                                            <input type="text" id="userName" className="form-control form-control-alternative" placeholder="Username" value={formData.userName} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="form-group">
                                                            <label className="form-control-label" htmlFor="input-email">Email address</label>
                                                            <input type="email" id="email" className="form-control form-control-alternative" placeholder="Email address" value={formData.email} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="form-group focused">
                                                            <label className="form-control-label" htmlFor="input-first-name">First name</label>
                                                            <input type="text" id="firstName" className="form-control form-control-alternative" placeholder="First name" value={formData.firstName} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="form-group focused">
                                                            <label className="form-control-label" htmlFor="input-last-name">Last name</label>
                                                            <input type="text" id="lastName" className="form-control form-control-alternative" placeholder="Last name" value={formData.lastName} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="form-group">
                                                            <label className="form-control-label" htmlFor="input-password">Password</label>
                                                            <input type="password" id="password" className="form-control form-control-alternative" placeholder="Password" value={formData.password} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                </div> */}
                                            </div>
                                         
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Toaster />
            </div>
        </>
    );
}

export default UserProfilePage;
