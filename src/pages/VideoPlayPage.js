import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getCookie } from '../utility/cookieUtils';
import { Toaster, toast } from 'react-hot-toast';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
const VideoPlayPage = () => {
    const { videoId } = useParams();
    const playerRef = useRef(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/post/post/${videoId}`, {
                    headers: {
                        'Authorization': `Bearer ${getCookie('accessToken')}`
                    }
                });
                const post = response.data.post;
                   
                // Initialize Plyr
                if (playerRef.current) {
                    // Only initialize if not already initialized
                    new Plyr(playerRef.current, {
                        controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
                        // Add other Plyr options if needed
                    }).source = {
                        type: 'video',
                        sources: [{
                            src: post.video,
                            type: 'video/mp4'
                        }]
                    };
                }
                setLoading(false);

            } catch (error) {
                console.error('Error fetching post:', error);
                toast.error("Failed to load post");
            }
        };

        fetchPost();

        // Cleanup function to destroy the Plyr instance when the component unmounts
        return () => {
            if (playerRef.current) {
                const player = playerRef.current.plyr;
                if (player) {
                    player.destroy();
                }
            }
        };
    }, [videoId]);
    if (loading) {
        return (
            <>
                <div>
                    <div className="main clearfix position-relative">
                        <Header />
                    </div>
                    <div className="video-player-container"></div>
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
                </div>
                <div>
                    <Toaster />
                </div>
            
                <Footer />
        </>
    );
}
return (
    <>
        <div>
            <div className="main clearfix position-relative">
                <Header />
            </div>
            <div className="video-player-container">
                <video ref={playerRef} id="player" playsInline controls></video>
            </div>
            <div>
                <Toaster />
            </div>
        </div>
        <Footer />
    </>
);
};

export default VideoPlayPage;
