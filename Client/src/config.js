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

// Company Page Contents //
import CompanyNewAnnouncement from "./page_contents/company/NewAnnouncement";
import CompanyAnApplication from "./page_contents/company/AnApplication";
import CompanyAnnouncements from "./page_contents/company/Announcements";
import CompanyApplications from "./page_contents/company/ApplicationsList";

// Student Page Contents //
import StudentAnOpportunity from "./page_contents/student/AnOpportunity";
import StudentOpportunities from "./page_contents/student/Opportunities";
import StudentAnApplication from "./page_contents/student/StdAnApplication";
import StudentApplicationList from "./page_contents/student/StudentApplicationList";
import StudentProfile from "./page_contents/student/StudentProfile";
import FeedbackPage from "./page_contents/FeedbackPage";

const main_config = {
    company: {
        navbar_items: [
            { icon: megaphone_red, hover_icon: megaphone_white, text: "Internship Announcements", link: "/company_internship_announcements" },
            { icon: megaphone_red, hover_icon: megaphone_white, text: "New Internship Announcement", link: "/company_new_internship_announcement" },
            { icon: app_form_red, hover_icon: app_form_white, text: "Applications", link: "/company_applications" },
        ],
        allowed_routes: [
            "/main", "/company_internship_announcements", "/company_new_internship_announcement", "/company_applications", "/company_an_application/:id", "/company_profile",
        ],
    },
    student: {
        navbar_items: [
            { icon: megaphone_red, hover_icon: megaphone_white, text: "Announcements", link: "/student_announcements" },
            { icon: app_form_red, hover_icon: app_form_white, text: "Applications", link: "/student_applications" },
            { icon: new_app_form_red, hover_icon: new_app_form_white, text: "New Application", link: "/student_new_application" },
            { icon: briefcase_red, hover_icon: briefcase_white, text: "Opportunities", link: "/student_opportunities" }
        ],
        allowed_routes: [
            "/main", "/student_announcements", "/student_applications", "/student_new_application/:id", "/student_opportunities", "/student_profile", "/student_an_opportunity/:id", 
        ],
    },
    coordinator: {
        navbar_items: [
            { icon: "", hover_icon: "", text: "Company Registers", link: "/coordinator_company_registers" },
            { icon: megaphone_red, hover_icon: megaphone_white, text: "My Announcements", link: "/coordinator_my_announcements" },
            { icon: megaphone_red, hover_icon: megaphone_white, text: "New Announcement", link: "/coordinator_create_announcement" },
            { icon: briefcase_red, hover_icon: briefcase_white, text: "Internship Opportunity Requests", link: "/coordinator_internship_opportunity_requests" },
            { icon: app_form_red, hover_icon: app_form_white, text: "Student Applications", link: "/coordinator_student_applications" },
        ],
        allowed_routes: [
            "/main", "/coordinator_profile", "/coordinator_company_registers", "/coordinator_my_announcements", "/coordinator_create_announcement", "/coordinator_internship_opportunity_requests", "/coordinator_student_applications",
        ]
    }
};

const site_map = [
    // Company Routes //
    { link: "/company_profile", page_content: FeedbackPage}, // debugging purpose
    { link: "/company_internship_announcements", page_content: CompanyAnnouncements},
    { link: "/company_new_internship_announcement", page_content: CompanyNewAnnouncement },
    { link: "/company_applications", page_content: CompanyApplications },
    { link: "/company_an_application/:id", page_content: CompanyAnApplication },

    // Student Routes //
    { link: "/student_profile", page_content: StudentProfile },
    { link: "/student_announcements", page_content: null },
    { link: "/student_applications", page_content: StudentApplicationList },
    { link: "/student_new_application/:id", page_content: StudentAnApplication },
    { link: "/student_opportunities", page_content: StudentOpportunities },
    { link: "/student_an_opportunity/:id", page_content:StudentAnOpportunity },

    // Coordinator Routes //
    
];

export {main_config, site_map};