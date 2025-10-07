import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <svg
            viewBox="0 0 100 100"
            className={className}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M85.5 42.15L52.3 12.2C51.0333 11.0333 48.9667 11.0333 47.7 12.2L14.5 42.15C13.5667 43 13.7333 44.55 14.85 45.25L47.65 65.6C49 66.45 51 66.45 52.35 65.6L85.15 45.25C86.2667 44.55 86.4333 43 85.5 42.15Z"
                className="text-emerald-500"
                fill="currentColor"
            />
            <path
                d="M50 70.15V90L85.15 69.7C86.2667 69 86.4333 67.45 85.5 66.6L52.35 40.05C51.0333 39.0333 48.9667 39.0333 47.65 40.05L14.5 66.6C13.5667 67.45 13.7333 69 14.85 69.7L50 90V70.15Z"
                className="text-emerald-400"
                fill="currentColor"
            />
        </svg>
    );
};
