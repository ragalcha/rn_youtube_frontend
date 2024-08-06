import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { getCookie } from '../utility/cookieUtils';
import { Toaster } from "react-hot-toast";
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';

function EditPostPage() {
    const navigate = useNavigate();
    const { postId } = useParams();

    // Create refs for each input field
    const titleRef = useRef(null);
    const bodyRef = useRef(null);
    const imageRef = useRef(null);
    const videoRef = useRef(null);
    const postTagsRef = useRef(null);
    const imdbScoreRef = useRef(null);

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [postTags, setPostTags] = useState('');
    const [imdbScore, setImdbScore] = useState('');
    const [existingPost, setExistingPost] = useState(null);
    const [allTags, setAllTags] = useState([]); // State for all tags
    const [tagOptions, setTagOptions] = useState([]);

    useEffect(() => {
        const User = getCookie('user');
        const UserRole = getCookie('user.userRole.name');
        console.log("User", User, "UserRole", UserRole);

        // Fetch all tags
        const fetchTags = async () => {
            try {
                const response = await axios.get('https://rn-youtube-backend.onrender.com/api/v1/tags', {
                    headers: {
                        'Authorization': `Bearer ${getCookie('accessToken')}`
                    }
                });
                setAllTags(response.data.tags); // Adjust based on your response structure
                console.log("Tags", response.data.tags);
            } catch (error) {
                console.error('Error fetching tags:', error);
                toast.error("Failed to load tags");
            }
        };

        // Fetch the specific post
        const fetchPost = async () => {
            try {
                const response = await axios.get(`https://rn-youtube-backend.onrender.com/api/v1/post/post/${postId}`, {
                    headers: {
                        'Authorization': `Bearer ${getCookie('accessToken')}`
                    }
                });
                const post = response.data.post; // Adjust based on your response structure
                setExistingPost(post);
                setTitle(post.title);
                setBody(post.body);
                setPostTags(post.postTags.map(tag => tag.title).join(', ')); // Convert array to comma-separated string
                setImdbScore(post.imdbScore);
                setImage(post.image); // Set the existing image URL
                setVideo(post.video); // Set the existing video URL
                console.log("post", post._id);
            } catch (error) {
                console.error('Error fetching post:', error);
                toast.error("Failed to load post");
            }
        };

        fetchTags();
        fetchPost();
    }, [postId]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const accessToken = getCookie('accessToken');
        console.log('ACESS TOKEN', accessToken);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('body', body);
            if (image) formData.append('image', image);
            if (video) formData.append('video', video);
            formData.append('postTags', postTags.split(',').map(tag => tag.trim())); // Convert string back to array
            formData.append('imdbScore', imdbScore);

            const response = await axios.put(`https://rn-youtube-backend.onrender.com/api/v1/post/updatepost/${postId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            toast.success(response.data.message);
            navigate('/home');
        } catch (error) {
            console.error('Error updating post:', error);
            toast.error("Failed to update post");
        }
    };

    return (
        <>
            <div className="main clearfix position-relative">
                <Header />
                <Toaster position="top-center" />
                <form className="login-form post-form" onSubmit={handleUpdate}>
                    <p className="login-text">
                        <span className="fa-stack fa-lg">
                            <i className="fa fa-circle fa-stack-2x"></i>
                            <i className="fa fa-lock fa-stack-1x"></i>
                        </span>
                    </p>
                    <input
                        type="text"
                        className="login-username"
                        required
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        ref={titleRef}
                    />
                    <textarea
                        className="login-username"
                        required
                        placeholder="Body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        ref={bodyRef}
                    />
                    {/* Show existing image URL if available */}
                    {image && <img src={image} alt="Current"  width="200" height="100" className="current-image" />}
                    <br />
                    <a className="text-white "href={image} target = "blank">{image}</a>
                    <input
                        type="file"
                        className="login-username"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        ref={imageRef}
                    />
                    {/* Show existing video URL if available */}
                    {video && (
                        <video width="300" controls>
                            <source src={video} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    )}
                    <input
                        type="file"
                        className="login-username"
                        accept="video/*"
                        onChange={(e) => setVideo(e.target.files[0])}
                        ref={videoRef}
                    />
                    <input
                        type="text"
                        className="login-username"
                        required
                        placeholder="Post Tags (comma separated)"
                        value={postTags}
                        onChange={(e) => setPostTags(e.target.value)}
                        ref={postTagsRef}
                    />
                    <input
                        type="number"
                        className="login-username"
                        required
                        placeholder="IMDB Score"
                        value={imdbScore}
                        onChange={(e) => setImdbScore(e.target.value)}
                        ref={imdbScoreRef}
                    />
                    <input type="submit" name="Update" value="Update Post" className="login-submit" />
                </form>
                <Link className="nav-link" to="/home">Home</Link>
                <div className="underlay-photo">
                    <video autoPlay muted loop id="background-video">
                        <source src="/video/file_example_MP4_640_3MG.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className="underlay-black"></div>
            </div>
        </>
    );
}

export default EditPostPage;
