import React from 'react';
import { Link } from 'react-router-dom';

const topbarAttributesMap = {
    '/dashboard': ['Summary', 'Live Map', 'Notifications'],
    '/plan-route': ['North', 'South', 'East', 'West'],
    '/fleet': ['Available', 'In Maintenance', 'Use'],
    '/notification': ['Unread', 'All', 'System'],
    '/driver': ['Active', 'Idle', 'Unavailable'],
    '/report': ['Daily', 'Weekly', 'Monthly'],
    '/vehicle': ['Go Back'],
    '/settings': ['Profile', 'Security', 'Display', 'Language'],
    '/create' : ['Driver', 'Vehicle', 'User', 'Parcel'],
    '/edit' : ['Driver', 'Vehicle', 'User', 'Route', 'Report', 'Parcel'],
    '/help': ['FAQ', 'Contact Us'],
    '/invoice': ['Invoice', 'Payment', 'History'],
};

const faqs = [
    {
        question: 'How do I receive notifications?',
        answer: 'Enable notifications in your profile settings to receive updates about your shipments and account.'
    },
    {
        question: 'How do I view my dashboard summary?',
        answer: 'Go to the Dashboard and select "Summary" to see an overview of your activities.'
    },
    {
        question: 'How can I plan a route?',
        answer: 'Navigate to "Plan Route" and choose your desired direction: North, South, East, or West.'
    },
    {
        question: 'Where can I check my fleet status?',
        answer: 'Visit the Fleet page to see which vehicles are available, in maintenance, or in use.'
    },
    {
        question: 'How do I manage drivers?',
        answer: 'Go to the Driver section to view active, idle, or unavailable drivers.'
    },
    {
        question: 'How do I update my profile settings?',
        answer: 'Open Settings and select Profile, Security, Display, or Language to update your preferences.'
    },
    {
        question: 'How do I create a new user or parcel?',
        answer: 'Click on Create and choose Driver, Vehicle, User, or Parcel to add new entries.'
    },
    {
        question: 'How do I view my invoices?',
        answer: 'Go to the Invoice section to see your invoices, payments, and history.'
    },
    {
        question: 'How do I contact support?',
        answer: 'Go to Help and select "Contact Us" for support options.'
    }
];

const FAQ = () => {
    return (
        <div className="container my-5">
            <h1 className="mb-4">Frequently Asked Questions</h1>
            <div className="mb-4">
                {Object.keys(topbarAttributesMap).map(route => (
                    <Link
                        key={route}
                        to={route}
                        className="btn btn-outline-primary btn-sm me-2 mb-2"
                    >
                        {route.replace('/', '').replace('-', ' ').toUpperCase() || 'HOME'}
                    </Link>
                ))}
            </div>
            <div className="accordion" id="faqAccordion">
                {faqs.map((faq, idx) => (
                    <div className="accordion-item" key={idx}>
                        <h2 className="accordion-header" id={`heading${idx}`}>
                            <button
                                className={`accordion-button${idx !== 0 ? ' collapsed' : ''}`}
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapse${idx}`}
                                aria-expanded={idx === 0 ? 'true' : 'false'}
                                aria-controls={`collapse${idx}`}
                            >
                                {faq.question}
                            </button>
                        </h2>
                        <div
                            id={`collapse${idx}`}
                            className={`accordion-collapse collapse${idx === 0 ? ' show' : ''}`}
                            aria-labelledby={`heading${idx}`}
                            data-bs-parent="#faqAccordion"
                        >
                            <div className="accordion-body">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;
