import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'
import { toast } from 'react-hot-toast';
import { setCookie, getCookie, removeCookie } from '../utility/cookieUtils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Connect to your server
function Header() {
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState(getCookie('accessToken'));
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userRole, setUserRole] = useState(null);
    
    const logout = async (e) => {
        try {
            setUserId(null);
            removeCookie('user');
            removeCookie('accessToken');
            removeCookie('refreshToken');
            return navigate('/login');
            console.log("i am starting the logout the process");
            const response = await axios.post(
                'http://localhost:3001/api/v1/user/logout',
                 null, // No body data for this request
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${getCookie('accessToken')}`
                    }
                }
            );
            console.log(response);
            toast.success(response.data.message);
            setUserId(null);
            removeCookie('user');
            removeCookie('accessToken');
            removeCookie('refreshToken');
            return navigate('/login');
            // setCookie('user', response.data.data.user[0], { maxAge: 3600 }); // Set cookie for 1 hour
        } catch (error) {
            console.log(error);
            toast.error("somthing went wrong");
        }
    };

    useEffect(() => {
        const user = getCookie('user');
        console.log(accessToken);
        console.log("userDetails", user);
        
           // Socket.io event listener for notifications
        socket.on('notification', (message) => {
            console.log("socket message",message);
            toast.success(message);
        });

        if(user){
            setUserId(user._id);
            setUserName(user.userName);
            setUserRole(user.userRole.name);
        }
        const navbarSticky = document.getElementById("navbar_sticky");
        const navbarHeight = navbarSticky ? navbarSticky.offsetHeight : 0;
        const sticky = navbarSticky ? navbarSticky.offsetTop : 0;

        const handleScroll = () => {
            if (window.scrollY >= sticky + navbarHeight) {
                navbarSticky.classList.add("sticky");
                document.body.style.paddingTop = navbarHeight + 'px';
            } else {
                navbarSticky.classList.remove("sticky");
                document.body.style.paddingTop = '0';
            }
        };


        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="main_1 clearfix position-absolute top-0 w-100">
            <Toaster position="top-center" />
            <section id="header">
                <nav className="navbar navbar-expand-md navbar-light" id="navbar_sticky">
                    <div className="container-xl">
                        <a className="navbar-brand fs-2 p-0 fw-bold text-white m-0 me-5" href="index.html"><i className="fa fa-youtube-play me-1 col_red"></i> Play Show </a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mb-0">

                                <li className="nav-item">
                                    <Link className="nav-link active" to="/home">Home</Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/about">About</Link>
                                </li>
                                {userId && (<> 
                                <li className="nav-item">
                                    <Link className="nav-link" to="/saved"><i className="fa fa-heart fa-solid" style={{ fontSize: '23px', color: 'red',marginRight:'5px' }}></i>Saved Videos</Link>
                                </li>
                                </>)}
                                {userRole == 'Admin' && (<> 
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Admin
                                    </a>
                                    <ul className="dropdown-menu drop_1" aria-labelledby="navbarDropdown">
                                        <Link className="dropdown-item" to="/createpost">Create Post</Link>
                                        <Link className="dropdown-item" to="/category">Create Category</Link>
                                        <Link className="dropdown-item" to="/userrole">Create User Role</Link>
                                        <Link className="dropdown-item" to="/users">All Username</Link>
                                        <Link className="dropdown-item" to="/post/crud">All Post</Link>
                                    </ul>
                                </li>
                                </>)}

                                {/* <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Pages
                                    </a>
                                    <ul className="dropdown-menu drop_1" aria-labelledby="navbarDropdown">
                                        <li><a className="dropdown-item" href="account.html"> My Account</a></li>
                                        <li><a className="dropdown-item border-0" href="contact.html"> Contact</a></li>
                                    </ul>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link" href="team.html">Team</a>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link" href="contact.html">Contact</a>
                                </li> */}

                            </ul>
                            <ul className="navbar-nav mb-0 ms-auto">
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle dropdown_search" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="true">
                                        <i className="fa fa-search"></i>
                                    </a>
                                    <ul className="dropdown-menu drop_1 drop_o p-3" aria-labelledby="navbarDropdown" data-bs-popper="none">
                                        <li>
                                            <div className="input-group p-2">
                                                <input type="text" className="form-control border-0" placeholder="Search Here" />
                                                <span className="input-group-btn">
                                                    <button className="btn btn-primary bg-transparent border-0 fs-5" type="button">
                                                        <i className="fa fa-search col_red"></i> </button>
                                                </span>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle dropdown_search" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="true">
                                        <i className="fa fa-bell-o"></i>
                                    </a>
                                    <ul className="dropdown-menu drop_1 drop_o drop_o1 p-0" aria-labelledby="navbarDropdown" data-bs-popper="none">
                                        <li className="bg_red text-white p-3 fw-bold">
                                            Notification <span className="bg-white col_red span_1  rounded-circle d-inline-block me-1">3</span>
                                        </li>
                                        <li className="p-3 pb-0">
                                            <div className="row">
                                                <div className="col-md-2 pe-0 col-2"><i className="fa fa-circle col_red font_8"></i></div>
                                                <div className="col-md-10 ps-0 col-10">
                                                    <a className="fw-normal text-capitalize" href="#">Semper</a> download 2000+ Simple Line Icons and Explore<br />
                                                    <span className="text-muted font_14">2 Days</span>
                                                </div>
                                            </div>
                                        </li><hr/>
                                            <li className="p-3 pt-0"><div className="row">
                                                <div className="col-md-2 pe-0 col-2"><i className="fa fa-circle col_red font_8"></i></div>
                                                <div className="col-md-10 ps-0 col-10">
                                                    Added new movie <a className="fw-normal text-capitalize" href="#">Porta</a> Cheatsheet to Start Using With Your Projects.<br />
                                                    <span className="text-muted font_14">3 Days</span>
                                                </div>
                                            </div></li>
                                    </ul>
                                </li>
                                 
                                {userId && (<> <li className="nav-item">
                                    <Link className="nav-link" to={`/user/${userId}`}><i className="fa fa-user fs-4 align-middle me-1 lh-1 col_red"></i> {userName} </Link>
                                </li>
                                <li className="nav-item">
                                <button type ="button" className="nav-link" onClick={logout} >Logout</button>
                               </li></>)}
                               {!userId && (<> 
                                <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                               </li>
                               <li className="nav-item">
                                <Link className="nav-link" to="/register">Register</Link>
                               </li></>)}
                            </ul>
                        </div>
                    </div>
                </nav>
            </section>

        </div>
    );



}

export default Header;