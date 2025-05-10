import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Display = () => {
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

    useEffect(() => {
        if (useCustomTheme) {
            document.body.style.backgroundColor = primaryColor;
            document.body.style.color = secondaryColor;
            document.body.style.fontSize = `${fontSize}px`;
            document.body.style.fontFamily = fontFamily;
            document.body.style.lineHeight = lineHeight;
            document.body.style.letterSpacing = `${letterSpacing}px`;
        } else {
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
            document.body.style.fontSize = '';
            document.body.style.fontFamily = '';
            document.body.style.lineHeight = '';
            document.body.style.letterSpacing = '';
        }

        localStorage.setItem('useCustomTheme', JSON.stringify(useCustomTheme));
        localStorage.setItem('primaryColor', primaryColor);
        localStorage.setItem('secondaryColor', secondaryColor);
        localStorage.setItem('fontSize', fontSize);
        localStorage.setItem('fontFamily', fontFamily);
        localStorage.setItem('borderRadius', borderRadius);
        localStorage.setItem('lineHeight', lineHeight);
        localStorage.setItem('letterSpacing', letterSpacing);
        localStorage.setItem('enable3D', JSON.stringify(enable3D));
    }, [useCustomTheme, primaryColor, secondaryColor, fontSize, fontFamily, borderRadius, lineHeight, letterSpacing, enable3D]);

    const handlePrimaryColorChange = (e) => setPrimaryColor(e.target.value);
    const handleSecondaryColorChange = (e) => setSecondaryColor(e.target.value);
    const handleFontSizeChange = (e) => setFontSize(e.target.value);
    const handleFontFamilyChange = (e) => setFontFamily(e.target.value);
    const handleBorderRadiusChange = (e) => setBorderRadius(e.target.value);
    const handleLineHeightChange = (e) => setLineHeight(e.target.value);
    const handleLetterSpacingChange = (e) => setLetterSpacing(e.target.value);
    const toggle3DRender = () => setEnable3D(!enable3D);
    const toggleCustomTheme = () => setUseCustomTheme(!useCustomTheme);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4" style={{ color: useCustomTheme ? secondaryColor : '' }}>Display Settings</h1>
            <div className="card p-4" style={{ backgroundColor: useCustomTheme ? primaryColor : '', borderRadius: `${borderRadius}px` }}>
                <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="useCustomTheme"
                        checked={useCustomTheme}
                        onChange={toggleCustomTheme}
                    />
                    <label className="form-check-label" htmlFor="useCustomTheme">
                        Use Custom Theme
                    </label>
                </div>
                {useCustomTheme && (
                    <>
                        <div className="mb-3">
                            <label className="form-label">
                                Primary Color:
                                <input
                                    type="color"
                                    className="form-control form-control-color mt-2"
                                    value={primaryColor}
                                    onChange={handlePrimaryColorChange}
                                />
                            </label>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">
                                Secondary Color:
                                <input
                                    type="color"
                                    className="form-control form-control-color mt-2"
                                    value={secondaryColor}
                                    onChange={handleSecondaryColorChange}
                                />
                            </label>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">
                                Font Size: {fontSize}px
                                <input
                                    type="range"
                                    className="form-range mt-2"
                                    min="10"
                                    max="50"
                                    value={fontSize}
                                    onChange={handleFontSizeChange}
                                />
                            </label>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">
                                Font Family:
                                <select
                                    className="form-select mt-2"
                                    value={fontFamily}
                                    onChange={handleFontFamilyChange}
                                >
                                    <option value="Arial, sans-serif">Arial</option>
                                    <option value="'Courier New', Courier, monospace">Courier New</option>
                                    <option value="'Georgia', serif">Georgia</option>
                                    <option value="'Times New Roman', Times, serif">Times New Roman</option>
                                    <option value="'Verdana', sans-serif">Verdana</option>
                                </select>
                            </label>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Border Radius: {borderRadius}px
                                <input
                                    type="range"
                                    className="form-range mt-2"
                                    min="10"
                                    max="50"
                                    value={borderRadius}
                                    onChange={handleBorderRadiusChange}
                                />
                            </label>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">
                                Line Height: {lineHeight}
                                <input
                                    type="range"
                                    className="form-range mt-2"
                                    min="1"
                                    max="3"
                                    step="0.1"
                                    value={lineHeight}
                                    onChange={handleLineHeightChange}
                                />
                            </label>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">
                                Letter Spacing: {letterSpacing}px
                                <input
                                    type="range"
                                    className="form-range mt-2"
                                    min="0"
                                    max="10"
                                    value={letterSpacing}
                                    onChange={handleLetterSpacingChange}
                                />
                            </label>
                        </div>
                    </>
                )}
                <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="enable3D"
                        checked={enable3D}
                        onChange={toggle3DRender}
                    />
                    <label className="form-check-label" htmlFor="enable3D">
                        Enable 3D Renders
                    </label>
                </div>
            </div>
            <div className="mt-4">
                <p style={{ color: useCustomTheme ? secondaryColor : '' }}>Current Settings:</p>
                <ul className="list-group">
                    <li className="list-group-item">Custom Theme: {useCustomTheme ? 'Enabled' : 'Disabled'}</li>
                    <li className="list-group-item">Primary Color: {primaryColor}</li>
                    <li className="list-group-item">Secondary Color: {secondaryColor}</li>
                    <li className="list-group-item">Font Size: {fontSize}px</li>
                    <li className="list-group-item">Font Family: {fontFamily}</li>
                    <li className="list-group-item">Border Radius: {borderRadius}px</li>
                    <li className="list-group-item">Line Height: {lineHeight}</li>
                    <li className="list-group-item">Letter Spacing: {letterSpacing}px</li>
                    <li className="list-group-item">3D Renders: {enable3D ? 'Enabled' : 'Disabled'}</li>
                </ul>
            </div>
        </div>
    );
};

export default Display;