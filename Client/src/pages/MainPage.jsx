import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { usePopup } from '../contexts/PopUpContext';
import "../styles/MainPage.css";
import { main_page_config } from "../config";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import NewAnnouncement from "../components/NewAnnouncement";

import user_icon from "../assets/user.png";
import Announcements from "../components/Announcements";

function MainPage() {
    const { showPopup } = usePopup();
    const [content, setContent] = useState(null);
    // let DynamicComponent = (content != null) ? main_page_config.company.page_content[content] : null;
    const { user } = useUser();
    const navigate = useNavigate();
    
    useEffect(() => {
        if(!user){
            showPopup("alert", "You need to sign in first !");
            navigate("/");
        }
    }, [user]);

    return (
        <div className="main_page_div">
            <Header username={user.user[`${user.role}Name`]} profile_icon={user_icon} profile_link="#" />
            <div className="main_page_section">
                <Navbar navbar_items={main_page_config.company.navbar_items} />
                <div className="main_page_content">
                    {/* {DynamicComponent ? <DynamicComponent /> : null} */}
                    <NewAnnouncement />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default MainPage;
