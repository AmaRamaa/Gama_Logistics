import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Active from './Active';
import Idle from './Idle';
import Unavailable from './Unavailable';

const Dashboard = () => {
    const { topbarAttributes } = useParams();

    const [useCustomTheme, setUseCustomTheme] = useState(() => {
        const storedValue = localStorage.getItem('useCustomTheme');
        return storedValue !== null ? JSON.parse(storedValue) : false;
    });
    const [primaryColor, setPrimaryColor] = useState(localStorage.getItem('primaryColor') || '#0000ff');
    const [secondaryColor, setSecondaryColor] = useState(localStorage.getItem('secondaryColor') || '#00ff00');
    const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') || '16');
    const [fontFamily, setFontFamily] = useState(localStorage.getItem('fontFamily') || 'Arial, sans-serif');
    const [borderRadius, setBorderRadius] = useState(localStorage.getItem('borderRadius') || '10');
    const [lineHeight, setLineHeight] = useState(localStorage.getItem('lineHeight') || '1.5');
    const [letterSpacing, setLetterSpacing] = useState(localStorage.getItem('letterSpacing') || '0');
    const [enable3D, setEnable3D] = useState(() => {
        const storedValue = localStorage.getItem('enable3D');
        return storedValue !== null ? JSON.parse(storedValue) : true;
    });

    const baseStyle = {
        color: '#333',
        backgroundColor: '#f8f9fa',
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        borderRadius: '5px',
        lineHeight: '1.5',
        letterSpacing: '0',
        boxShadow: enable3D ? '2px 2px 5px rgba(0, 0, 0, 0.2)' : 'none',
    };

    const customStyle = {
        color: primaryColor,
        backgroundColor: secondaryColor,
        fontSize: `${fontSize}px`,
        fontFamily: fontFamily,
        borderRadius: `${borderRadius}px`,
        lineHeight: lineHeight,
        letterSpacing: `${letterSpacing}px`,
        boxShadow: enable3D ? '4px 4px 10px rgba(0, 0, 0, 0.3)' : 'none',
    };

    const appliedStyle = useCustomTheme ? customStyle : baseStyle;

    const renderSubComponent = () => {
        switch (topbarAttributes) {
            case 'active':	
                return <Active />;
            case 'idle':
                return <Idle />;
            case 'unavailable':
                return <Unavailable />;
            default:
                return <Active />;
        }
    };

    return (
        <div className="container-fluid py-4" style={appliedStyle}>
            <h2 className="mb-4 text-muted">Driver</h2>
            {renderSubComponent()}
        </div>
    );
};

export default Dashboard;
