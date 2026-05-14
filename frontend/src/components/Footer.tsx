import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-dark text-light py-5 mt-auto shadow-lg">
            <div className="container text-center">
                <h4 className="fw-bold mb-3">Kaloria</h4>
                <p className="mb-0">
                    Твій щоденник харчування та баланс калорій.
                </p>
                <p className="small text-secondary mt-2">
                    © {new Date().getFullYear()} Kaloria
                </p>
            </div>
        </footer>
    );
};

export default Footer;
