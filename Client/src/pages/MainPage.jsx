import { useState } from 'react';
import { useUser } from '../UserContext';
import "../styles/MainPage.css";
import { main_page_config } from "../config";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

import user_icon from "../assets/user.png";

function MainPage() {
    const [content, setContent] = useState(null);
    let DynamicComponent = (content != null) ? main_page_config.company.page_content[content] : null;
    const { user } = useUser();

    return (
        <div className="main_page_div">
            <Header username={user.role} profile_icon={user_icon} profile_link="#" />
            <div className="main_page_section">
                <Navbar navbar_items={main_page_config.company.navbar_items} />
                <div className="main_page_content">
                    {DynamicComponent ? <DynamicComponent /> : null}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default MainPage;
