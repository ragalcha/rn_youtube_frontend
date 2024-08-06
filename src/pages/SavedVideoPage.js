import React from "react";
import Header from "../Components/Header";
import SavedVideo from "../Components/SavedVideo";
import { Link } from "react-router-dom";
function SavedVideoPage() {
    return (
        <div className="main clearfix position-relative">
            <Header />
            <div className="main_about clearfix">
                <section id="center" className="center_blog">
                    <div className="container-xl">
                        <div className="row center_o1">
                            <div className="col-md-12">
                                <h2 className="text-white"><i className="fa fa-heart fa-solid" style={{ fontSize: '43px', color: 'red' }}>  </i>Saved Videos</h2>
                                <h6 className="mb-0 mt-3 fw-normal col_red">
                                  <Link className="text-light" to="/home">Home</Link>
                                    <span className="mx-2 text-muted">/</span> Saved Videos
                                </h6>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <SavedVideo/>
        </div>
    );
}

export default SavedVideoPage;
