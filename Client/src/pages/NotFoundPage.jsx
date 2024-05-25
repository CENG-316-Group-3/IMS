import React from "react";
import "../styles/NotFoundPage.css";
import primary_background from "../assets/not_found.gif";
import secondary_background from "../assets/spaceman-galaxy-thumb.jpg";

function NotFoundPage() {
    return (
        <div className="not_found_page_div background_cover" style={{backgroundImage: `url(${(primary_background ? primary_background : secondary_background)})`}}>
            <div className="not_found_content">
                <h2><span>404</span> IMS NOT FOUND</h2>
                <h3>Stop ! Where are you going ?</h3>
            </div>
        </div>
    );
}

export default NotFoundPage;