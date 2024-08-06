import React , { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { setCookie, getCookie, removeCookie } from '../utility/cookieUtils';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
function RegisterPage() {

    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleRegister = async (e) => {
      e.preventDefault();
      console.log('firstName', firstName, 'lastName', lastName,'email', email, 'password', password);
      try {
       
        const response = await axios.post('https://rn-youtube-backend.onrender.coms/api/v1/user/register', {
            firstName,
            lastName,
            userName,
            email,
            password
        });
         console.log(response);
         toast.success(response.data.message);
         return navigate('/login');
      } catch (error) {
        console.log(error);
         toast.error("somthing went wrong");
      }
    };
    useEffect(() => {
        const user = getCookie('user');
        if(user){
            return navigate('/home');
        }
    }, []);
    return (
        <>
         <div class="main clearfix position-relative">
            <Header />
            <form className="login-form" onSubmit={handleRegister}>
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
        </>
    );

}

export default RegisterPage