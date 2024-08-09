import React from 'react';
import Header from '../Components/Header';
import { Link } from 'react-router-dom';
import Footer from '../Components/Footer';

function Loading({text, title}) {
    return (
        <div className="main clearfix position-relative">
        <Header />
        <div className="main_about clearfix">
            <section id="center" className="center_blog">
                <div className="container-xl">
                    <div className="row center_o1">
                        <div className="col-md-12">
                            <h2 className="text-white">{text}</h2>
                            <h6 className="mb-0 mt-3 fw-normal col_red">
                                <Link className="text-light" to="/home">Home</Link>
                                <span className="mx-2 text-muted">/</span> {title}
                            </h6>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <div className="loding-custom">
            <div className="spinner-grow text-primary" role="status">
                <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-secondary" role="status">
                <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-success" role="status">
                <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-danger" role="status">
                <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-warning" role="status">
                <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-info" role="status">
                <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-light" role="status">
                <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-dark" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
        <Footer/>
    </div>
    );
}

export default Loading;