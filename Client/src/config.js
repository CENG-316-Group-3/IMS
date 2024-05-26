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
import CompanyAnAnnouncement from "./page_contents/company/CompanyAnAnnouncement";

// Student Page Contents //
import StudentAnOpportunity from "./page_contents/student/AnOpportunity";
import StudentOpportunities from "./page_contents/student/Opportunities";
import StudentAnApplication from "./page_contents/student/StdAnApplication";
import StudentApplicationList from "./page_contents/student/StudentApplicationList";
import StudentProfile from "./page_contents/student/StudentProfile";

// Coordinator Page Contents //
import CoordinatorCompanyRegisterRequestList from "./page_contents/coordinator/CompanyRegisterRequestList";
import CoordinatorCompanyInternshipAnnRequestList from "./page_contents/coordinator/CompInternshipAnnRequestList";
import CoordinatorInternshipDetailPage from "./page_contents/coordinator/CompInternshipDetailPage";
import CoordinatorAnAnnouncementPage from "./page_contents/coordinator/CoordinatorAnAnnouncementPage";
import CoordinatorAnnouncementsList from "./page_contents/coordinator/CoordinatorAnnouncementsList";
import CoordinatorNewAnnouncement from "./page_contents/coordinator/CoordinatorNewAnnouncement";
import CoordinatorViewStdAnApplication from "./page_contents/coordinator/CoordinatorViewStdAnAplication";
import CoordinatorViewStdApplicationsList from "./page_contents/coordinator/CoordinatorViewStdApplicationsList";

// Secretariat Page Contents //
import SecretariatPage from "./page_contents/secretariat/SecretariatPage";

// Others Page Contents //
import FeedbackPage from "./page_contents/FeedbackPage";
import ApplicationLetter from "./page_contents/ApplicationLetter";
import ApplicationForm from "./page_contents/ApplicationForm";

const site_map = [
    // Company Routes //
    { role: "company", link: "/company_profile", page_content: null}, // debugging purpose
    { role: "company", link: "/company_internship_announcements", page_content: CompanyAnnouncements},
    { role: "company", link: "/company_new_internship_announcement", page_content: CompanyNewAnnouncement },
    { role: "company", link: "/company_applications", page_content: CompanyApplications },
    { role: "company", link: "/company_an_application/:id", page_content: CompanyAnApplication },
    { role: "company", link: "/company_an_announcement/:id", page_content: CompanyAnAnnouncement },

    // Student Routes //
    { role: "student", link: "/student_profile", page_content: StudentProfile },
    { role: "student", link: "/student_announcements", page_content: null },
    // student_an_announcement add
    { role: "student", link: "/student_applications", page_content: StudentApplicationList },
    { role: "student", link: "/student_new_application/:id", page_content: StudentAnApplication },
    { role: "student", link: "/student_opportunities", page_content: StudentOpportunities },
    { role: "student", link: "/student_an_opportunity/:id", page_content:StudentAnOpportunity },

    // Coordinator Routes //
    { role: "coordinator", link: "/coordinator_profile", page_content: null },
    { role: "coordinator", link: "/coordinator_company_registers", page_content: CoordinatorCompanyRegisterRequestList },
    { role: "coordinator", link: "/coordinator_my_announcements", page_content: CoordinatorAnnouncementsList },
    { role: "coordinator", link: "/coordinator_an_announcement/:id", page_content: CoordinatorAnAnnouncementPage },
    { role: "coordinator", link: "/coordinator_create_announcement", page_content: CoordinatorNewAnnouncement },
    { role: "coordinator", link: "/coordinator_internship_opportunity_requests", page_content: CoordinatorCompanyInternshipAnnRequestList },
    { role: "coordinator", link: "/coordinator_internship_detail_page/:id", page_content: CoordinatorInternshipDetailPage },
    { role: "coordinator", link: "/coordinator_student_applications", page_content: CoordinatorViewStdApplicationsList },
    { role: "coordinator", link: "/coordinator_student_an_application/:id", page_content: CoordinatorViewStdAnApplication },

    // Secretariat Routes // 
    { role: "secretariat", link: "/secretariat_profile", page_content: null },
    { role: "secretariat", link: "/secretariat_documents", page_content: SecretariatPage },

    // Other Routes //
    { role: "", link: "/feedback/:id", page_content: FeedbackPage },
    { role: "", link: "/application_letter/:id", page_content: ApplicationLetter },
    { role: "", link: "/application_form/:id", page_content: ApplicationForm },

];

const generate_allowed_routes_with_site_map = (role) => {
    const result = ["/main"];
    for (const item of site_map){
        if (item.role === role)
            result.push(item.link);
    }
    return result;
};

const main_config = {
    company: {
        navbar_items: [
            { icon: megaphone_red, hover_icon: megaphone_white, text: "Internship Announcements", link: "/company_internship_announcements" },
            { icon: megaphone_red, hover_icon: megaphone_white, text: "New Internship Announcement", link: "/company_new_internship_announcement" },
            { icon: app_form_red, hover_icon: app_form_white, text: "Applications", link: "/company_applications" },
        ],
        allowed_routes: generate_allowed_routes_with_site_map("company").concat(["/feedback/:id", "/application_letter/:id", "/application_form/:id"]),
    },
    student: {
        navbar_items: [
            { icon: megaphone_red, hover_icon: megaphone_white, text: "Announcements", link: "/student_announcements" },
            { icon: app_form_red, hover_icon: app_form_white, text: "Applications", link: "/student_applications" },
            { icon: briefcase_red, hover_icon: briefcase_white, text: "Opportunities", link: "/student_opportunities" }
        ],
        allowed_routes: generate_allowed_routes_with_site_map("student").concat(["/application_letter/:id", "/application_form/:id"]),
    },
    coordinator: {
        navbar_items: [
            { icon: document_red, hover_icon: document_white, text: "Company Registers", link: "/coordinator_company_registers" },
            { icon: megaphone_red, hover_icon: megaphone_white, text: "My Announcements", link: "/coordinator_my_announcements" },
            { icon: megaphone_red, hover_icon: megaphone_white, text: "New Announcement", link: "/coordinator_create_announcement" },
            { icon: briefcase_red, hover_icon: briefcase_white, text: "Internship Opportunity Requests", link: "/coordinator_internship_opportunity_requests" },
            { icon: app_form_red, hover_icon: app_form_white, text: "Student Applications", link: "/coordinator_student_applications" },
        ],
        allowed_routes: generate_allowed_routes_with_site_map("coordinator").concat(["/feedback/:id", "/application_letter/:id", "/application_form/:id"]),
    },
    secretariat: {
        navbar_items: [
            { icon: document_red, hover_icon: document_white, text: "Documents", link: "/secretariat_documents" },
        ],
        allowed_routes: generate_allowed_routes_with_site_map("secretariat").concat([]),
    }
};

export {main_config, site_map};