import React from "react";
import Header from "../Components/Header";
// import SavedVideo from "../Components/SavedVideo";
import { Link } from "react-router-dom";
import Category from "../Components/Category";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getCookie } from "../utility/cookieUtils";
import { useState, useEffect } from 'react';
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import Footer from "../Components/Footer";
import Loading from "../Components/Loading";


function CategoryPage() {

    const { categoryName, categoryId } = useParams(); // Get categoryId from URL
    const [categoryData, setCategoryData] = useState({});
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    console.log("usr params", useParams(), categoryName, categoryId);
    useEffect(() => {
        console.log("hello i am useeffect");
        const fetchCategoryData = async () => {
          const userCookie = getCookie('user');
          let user = null;
      
          try {
              // Handle both string and object cases
              user = typeof userCookie === 'string' ? JSON.parse(userCookie) : userCookie;
          } catch (error) {
              console.error("Error parsing user cookie:", error);
          }
      
          try {
              if (user) {
                  setUserId(user._id);
                  if (user?.userRole?.name === 'Admin') {
                      setUserRole('Admin');
                  }
              }
      
              const response = await axios.get(
                  `${process.env.REACT_APP_API_URL}/api/v1/post/postsbytag/${categoryId}`, 
                  {
                      headers: {
                          'Authorization': `Bearer ${getCookie('accessToken')}`
                      }
                  }
              );
      
              const data = response.data;
              console.log("Category data:", data);
      
              if (Array.isArray(data.posts)) {
                  setCategoryData(data.posts);
              } else {
                  console.error('Unexpected response format:', data);
                  setCategoryData([]);
              }
      
              setLoading(false);
          } catch (error) {
              console.error('Error fetching posts:', error);
              setLoading(false);
          }
      };
      
      

        fetchCategoryData();
    }, [categoryId]); // Dependency array with categoryId to refetch data when it changes

    const fetchCategoryData = async () => {
        const user = getCookie('user');

        try {
            if (user) {
                setUserId(user._id);

                if (user.userRole.name === 'Admin') {
                    setUserRole('Admin');
                }
            }

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/post/postsbytag/${categoryId}`, {
                headers: {
                    'Authorization': `Bearer ${getCookie('accessToken')}`
                }
            });
            const data = response.data;
            console.log("category data ---->???", response);
            if (Array.isArray(data.posts)) {
                setCategoryData(data.posts);
            } else {
                console.error('Unexpected response format:', data);
                setCategoryData([]);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };
    if (loading) {
        return (
           <Loading
           text = {categoryName}
           title = {categoryName}
           />
        )
    }

    return (
        <>
            <div className="main clearfix position-relative">
                <Header />
                <div className="main_about clearfix">
                    <section id="center" className="center_blog">
                        <div className="container-xl">
                            <div className="row center_o1">
                                <div className="col-md-12">
                                    <h2 className="text-white">{categoryName}</h2>
                                    <h6 className="mb-0 mt-3 fw-normal col_red">
                                        <Link className="text-light" to="/home">Home</Link>
                                        <span className="mx-2 text-muted">/</span> {categoryName}
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <Category categorydata={categoryData} />
            </div>
            <Footer />
        </>
    );
}

export default CategoryPage;
