import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCookie } from '../utility/cookieUtils';
import { Link } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import { useParams } from 'react-router-dom';

function Category({ categorydata }) {
	const [posts, setPosts] = useState([]);
	const [userId, setUserId] = useState(null);
	const [userRole, setUserRole] = useState(null);
	const [roundNo, setRoundNo] = useState(0);
	const [savedPosts, setSavedPosts] = useState([]);
    const { categoryId } = useParams();
    // console.log("categorydata-->", categorydata);
    // const dataPosts = async () => {
    //     if(Object.keys(categorydata).length !== 0){
    //         setPosts(categorydata);
    //     }
    // }
    // dataPosts();
	useEffect(() => {
		const fetchPosts = async () => {
			const user = getCookie('user');

			try {
				if (user) {
					setUserId(user._id);
					
					if (user?.userRole?.name === 'Admin') {
						setUserRole('Admin');
					}
				}

				const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/post/postsbytag/${categoryId}`, {
					headers: {
						'Authorization': `Bearer ${getCookie('accessToken')}`
					}
				});
				const data = response.data;
                console.log("category data ---->???",response);
				if (Array.isArray(data.posts)) {
					setPosts(data.posts);
					setRoundNo(Math.ceil((data.posts.length) / 6));
				} else {
					console.error('Unexpected response format:', data);
					setPosts([]);
				}
			} catch (error) {
				console.error('Error fetching posts:', error);
			}
		};

		const fetchSavedPosts = async () => {
			try {
          

                const response = await axios.get('https://rn-youtube-backend.onrender.com/api/v1/like/liked', {
                    headers: {
                        'Authorization': `Bearer ${getCookie('accessToken')}`
                    }
                });

                // Directly set posts from the response data
                const data = response.data.data.map(like => ({
					like: like._id,
					videoId: like.video._id
				}));
                console.log("Saved video on Category componente-->", data);

                if (Array.isArray(data)) {
                    setSavedPosts(data);
                } else {
                    console.error('Unexpected response format:', data);
                    setPosts([]);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
		}

		fetchPosts();
		fetchSavedPosts();
	}, []);
	const handleLike = async (post) => {
		try {
            console.log("post----------------------->id", post);

			const response = await axios.post(`https://rn-youtube-backend.onrender.com/api/v1/like/like/${post}`, {
				headers: {
					'Authorization': `Bearer ${getCookie('accessToken')}`
				}
			});
            fetchSavedPosts();
		
		} catch (error) {
			console.error('Error fetching posts:', error);
		}
	}

	const handleUnLike = async (post) => {
		try {
            
			console.log("unliked ----->",post);

			const response = await axios.delete(`https://rn-youtube-backend.onrender.com/api/v1/like/unlike/${post}`, {
				headers: {
					'Authorization': `Bearer ${getCookie('accessToken')}`
				}
			});

			fetchSavedPosts();
         
			
		} catch (error) {
			console.error('Error fetching posts:', error);
		}
	}

	const fetchSavedPosts = async () => {
		try {
	  

			const response = await axios.get('https://rn-youtube-backend.onrender.com/api/v1/like/liked', {
				headers: {
					'Authorization': `Bearer ${getCookie('accessToken')}`
				}
			});

			// Directly set posts from the response data
			const data = response.data.data.map(like => ({
				like: like._id,
				videoId: like.video._id
			}));
			console.log("Saved video on Category componente-->", data);

			if (Array.isArray(data)) {
				setSavedPosts(data);
			} else {
				console.error('Unexpected response format:', data);
				setPosts([]);
			}
		} catch (error) {
			console.error('Error fetching posts:', error);
		}
	}

	const isIdInArray =  (array, videoIdToCheck) => {
		return array.some(item => item.videoId === videoIdToCheck);
	};

	const findLikeIdByVideoId = (array, videoIdToCheck) => {
		const foundItem = array.find(item => item.videoId === videoIdToCheck);
		return foundItem ? foundItem.like : null;
	};
     
    const displayPosts = categorydata.length > 0 ? categorydata : posts;

	return (
		<>
			<div className="modal fade" id="exampleModal01" tabIndex="-1" aria-labelledby="exampleModalLabel01" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel01">Login to watch videos</h5>
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
			<section id="spec" className="p_3 bg_dark">
				<div className="container-xl">
					<div className="row stream_1 text-center">
						<div className="col-md-12">
							<h6 className="text-white-50">FIND ANYWHERE ELSE </h6>
							<h1 className="mb-0 text-white font_50">Shows For You</h1>
						</div>
					</div>
					<div className="row spec_1 mt-4">
						{displayPosts.map(post => (
							<div key={post._id} className="col-lg-2 pe-0 col-md-4">
								<div className="spec_1im clearfix position-relative">
									{userId && (<>
										<Link className="btn" to={`/video/${post._id}`}><span class="paly-btn"><i class="fa fa-play" style={{ color: "white" }}></i></span></Link>

									</>)}
									{!userId && (<>
										<button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal01"><span class="paly-btn"><i class="fa fa-play" style={{ color: "white" }}></i></span></button>

									</>)}

									<div className="spec_1imi clearfix">
										<img src={post.image} className="w-100" alt={post.title} />
									</div>
									<div className="spec_1imi1 row m-0 w-100 h-100 clearfix position-absolute bg_col top-0">
										<div className="col-md-9 col-9 p-0">
											<div className="spec_1imi1l pt-2">
												<h6 className="mb-0 font_14 d-inline-block">
													<a className="bg-black d-block text-white" href="#">
														<span className="pe-2 ps-2"> 1080</span>
														<span className="bg-white d-inline-block text-black span_2">HD</span>
													</a>
												</h6>
											</div>
										</div>
										<div className="col-md-3 col-3 p-0">
											<div className="spec_1imi1r">
												<h6 className="text-white">
													<span className="rating d-inline-block rounded-circle me-2 col_green">{post.imdbScore}</span>
												</h6>
											</div>
											{/* <div className= "like-icon">
												<h5><i className="fa fa-heart-o " onClick={handleLike(post._id)} style={{ fontSize: '26px', color: 'red' }}>  </i></h5>
											</div> */}
											{isIdInArray(savedPosts, post._id) && (<> 
												<div className= "like-icon">
												  <h5><i className="fa fa-heart "  onClick={() => handleUnLike(findLikeIdByVideoId(savedPosts,post._id))} style={{ fontSize: '26px', color: 'red' }}>  </i></h5>
											    </div>
											</>)}
											{!isIdInArray(savedPosts, post._id) && (<> 
												<div className= "like-icon">
												  <h5><i className="fa fa-heart-o" onClick={() => handleLike(post._id)}  style={{ fontSize: '26px', color: 'red' }}>  </i></h5>
											    </div>
											</>)}
										</div>
									</div>
								</div>


								{userRole == 'Admin' && (<> 
									<div class="spec_1im1 clearfix edit-video-for-admin">
										<h5 className="mb-0 mt-4 text-uppercase bg-success p-2">
											<Link className="nav-link" to={`/editpost/${post._id}`}>Edit<i className="fa fa-edit ms-1"></i></Link>
										</h5>
									</div>
								</>)}
								<div className="spec_1im1 clearfix">
									<h6 className="text-light fw-normal font_14 mt-3">
										{/* {post.duration} min, */}
										<span className="col_red">{post.postTags?.length ? post.postTags.map(tag => tag.title).join(', ') : 'No Tags'}</span>
										{/* <span className="span_1 pull-right d-inline-block">{post.ratingLabel}</span> */}
									</h6>
									<h5 className="mb-0 fs-6">
										<a className="text-white" href="#">{post.title}</a>
									</h5>
								</div>
							</div>
						))}
					</div>
				</div>
				<Toaster />
			</section>
		</>
	);
}

export default Category;
