import React, { useEffect, useState } from 'react';
import axios from 'axios';
import opportunitiesData from '../opportunities.json';
import { useNavigate } from 'react-router-dom';

const OpportunityCard = ({ opportunity, appliedOpportunities }) => {
    const navigate = useNavigate();
    const {
        id,
        profile_name,
        company_name,
        stipend,
        locations,
        duration,
        start_date,
    } = opportunity;

    const isApplied = Array.isArray(appliedOpportunities) && appliedOpportunities.some(appliedOpportunity => appliedOpportunity.id === id);

    const applyForOpportunity = async (opportunity) => {
        try {
            await axios.post('/auth/apply', { opportunity });
            navigate("/dashboard");
        } catch (error) {
            console.error('Error applying for opportunity:', error);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 m-4 max-w-sm">
            <h2 className="text-xl font-semibold mb-2">{profile_name}</h2>
            <p className="text-gray-700 mb-1"><strong>Company:</strong> {company_name}</p>
            <p className="text-gray-700 mb-1"><strong>Stipend:</strong> {stipend.salary}</p>
            <p className="text-gray-700 mb-1"><strong>Location:</strong> {locations.map(location => location.string).join(', ')}</p>
            <p className="text-gray-700 mb-1"><strong>Duration:</strong> {duration}</p>
            <p className="text-gray-700 mb-4"><strong>Start Date:</strong> {start_date}</p>
            {isApplied ? (
                <button className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed hover:bg-gray-500" disabled>Applied</button>
            ) : (
                <button 
                    className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-800 transition duration-300"
                    onClick={() => applyForOpportunity(opportunity)}
                >
                    Apply Now
                </button>
            )}
        </div>
    );
};

const OpportunitiesComponent = () => {
    const [appliedOpportunities, setAppliedOpportunities] = useState([]);

    useEffect(() => {
        fetchAppliedOpportunities();
    }, []);

    const fetchAppliedOpportunities = async () => {
        try {
            const response = await axios.get('/auth/applied-opportunities');
            setAppliedOpportunities(response.data);
        } catch (error) {
            console.error('Error fetching applied opportunities:', error);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">Internship Opportunities</h1>
            <div className="flex flex-wrap justify-center">
                {Object.values(opportunitiesData.internships_meta).map(opportunity => (
                    <OpportunityCard key={opportunity.id} opportunity={opportunity} appliedOpportunities={appliedOpportunities} />
                ))}
            </div>
        </div>
    );
};

export default OpportunitiesComponent;
