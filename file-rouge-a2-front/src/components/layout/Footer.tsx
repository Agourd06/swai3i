import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white mt-auto">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-lg font-semibold">Swai3i</h3>
                        <p className="text-gray-400">Learn, Grow, Succeed</p>
                    </div>
                    <div className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} CourseHub. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 