import React from "react";
import "./baseModal.css";

// parameter children is a special parameter that passes anything in between the opening and closing tags in the parent file
// then allows this function to render it
export default function ErrorModal({ isOpen, onClose, children}) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>x</button>
                {children}
            </div>
        </div>
    );
}