import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Components/Header';
import Footer from './Components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import PostPage from './pages/PostPage';
import EditPostPage from './pages/EditPostPage';
import AboutPage from './pages/AboutPage';
import UserProfilePage from './pages/UserProfilePage';
import PostCategoryPage from './pages/PostCategoryPage';
import UserRolePage from './pages/UserRolePage';
import UsersPage from './pages/UsersPage';
import VideoPlayPage from './pages/VideoPlayPage';
import Postcrud from './pages/Postcrud';
import SavedVideoPage from './pages/SavedVideoPage';
function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/createpost" element={<PostPage />} />
          <Route path="/editpost/:postId" element={<EditPostPage />} /> {/* Add route for EditPostPage */}
          <Route path="/about" element={<AboutPage />} /> 
          <Route path="/user/:userId" element={<UserProfilePage />} />
          <Route path="/category" element={<PostCategoryPage />} /> 
          <Route path="/userrole" element={<UserRolePage />} /> 
          <Route path="/users" element={<UsersPage />} /> 
          <Route path="/video/:videoId" element={<VideoPlayPage />} /> 
          <Route path="/post/crud" element={<Postcrud />} /> 
          <Route path="/saved" element={<SavedVideoPage />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
