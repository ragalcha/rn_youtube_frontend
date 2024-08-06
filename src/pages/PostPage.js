import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getCookie } from '../utility/cookieUtils';
import Header from '../Components/Header';

function PostPage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [imdbScore, setImdbScore] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const handleRegister = async (e) => {
        e.preventDefault();
        const accessToken = getCookie('accessToken');
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('body', body);
            if (image) formData.append('image', image);
            if (video) formData.append('video', video);
            formData.append('postTags', JSON.stringify(selectedCategories)); // Store IDs as JSON string
            formData.append('imdbScore', imdbScore);

            const response = await axios.post('https://rn-youtube-backend.onrender.com/api/v1/post/createpost', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}` // Use the access token from cookies
                }
            });
            toast.success(response.data.message);
            navigate('/home');
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

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

        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://rn-youtube-backend.onrender.com/api/v1/category/categories');
                setCategories(response.data.data); // Set categories in state
            } catch (error) {
                console.error("Error fetching categories:", error); // Handle and log any errors
            }
        };

        fetchCategories();
    }, [navigate]);

    return (
        <>
            <div className="main clearfix position-relative">
                <Header />
                <Toaster position="top-center" />
                <form className="login-form post-form" onSubmit={handleRegister}>
                    <p className="login-text">
                        <span className="fa-stack fa-lg">
                            <i className="fa fa-circle fa-stack-2x"></i>
                            <i className="fa fa-lock fa-stack-1x"></i>
                        </span>
                    </p>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        className="login-username"
                        required
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <label htmlFor="body">Body</label>
                    <textarea
                        id="body"
                        className="login-username"
                        required
                        placeholder="Body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />
                    <label htmlFor="image">Image</label>
                    <input
                        type="file"
                        id="image"
                        className="login-username"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                    <label htmlFor="video">Video</label>
                    <input
                        type="file"
                        id="video"
                        className="login-username"
                        accept="video/*"
                        onChange={(e) => setVideo(e.target.files[0])}
                    />
                    <label htmlFor="categories">Categories</label>
                    <select
                        id="categories"
                        multiple
                        className="login-username"
                        required
                        value={selectedCategories}
                        onChange={(e) => {
                            const options = e.target.options;
                            const values = [];
                            for (let i = 0; i < options.length; i++) {
                                if (options[i].selected) {
                                    values.push(options[i].value);
                                }
                            }
                            setSelectedCategories(values);
                        }}
                    >
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.title}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="imdbScore">IMDB Score</label>
                    <input
                        type="number"
                        id="imdbScore"
                        className="login-username"
                        required
                        placeholder="IMDB Score"
                        value={imdbScore}
                        onChange={(e) => setImdbScore(e.target.value)}
                    />
                    <input type="submit" name="Post" value="Post" className="login-submit" />
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

export default PostPage;
