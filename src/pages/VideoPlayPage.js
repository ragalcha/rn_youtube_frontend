import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getCookie } from '../utility/cookieUtils';
import { Toaster, toast } from 'react-hot-toast';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import Header from '../Components/Header';
const VideoPlayPage = () => {
    const { videoId } = useParams();
    const playerRef = useRef(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`https://rn-youtube-backend.onrender.com/api/v1/post/post/${videoId}`, {
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

    return (
        <div>
               <div className="main clearfix position-relative">
               <Header />
               </div>
             <div className = "video-player-container">
             <video ref={playerRef} id="player" playsInline controls></video>
             </div>  
            <div>
                <Toaster />
            </div>
        </div>
    );
};

export default VideoPlayPage;
