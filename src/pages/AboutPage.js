import React from "react";
import Header from "../Components/Header";
import { Link } from 'react-router-dom';
import Footer from "../Components/Footer";
function AboutPage() {
    return (
        <>
            <div className="main clearfix position-relative">
                <Header />
                <div className="main_about clearfix">
                    <section id="center" className="center_blog">
                        <div className="container-xl">
                            <div className="row center_o1">
                                <div className="col-md-12">
                                    <h2 className="text-white">About Us</h2>
                                    <h6 className="mb-0 mt-3 fw-normal col_red">
                                        <Link className="text-light" to="/home">Home</Link>
                                        <span className="mx-2 text-muted">/</span> About Us
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <section id="feature" className="p_3">
                    <div className="container-xl">
                        <div className="feature_1 row">
                            <div className="col-md-6">
                                <div className="feature_1l clearfix">
                                    <h5 className="col_red">Welcome to Our Movie Hub</h5>
                                    <h1>Experience the Latest Blockbusters</h1>
                                    <p>At our site, we are passionate about bringing you the latest and greatest movies. We strive to provide a seamless streaming experience for movie enthusiasts around the world. Our platform offers a vast selection of new releases, all available to watch for free online.</p>
                                    <p>For over a decade, we've dedicated ourselves to ensuring our users have access to high-quality entertainment. Our team works tirelessly to add new content regularly, ensuring you never miss out on the hottest new films.</p>
                                    <div className="feature_1li1 row">
                                        <div className="col-md-6">
                                            <div className="feature_1li1l clearfix">
                                                <h4>Exclusive Content</h4>
                                                <p>Get access to exclusive releases and early previews of the latest movies.</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="feature_1li1l clearfix">
                                                <h4>Seamless Streaming</h4>
                                                <p>Enjoy uninterrupted viewing with our user-friendly streaming platform.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mb-0">We are committed to delivering an exceptional viewing experience, combining top-notch technology with a vast library of movies to ensure you have the best entertainment at your fingertips.</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="feature_1r clearfix">
                                    <div className="grid clearfix">
                                        <figure className="effect-jazz mb-0">
                                            <a href="#"><img src="img/movies.jpg" className="w-100" alt="Movies" /></a>
                                        </figure>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
            <Footer />
        </>
    );
}

export default AboutPage;
