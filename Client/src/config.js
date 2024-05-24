// Icons //
import document_red from "./assets/document_red.png";
import document_white from "./assets/document_white.png";
import megaphone_red from "./assets/megaphone_red.png";
import megaphone_white from "./assets/megaphone_white.png";
import app_form_red from "./assets/app_form_red.png";
import app_form_white from "./assets/app_form_white.png";
import new_app_form_white from "./assets/new_app_form_white.png";
import new_app_form_red from "./assets/new_app_form_red.png";
import briefcase_red from "./assets/briefcase_red.png";
import briefcase_white from "./assets/briefcase_white.png";
import NewAnnouncement from "./page_contents/company/NewAnnouncement";

const main_page_config = {
    company: {
        navbar_items: [
            { icon: document_red, hover_icon: document_white, text: "Documents" },
            { icon: megaphone_red, hover_icon: megaphone_white, text: "Announcements" },
            { icon: megaphone_red, hover_icon: megaphone_white, text: "New Announcements" },
            { icon: app_form_red, hover_icon: app_form_white, text: "Applications" },
        ],
        page_content: {
            new_announcement: NewAnnouncement, 
        }
    },
    coordinator: {
        navbar_items: [
            { icon: document_red, hover_icon: document_white, text: "Documents" },
            { icon: megaphone_red, hover_icon: megaphone_white, text: "Announcements" },
            { icon: megaphone_red, hover_icon: megaphone_white, text: "New Announcements" },
            { icon: app_form_red, hover_icon: app_form_white, text: "Applications" },
            { icon: briefcase_red, hover_icon: briefcase_white, text: "Internship Opportunities" },
            { icon: briefcase_red, hover_icon: briefcase_white, text: "Company Registers" }, // TODO add Icon
        ],
        page_content: {

        }
    },
    student: {
        navbar_items: [
            { icon: document_red, hover_icon: document_white, text: "Documents" },
            { icon: megaphone_red, hover_icon: megaphone_white, text: "Announcements" },
            { icon: app_form_red, hover_icon: app_form_white, text: "Applications" },
            { icon: briefcase_red, hover_icon: briefcase_white, text: "Opportunities" },
        ],
        page_content: {

        }
    },
    secretariat: {
        navbar_items: [
            { icon: document_red, hover_icon: document_white, text: "Documents" },
        ],
        page_content: {

        }
    },
};

export {main_page_config};