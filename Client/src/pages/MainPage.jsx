import "../styles/MainPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

// Icons //
import document_red from "../assets/document_red.png";
import document_white from "../assets/document_white.png";
import megaphone_red from "../assets/megaphone_red.png";
import megaphone_white from "../assets/megaphone_white.png";
import app_form_red from "../assets/app_form_red.png";
import app_form_white from "../assets/app_form_white.png";
import new_app_form_white from "../assets/new_app_form_white.png";
import new_app_form_red from "../assets/new_app_form_red.png";
import briefcase_red from "../assets/briefcase_red.png";
import briefcase_white from "../assets/briefcase_white.png";

/* TEMP PART */
import user_icon from "../assets/user.png";

function MainPage() {
    return (
        <div className="main_page_div">
            <Header username="ünal dalkılıç" profile_icon={user_icon} profile_link="" />
            <div className="main_page_section">

                <Navbar navbar_items={[
                    { icon: document_red, hover_icon: document_white, text: "Documents" },
                    { icon: megaphone_red, hover_icon: megaphone_white, text: "Announcements" },
                    { icon: app_form_red, hover_icon: app_form_white, text: "Applications" },
                    { icon: new_app_form_red, hover_icon: new_app_form_white, text: "New Application" },
                    { icon: briefcase_red, hover_icon: briefcase_white, text: "Opportunities" },
                    // Add others
                ]} />

                <div className="main_page_content">

                </div>
            </div>

            <Footer />
        </div>
    )
}

export default MainPage;