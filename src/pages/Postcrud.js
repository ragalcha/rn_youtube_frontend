import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import Header from '../Components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import { getCookie } from '../utility/cookieUtils';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
function Postcrud() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [newPost, setNewPost] = useState({
        title: '',
        body: '',
        image: null,
        video: null,
    });

    useEffect(() => {
        const user = getCookie('user');
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.userRole.name !== "Admin") {
            navigate('/home');
            return;
        }
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('https://rn-youtube-backend.onrender.com/api/v1/post/posts');
            setPosts(response.data.posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            toast.error('Failed to fetch posts.');
        }
    };

    const handleCreatePost = async () => {
        const formData = new FormData();
        formData.append('title', newPost.title);
        formData.append('body', newPost.body);
        if (newPost.image) formData.append('image', newPost.image);
        if (newPost.video) formData.append('video', newPost.video);

        try {
            await axios.post('https://rn-youtube-backend.onrender.com/api/v1/post/createpost', formData,  {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getCookie('accessToken')}` // Use the access token from cookies
                 }
             });
            toast.success('Post created successfully.');
            fetchPosts();
            setShowCreateModal(false);
            setNewPost({ title: '', body: '', image: null, video: null });
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error('Failed to create post.');
        }
    };

    const handleUpdatePost = async () => {
        const formData = new FormData();
        formData.append('title', currentPost.title);
        formData.append('body', currentPost.body);
        if (currentPost.image) formData.append('image', currentPost.image);
        if (currentPost.video) formData.append('video', currentPost.video);

        try {
            await axios.put(`https://rn-youtube-backend.onrender.com/api/v1/post/updatepost/${currentPost._id}`, formData,  {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getCookie('accessToken')}` // Use the access token from cookies
                 }
             });
            toast.success('Post updated successfully.');
            fetchPosts();
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating post:', error);
            toast.error('Failed to update post.');
        }
    };

    const handleDeletePost = async () => {
        try {
            await axios.delete(`https://rn-youtube-backend.onrender.com/api/v1/post/deletepost/${currentPost._id}`,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getCookie('accessToken')}` // Use the access token from cookies
                 }
             });
            toast.success('Post deleted successfully.');
            fetchPosts();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error('Failed to delete post.');
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
                                    <h2 className="text-white">Posts</h2>
                                    <h6 className="mb-0 mt-3 fw-normal col_red">
                                    <Link className="text-light" to="/home">home</Link>      
                                    <span className="mx-2 text-muted">/</span> Posts
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <div className="main clearfix position-relative">
                    <div className="container">
                        <div className="d-flex justify-content-between mb-3">
                            <h2 className="text-white">Posts</h2>
                            <Button variant="primary" onClick={() => setShowCreateModal(true)}>Create Post</Button>
                        </div>
                        <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Body</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map((post, index) => (
                                    <tr key={post._id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{post.title}</td>
                                        <td>{post.body}</td>
                                        <td>
                                            <Button variant="warning" onClick={() => { setCurrentPost(post); setShowEditModal(true); }}>Edit</Button>
                                            <Button variant="danger" className="ml-2" onClick={() => { setCurrentPost(post); setShowDeleteModal(true); }}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </div>

                    {/* Create Post Modal */}
                    <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create Post</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newPost.title}
                                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Body</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={newPost.body}
                                    onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label>Image</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) => setNewPost({ ...newPost, image: e.target.files[0] })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Video</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) => setNewPost({ ...newPost, video: e.target.files[0] })}
                                />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Close</Button>
                            <Button variant="primary" onClick={handleCreatePost}>Save Changes</Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Edit Post Modal */}
                    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Post</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={currentPost?.title || ''}
                                    onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Body</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={currentPost?.body || ''}
                                    onChange={(e) => setCurrentPost({ ...currentPost, body: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label>Image</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) => setCurrentPost({ ...currentPost, image: e.target.files[0] })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Video</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) => setCurrentPost({ ...currentPost, video: e.target.files[0] })}
                                />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
                            <Button variant="primary" onClick={handleUpdatePost}>Save Changes</Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Delete Post Modal */}
                    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Delete Post</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to delete this post?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                            <Button variant="danger" onClick={handleDeletePost}>Delete</Button>
                        </Modal.Footer>
                    </Modal>

                    <Toaster />
                </div>
            </div>
        </>
    );
}

export default Postcrud;
