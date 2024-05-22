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

/* TEMP PART */
import user_icon from "../assets/user.png";

function MainPage() {
    return (
        <div className="main_page_div">
            <Header username="ünal dalkılıç" profile_icon={user_icon} profile_link=""/>
            <Navbar navbar_items={[
                {icon: document_red, hover_icon: document_white, text: "Documents"},
                {icon: megaphone_red, hover_icon: megaphone_white, text: "Notifications"},
                {icon: app_form_red, hover_icon: app_form_white, text: "Applications"},
                // Add others
            ]}/>
            <Footer />
        </div>
    )
}

export default MainPage;