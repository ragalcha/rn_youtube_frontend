import React from 'react';
import { Link } from 'react-router-dom';
function Footer() {
  
    return (
        <>
            <section id="footer" className="p_3 bg_dark">
                <div className="container-xl">
                    <div className="row footer_1 text-center">
                        <div className="col-md-12">
                            <h1 className="text-white">Start for your first 30 days.</h1>
                            <p className="text-light">Ready to watch? Enter your email to create or restart your membership.</p>
                            <div className="input-group w-50 m-auto">
                                <input type="text" className="form-control rounded-0 fs-6" placeholder="Type your e-mail address"/>
                                    <span className="input-group-btn">
                                        <button className="btn btn-primary bg_red rounded-0 bg_red fw-bold" type="button">
                                            GET STARTED </button>
                                    </span>
                            </div>
                        </div>
                    </div>
                    <div className="row footer_2 mt-4 pt-4">
                        <div className="col-md-4">
                            <div className="footer_2i">
                                <h5 className="text-white">Questions? Call 0850-380-6444</h5>
                                <p className="text-muted mt-3">Format for custom post types that are not book or you can use else if to specify a second post type the same way as above.</p>
                                <select name="categories" className="form-select mt-4 bg-transparent w-50 rounded-0 fw-bold" required="">
                                    <option value="">English</option>
                                    <option>French</option>
                                    <option>Hindi</option>
                                    <option>American</option>
                                    <option>German</option>
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
                            <p className="mb-0 text-muted">© 2013 Your Website Name. All Rights Reserved | Design by <a className="col_red" href="http://www.templateonweb.com">TemplateOnWeb</a></p>
                        </div>
                    </div>
                </div>
            </section>
            </>
    );
}

export default Footer