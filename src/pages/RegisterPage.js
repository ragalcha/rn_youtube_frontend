import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { setCookie, getCookie, removeCookie } from '../utility/cookieUtils';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
function RegisterPage() {

    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log('newfirstName', firstName, 'lastName', lastName, 'email', email, 'password', password);
        try {

          const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/user/register`, {
            firstName: "John",
            lastName: "Doe",
            userName: "rrr",
            email: "john.doe@example.com",
            password: "password123"
        });
            console.log("hello-->", response);
            toast.success(response.data.message);
            return navigate('/login');
        } catch (error) {
            console.log("error-->", error?.response?.data?.message);
            toast.error(error?.response?.data?.message);
        }
    };
    useEffect(() => {
        const user = getCookie('user');
        if (user) {
            return navigate('/home');
        }
    }, []);
    return (
        <>
            <div class="main clearfix position-relative">
                <Header />
                <form className="login-form register-form" onSubmit={handleRegister}>
                    <p className="login-text">
                        <span className="fa-stack fa-lg">
                            <i className="fa fa-circle fa-stack-2x"></i>
                            <i className="fa fa-lock fa-stack-1x"></i>
                        </span>
                    </p>
                    <input type="text" className="login-username" autofocus="true" required="true" placeholder="firstName" value={firstName}
                        onChange={(e) => setFirstName(e.target.value)} />
                    <input type="text" className="login-username" autofocus="true" required="true" placeholder="lastName" value={lastName}
                        onChange={(e) => setLastName(e.target.value)} />
                    <input type="text" className="login-username" autofocus="true" required="true" placeholder="userName" value={userName}
                        onChange={(e) => setUserName(e.target.value)} />
                    <input type="email" className="login-username" autofocus="true" required="true" placeholder="Email" value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" className="login-password" required="true" placeholder="Password" value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                    <input type="submit" name="Register" value="Register" className="login-submit" />
                </form>
                <Link className="nav-link" to="/login">Login</Link>
                <div className="underlay-photo">
                    <video autoPlay muted loop id="background-video">
                        <source src="/video/file_example_MP4_640_3MG.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className="underlay-black"></div>
            </div>
            <Footer />
        </>
    );

}

export default RegisterPage