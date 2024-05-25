import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import "../styles/MainPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import {main_config} from "../config";
import user_icon from "../assets/user.png";

function MainPage({ children }) {
    const { user } = useUser();

    return (
        <div className="main_page_div">
            <Header username={user.user[`${user.role}Name`]} profile_icon={user_icon} profile_link="#" />
            <div className="main_page_section">
                <Navbar navbar_items={main_config[user.role].navbar_items}/>
                <div className="main_page_content">
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    );
}


export default MainPage;
