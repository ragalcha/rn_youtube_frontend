import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCookie } from '../utility/cookieUtils';
import { Link } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import Footer from './Footer';
import Header from './Header';

function HeroVideo() {
    const [posts, setPosts] = useState([]);
    const [userId, setUserId] = useState(0);
    const [userRole, setUserRole] = useState(null);
    const userd_id = getCookie('user._id');
    const [activeDays, setActiveDays] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchPosts = async () => {
            const user = getCookie('user');
            console.log("here is cookies",user);

            try {
                if (user) {
                    setUserId(user._id);
                    if (user?.userRole?.name == 'Admin') {
                        setUserRole('Admin');
                        console.log("i am admin", userRole);
                    }
                    if (user.trialActive) {
                        setActiveDays(getCookie('activeDays') ? getCookie('activeDays') : getCookie('SubscriptionActiveDays'));
                        console.log("i am active days----->", getCookie('activeDays'));
                    }
                }
                console.log("userId and userRole------------->", userId, userRole);
                // console.log("user constant id ", userd_id);
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/post/recentposts`);
                setLoading(false);
                console.log("respons-------------->", response);
                const data = response.data;
                if (Array.isArray(data.recentPosts)) {
                    setPosts(data.recentPosts);
                } else {
                    console.error('Unexpected response format:', data);
                    setPosts([]); // Set to an empty array or handle as needed
                }
                console.log(response.data.posts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);
    if (loading) {
        return (
            <>
             <div className="main clearfix position-relative">
             <Header />
                <div className="main_2 clearfix">
                    <section id="center" className="center_home">
                        <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-indicators"></div>
                            <div className="loding-custom">
                                <div className="spinner-grow text-primary" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                <div className="spinner-grow text-secondary" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                <div className="spinner-grow text-success" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                <div className="spinner-grow text-danger" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                <div className="spinner-grow text-warning" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                <div className="spinner-grow text-info" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                <div className="spinner-grow text-light" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                <div className="spinner-grow text-dark" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                </div>
               
                <Footer/>

            </>
        );
    }
    return (
        <>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Login to watch videos</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>To play a video in your browser please login enjoy waching videos</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="exampleModal02" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Subscribtion to watch videos</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>You have not any active plan Please Subscribtion any plan</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>

                    </div>
                </div>
            </div>

            <div className="main_2 clearfix">
                <section id="center" className="center_home">
                    <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-indicators">
                            {posts.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    data-bs-target="#carouselExampleCaptions"
                                    data-bs-slide-to={index}
                                    className={index === 0 ? 'active' : ''}
                                    aria-label={`Slide ${index + 1}`}
                                ></button>
                            ))}
                        </div>
                        <div className="carousel-inner">
                            {posts.map((post, index) => (
                                <div key={post._id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                    <img src={post.image} className="d-block w-100" alt={post.title} />
                                    <div className="carousel-caption d-md-block">
                                        <h5 className="text-white-50 release ps-2 fs-6">{post.createdAt}</h5>
                                        <h1 className="font_80 mt-4">{post.title}</h1>
                                        <h6 className="text-white">
                                            <span className="rating d-inline-block rounded-circle me-2 col_green">{post.imdbScore}</span>
                                            <span className="col_green">IMDB SCORE</span>
                                            <span className="mx-3">{post.createdAt}</span>
                                            <span className="col_red">
                                                {post.postTags?.length ? post.postTags.map(tag => tag.title).join(', ') : 'No Tags'}
                                            </span>
                                        </h6>
                                        <p className="mt-4">{post.body}</p>
                                        {userRole && (<>
                                            <h5 className="mb-0 mt-4 text-uppercase bg-success p-2">
                                                <Link className="nav-link" to={`/editpost/${post._id}`}>Edit<i className="fa fa-edit ms-1"></i></Link>
                                            </h5>
                                        </>)}
                                        {!userId && (<>
                                            <h5 className="mb-0 mt-4 text-uppercase">
                                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="fa fa-youtube-play me-1"></i> Watch Trailer</button>
                                            </h5>
                                        </>)}
                                        {activeDays <= 0 && userId && !userRole && (<>
                                            <h5 className="mb-0 mt-4 text-uppercase">
                                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal02"><i className="fa fa-youtube-play me-1"></i> Watch Trailer</button>
                                            </h5>
                                        </>)}
                                        {((userId && activeDays >= 1) || userRole == "Admin") && (<>
                                            <h5 className="mb-0 mt-4 text-uppercase">
                                                {/* <Link className="nav-link active" to="/home">Home</Link> */}
                                                <Link className="button" to={`/video/${post._id}`}><i className="fa fa-youtube-play me-1"></i> Watch Trailer</Link>
                                            </h5>
                                        </>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </section>
            </div>
        </>
    );
}

export default HeroVideo;