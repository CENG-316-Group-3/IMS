import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { usePopup } from '../contexts/PopUpContext';
import "../styles/MainPage.css";
import { main_page_config } from "../config";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";


import user_icon from "../assets/user.png";
import NewAnnouncement from "../page_contents/company/NewAnnouncement";
import Announcements from "../page_contents/company/Announcements";
import Popup from "../components/Popup";
import ApplicationsList from "../page_contents/company/ApplicationsList";
import AnApplication from "../page_contents/company/AnApplication";


function MainPage() {
    const { showPopup } = usePopup();
    const [content, setContent] = useState(null);
    // let DynamicComponent = (content != null) ? main_page_config.company.page_content[content] : null;
    const { user } = useUser();
    const navigate = useNavigate();

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
