import React, { createContext, useState, useContext } from 'react';

const PopupContext = createContext();

export function usePopup() {
    return useContext(PopupContext);
}

export const PopupProvider = ({ children }) => {
    const [popup, setPopup] = useState({ show: false, type: "", message: "" });

    // Show pop up with default timeout 3 seconds
    const showPopup = (type, message, timeout = 3000) => {
        closePopup();
        setPopup({ show: true, type, message });

        setTimeout(() => {
            setPopup({ show: false, type: "", message: "" });
        }, timeout);
    };

    // manuel close pop up
    const closePopup = () => {
        setPopup({ show: false, type: "", message: "" });
    };

    return (
        <PopupContext.Provider value={{ showPopup, closePopup, popup }}>
            {children}
        </PopupContext.Provider>
    );
};
