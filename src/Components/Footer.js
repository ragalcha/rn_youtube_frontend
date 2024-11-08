import React from 'react';
import { Link } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import { getCookie, setCookie } from '../utility/cookieUtils';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
function Footer() {
  
    const [trialRemaining, setTrialRemaining] = useState(0); 
    const [user , setUser] = useState(0);
    const [subscriptionRemaining, setsubscriptionRemaining] = useState(0);
       // Function to handle the "GET STARTED" button click
    
    useEffect(() => {
        const userDetails = getCookie('user')?getCookie('user') : 0 ;
        if (userDetails) {
            setUser(userDetails);
            setsubscriptionRemaining(getCookie('SubscriptionActiveDays')?getCookie('SubscriptionActiveDays') : 0 );
        }
        if (userDetails.trialActive) {
            const trialExpiresAt = new Date(userDetails.trialExpiresAt);
            const trialStartedAt = new Date(userDetails.trialStartedAt);
            const currentDate = new Date();

            // Convert dates to UTC midnight
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

            setTrialRemaining(effectiveDaysRemaining);
        }
        console.log("i ma footer user details-->",userDetails);

    }, []);
    const handleGetStarted = async () => {
        const user = getCookie('user');
        const accessToken = getCookie('accessToken');

        if (!user) {
            toast.error("Please log in to start your free trial.");
            return;
        }

        try {
            // Make a request to the API to activate the free trial
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/v1/user/update/${user._id}`,
                {
                    freeTrial: true
                }, // No request body needed for this example
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );
             console.log("Get started free trial-->",response,response.data.message);
             setUser(response.data.data.user);
             setCookie('user',response.data.data.user, { maxAge: 3600 });
             if (user.trialActive) {
                const trialExpiresAt = new Date(user.trialExpiresAt);
                const trialStartedAt = new Date(user.trialStartedAt);
                const currentDate = new Date();
    
                // Convert dates to UTC midnight
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
    
                setTrialRemaining(effectiveDaysRemaining);
            }
            // Handle successful response
            toast.success(response.data.message);
        } catch (error) {
            // Handle error response
            console.error("Error starting free trial:", error);
            toast.error("Failed to start free trial. Please try again.");
        }
    };

    return (
        <>
            <section id="footer" className="p_3 bg_dark">
                <div className="container-xl">
                    <div className="row footer_1 text-center">
                        <div className="col-md-12">
                        {!user.trialActive && (<> 
                               
                            <h1 className="text-white">Start for your first 30 days.</h1>
                            <p className="text-light">Ready to watch? Enter your email to create or restart your membership.</p>
                            <div className="input-group get-started w-50 m-auto">
                                {/* <input type="text" className="form-control rounded-0 fs-6" placeholder="Type your e-mail address"/> */}
                                    <span className="input-group-btn">
                                        <button className="btn btn-primary bg_red rounded-0 bg_red fw-bold" type="button"  onClick={handleGetStarted}   >
                                            GET STARTED
                                         </button>
                                    </span>
                            </div>
                            </>)}
                            {user.trialActive && !user.subscriptionActive && (<> 
                               
                               <h1 className="text-white">Your free trial will end in {trialRemaining} days</h1>
                               <p className="text-light">After that, your membership will be cancelled.</p>
                               <div className="input-group get-started w-50 m-auto">
                                   {/* <input type="text" className="form-control rounded-0 fs-6" placeholder="Type your e-mail address"/> */}
                                            <Link className="btn btn-primary bg_red rounded-0 bg_red fw-bold"   to = "/subscribtion" >
                                              Upgrade the plan
                                            </Link>
                                     
                                       <span className="input-group-btn">
                                       </span>
                               </div>
                            </>)}
                            {user.subscriptionActive && (<> 
                               
                               <h1 className="text-white">Your subscription will end in {subscriptionRemaining} days</h1>
                               <p className="text-light">After that, your membership will be cancelled.</p>
                               <div className="input-group get-started w-50 m-auto">
                                   {/* <input type="text" className="form-control rounded-0 fs-6" placeholder="Type your e-mail address"/> */}
                                            <Link className="btn btn-primary bg_red rounded-0 bg_red fw-bold"   to = "/subscribtion" >
                                              Upgrade the plan
                                            </Link>
                                     
                                       <span className="input-group-btn">
                                       </span>
                               </div>
                            </>)}
                        </div>
                    </div>
                    <div className="row footer_2 mt-4 pt-4">
                        <div className="col-md-4">
                            <div className="footer_2i">
                                <h5 className="text-white">Questions? Call 9399707035</h5>
                                <p className="text-muted mt-3">Format for custom post types that are not book or you can use else if to specify a second post type the same way as above.</p>
                                <select name="categories" className="form-select mt-4 bg-transparent w-50 rounded-0 fw-bold" required="">
                                    <option value="">English</option>
                                    <option disabled>coming soon</option>

                                </select>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="footer_2i">
                                <h5 className="text-uppercase col_red mb-3">Play Show</h5>
                                <ul className="mb-0 row">
                                    <li className="col-md-12 col-6 p-0"><a className="text-muted" href="#">Play Show</a></li>
                                    <li className="mt-2 col-md-12 col-6 p-0"><a className="text-muted" href="#">Devices</a></li>
                                    <li className="mt-2 col-md-12 col-6 p-0"><a className="text-muted" href="#">Tips</a></li>
                                    <li className="mt-2 col-md-12 col-6 p-0"><a className="text-muted" href="#">Contact</a></li>
                                    <li className="mt-2 col-md-12 col-6 p-0"><a className="text-muted" href="#">Legal Notices</a></li>
                                    <li className="mt-2 col-md-12 col-6 p-0"><a className="text-muted" href="#">Our Terms</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="footer_2i">
                                <h5 className="text-uppercase col_red mb-3">SUPPORT</h5>
                                <ul className="mb-0 row">
                                    <li className="col-md-12 col-6 p-0"><a className="text-muted" href="#">Help Center</a></li>
                                    <li className="mt-2 col-md-12 col-6 p-0"><a className="text-muted" href="#">FAQ</a></li>
                                    <li className="mt-2 col-md-12 col-6 p-0"><a className="text-muted" href="#">Account</a></li>
                                    <li className="mt-2 col-md-12 col-6 p-0"><a className="text-muted" href="#">Privacy Policy</a></li>
                                    <li className="mt-2 col-md-12 col-6 p-0"><a className="text-muted" href="#">Media Center</a></li>
                                    <li className="mt-2 col-md-12 col-6 p-0"><a className="text-muted" href="#">Support</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="footer_2i">
                                <h5 className="text-uppercase col_red mb-3">Newsletter</h5>
                                <p className="text-muted mt-3">Format for custom post types that are not book or you can use else if to specify a second post type the same way as above.</p>
                                <input className="form-control mt-3 bg-transparent rounded-0" placeholder="Enter Your Email" type="text"/>
                                    <h6 className="mb-0 text-uppercase mt-4"><a className="button" href="#"><i className="fa fa-location-arrow me-1"></i> SUBMIT NOW</a></h6>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="footer_b">
                <div className="container-xl">
                    <div className="row footer_b1 text-center">
                        <div className="col-md-12">
                            <p className="mb-0 text-muted">© 2024 Movie Hub. All Rights Reserved | Design by <b>Ramaiya Agalcha</b></p>
                        </div>
                    </div>
                </div>
            </section>
            </>
    );
}

export default Footer