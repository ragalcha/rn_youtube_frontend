import React , { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { setCookie, getCookie, removeCookie } from '../utility/cookieUtils';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleRegister = async (e) => {
      e.preventDefault();
      console.log('email', email, 'password', password);
      try {
        console.log('email', email, 'password', password);
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/user/login`, {
          email,
          password
        });
         console.log("================",response.data.data.user[0]);
         toast.success(response.data.message);
         setCookie('user', response.data.data.user[0], { maxAge: 3600 }); // Set cookie for 1 hour
         setCookie('accessToken', response.data.data.accessToken, { maxAge: 3600 }); // Set cookie for 1 hour
         setCookie('refreshToken', response.data.data.refreshToken, { maxAge: 3600 }); // Set cookie for 1 hour
         if(response.data.data.user[0].trialActive){
            const userDetails = response.data.data.user[0];
            const trialExpiresAt = new Date(userDetails.trialExpiresAt);
            const trialStartedAt = new Date(userDetails.trialStartedAt);
            const currentDate = new Date();
            const startOfTrial = new Date(trialStartedAt.getUTCFullYear(), trialStartedAt.getUTCMonth(), trialStartedAt.getUTCDate());
            const endOfTrial = new Date(trialExpiresAt.getUTCFullYear(), trialExpiresAt.getUTCMonth(), trialExpiresAt.getUTCDate());
            const today = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate());
            const timeDiff = endOfTrial - today;
            const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            
            // Adjust for the trial starting date, if needed
            // Ensure the trial does not go below 0
            const daysSinceStart = Math.floor((today - startOfTrial) / (1000 * 60 * 60 * 24));
            const totalTrialDays = Math.floor((endOfTrial - startOfTrial) / (1000 * 60 * 60 * 24));

            const effectiveDaysRemaining = Math.max(0, totalTrialDays - daysSinceStart);
            setCookie('activeDays',effectiveDaysRemaining, { maxAge: 3600 });

         }
         if(response.data.data.user[0].subscriptionActive){
          const userDetails = response.data.data.user[0];
          const subscripExpiresAt = new Date(userDetails.subscriptionExpiresAt);
          const subscripStartedAt = new Date(userDetails.subscriptionStartedAt);
      
          const currentDate = new Date();
          // Convert dates to UTC midnight
          const startOfsubscrip = new Date(subscripStartedAt.getUTCFullYear(), subscripStartedAt.getUTCMonth(), subscripStartedAt.getUTCDate());
          const endOfsubscrip = new Date(subscripExpiresAt.getUTCFullYear(), subscripExpiresAt.getUTCMonth(), subscripExpiresAt.getUTCDate());
          const today = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate());

          const timeDiff = endOfsubscrip - today;
          const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
          const daysSinceStart = Math.floor((today - startOfsubscrip) / (1000 * 60 * 60 * 24));
          const totalsubscripDays = Math.floor((endOfsubscrip - startOfsubscrip) / (1000 * 60 * 60 * 24));
          const effectiveDaysRemaining = Math.max(0, totalsubscripDays - daysSinceStart);
          setCookie('SubscriptionActiveDays',effectiveDaysRemaining, { maxAge: 3600 });

         }
         return navigate('/home');
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
                <input type="email" className="login-username" autoFocus={true} required="true" placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)} />
                <input type="password" className="login-password" required="true" placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)} />
                <input type="submit" name="Login" value="Login" className="login-submit" />
            </form>
            <a href="#" className="login-forgot-pass">forgot password?</a>
            <div className="underlay-photo">
                <video autoPlay muted loop id="background-video">
                    <source src="/video/file_example_MP4_640_3MG.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className="underlay-black"></div>
           </div>
           <Footer/>
        </>
    );

}

export default LoginPage