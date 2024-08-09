import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../Components/CheckoutForm';
import { getCookie, setCookie } from '../utility/cookieUtils';
import { useNavigate } from 'react-router-dom';
import Footer from "../Components/Footer";
import Loading from "../Components/Loading";



// Make sure to replace this with your own public key
const stripePromise = loadStripe("pk_test_51PlTYz07zjwllNh6FD5zsjY0u40DldDLvWf8YfAHi6Yd5fKrphvLYsHc7ggHZaO8B2cBokJdB6UmXVCjJgriBFAE00HasgJQYf");

function SubscribtionPage() {
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState([]);
    const [clientSecret, setClientSecret] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [amount, setAmount] = useState(0);
    const [user, setUser] = useState({});
    const [subscriptionId, setSubscriptionId] = useState('');
    const [subscriptionDuration, setSubscriptionDuration] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        const user = getCookie('user');
        setUserDetails(user);
        if (!user) {
            navigate('/login');
            return;
        }

        // if (user.userRole.name === "User") {
        //     navigate('/home');
        //     return;
        // }

        const fetchSubscriptions = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/subscription/subscriptions`);
                setSubscriptions(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching subscriptions:', error);
                toast.error('Failed to fetch subscriptions.');
            }
        };

        fetchSubscriptions();
    }, [navigate]);


    const handleSubscribe = async (amount, newSubscriptionId, newSubscriptionDuration) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/payment/create-payment-intent`, { amount: amount }, {
                headers: {
                    'Authorization': `Bearer ${getCookie('accessToken')}`
                }
            });
            console.log("payment ----------->and subscription", response.data, newSubscriptionId);
            setClientSecret(response.data.clientSecret); // Make sure this is correctly set
            setShowModal(true); // Show modal on successful payment intent creation
            setAmount(response.data.amount);
            setSubscriptionId(newSubscriptionId);
            setSubscriptionDuration(newSubscriptionDuration);
        } catch (error) {
            console.error('Error creating payment intent:', error);
            toast.error('Failed to create payment intent.');
        }
    };


    const updateSubscription = async () => {
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
                    subscriptionActive: true,
                    subscriptionId: subscriptionId,
                    subscriptionDuration: subscriptionDuration
                }, // No request body needed for this example
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );
            console.log("Get started free trial-->001", response, response.data.message);
            setUser(response.data.data.user);
            setCookie('user', response.data.data.user, { maxAge: 3600 }); // Set cookie for 1 hour
            // setCookie('accessToken', response.data.data.accessToken, { maxAge: 3600 }); // Set cookie for 1 hour
            // setCookie('refreshToken', response.data.data.refreshToken, { maxAge: 3600 }); // Set cookie for 1 hour
            if(response.data.data.user.trialActive){
               const userDetails = response.data.data.user;
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
            if(response.data.data.user.subscriptionActive){
             const userDetails = response.data.data.user;
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
            
            //  if (user.trialActive) {
            //     const trialExpiresAt = new Date(user.trialExpiresAt);
            //     const trialStartedAt = new Date(user.trialStartedAt);
            //     const currentDate = new Date();

            //     // Convert dates to UTC midnight
            //     const startOfTrial = new Date(trialStartedAt.getUTCFullYear(), trialStartedAt.getUTCMonth(), trialStartedAt.getUTCDate());
            //     const endOfTrial = new Date(trialExpiresAt.getUTCFullYear(), trialExpiresAt.getUTCMonth(), trialExpiresAt.getUTCDate());
            //     const today = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate());

            //     const timeDiff = endOfTrial - today;
            //     const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

            //     // Adjust for the trial starting date, if needed
            //     // Ensure the trial does not go below 0
            //     const daysSinceStart = Math.floor((today - startOfTrial) / (1000 * 60 * 60 * 24));
            //     const totalTrialDays = Math.floor((endOfTrial - startOfTrial) / (1000 * 60 * 60 * 24));

            //     const effectiveDaysRemaining = Math.max(0, totalTrialDays - daysSinceStart);

            //     setTrialRemaining(effectiveDaysRemaining);
            // }
            // Handle successful response
            toast.success(response.data.message);
        } catch (error) {
            // Handle error response
            console.error("Error subscribing to plan:", error);
            toast.error("Failed to start subscription. Please try again.");
        }
    }
    if (loading) {
        return (
           <Loading
           text = "Best Subscribtion Offers for You"
           title = "Subscribtion"
           />
        )
    }
    return (
        <>
        <div className="main clearfix position-relative">
            <Header />
            <div className="modal fade" id="exampleModal5" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Login to watch videos</h5>
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
            <div className="main_about clearfix">
                <section id="center" className="center_blog">
                    <div className="container-xl">
                        <div className="row center_o1">
                            <div className="col-md-12">
                                <h2 className="text-white">Best Subscription Offers for You</h2>
                                <h6 className="mb-0 mt-3 fw-normal col_red">
                                    <Link className="text-light" to="/home">Home</Link>
                                    <span className="mx-2 text-muted">/</span> Subscription Us
                                </h6>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <section id="spec" className="p_3 bg_dark">
                <div className="container-xl">
                    <div className="row stream_1 text-center">
                        <div className="col-md-12">
                            <h6 className="text-white-50">FIND ANYWHERE ELSE </h6>
                            <h1 className="mb-0 text-white font_50">Subscription Plan For You</h1>
                        </div>
                    </div>
                    <div className="row spec_1 mt-4 subscription0-card">
                        {subscriptions.map(subscription => (
                            <div className="col-md-4 mb-4" key={subscription._id}>
                                <div className="card" style={{ width: "18rem" }}>
                                    <div className="card-body">
                                        <h5 className="card-title">{subscription.name}</h5>
                                        <p className="card-text">{subscription.description}</p>
                                        <p className="card-text">{subscription.price} inr</p>
                                        <p className="card-text">{subscription.duration} Month</p>
                                    {!userDetails.subscriptionActive  && (<>  
                                     <button
                                            className="btn btn-primary"
                                            onClick={() => handleSubscribe(subscription.price, subscription._id, subscription.duration)} // assuming price is in dollars
                                        >
                                            Subscribe
                                        </button>
                                        </>
                                    )}
                                      {userDetails.subscriptionActive  && (<>  
                                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal5">

                                            
                                            Subscribe
                                        </button>
                                        </>
                                    )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {showModal && clientSecret && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Complete Payment</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <Elements stripe={stripePromise}>
                                    <CheckoutForm
                                        amount={amount}
                                        clientSecret={clientSecret}
                                        onSuccess={() => {
                                            // setClientSecret('');
                                            setShowModal(false); // Hide modal on successful payment
                                            updateSubscription();
                                        }}
                                    />
                                </Elements>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Toaster />
        </div>
        <Footer/>
        </>
    );
}

export default SubscribtionPage;
