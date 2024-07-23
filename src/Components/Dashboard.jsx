import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [appliedOpportunities, setAppliedOpportunities] = useState([]);
    const [personalDetails, setPersonalDetails] = useState({
        name: '',
        age: '',
        dob: '',
        image: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        axios.get('/auth/verify')
            .then(res => {
                if (!res.data.status) {
                    navigate("/login");
                } else {
                    fetchAppliedOpportunities();
                    fetchProfileDetails();
                }
            })
            .catch(error => {
                console.error('Error verifying user:', error);
                navigate("/login");
            });
    }, [navigate]);

    const fetchAppliedOpportunities = async () => {
        try {
            const response = await axios.get('/auth/applied-opportunities');
            setAppliedOpportunities(response.data);
        } catch (error) {
            console.error('Error fetching applied opportunities:', error);
        }
    };

    const fetchProfileDetails = async () => {
        try {
            const response = await axios.get('/auth/user-details');
            const userDetails = response.data;

            if (userDetails.hasOwnProperty('name')) {
                setIsEditing(false);
                setPersonalDetails({
                    name: userDetails['name'],
                    age: userDetails['age'],
                    dob: userDetails['dob'],
                    image: userDetails['image']
                });
            } else {
                setIsEditing(true);
            }
        } catch (error) {
            console.error('Error fetching details ', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPersonalDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        setPersonalDetails(prevDetails => ({
            ...prevDetails,
            image: e.target.value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/auth/update-profile', personalDetails).then((res) => {
                setIsEditing(false);
            });
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleLogout = () => {
        axios.get("/auth/logout")
            .then((res) => {
                if (res.data.status) {
                    localStorage.clear();
                    navigate("/login");
                }
            }).catch(err => {
                console.log(err);
            });
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <button style={{zIndex:"6"}}
                className="absolute top-4 right-4 bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 transition duration-300"
                onClick={handleLogout}
            >
                Logout
            </button>
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
                    {isEditing ? (
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <label className="block">
                                <span className="text-gray-700">Name:</span>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={personalDetails.name} 
                                    onChange={handleInputChange} 
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
                                    required 
                                />
                            </label>
                            <label className="block">
                                <span className="text-gray-700">Age:</span>
                                <input 
                                    type="number" 
                                    name="age" 
                                    value={personalDetails.age} 
                                    onChange={handleInputChange} 
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
                                />
                            </label>
                            <label className="block">
                                <span className="text-gray-700">Date of Birth:</span>
                                <input 
                                    type="date" 
                                    name="dob" 
                                    value={personalDetails.dob} 
                                    onChange={handleInputChange} 
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
                                />
                            </label>
                            <label className="block">
                                <span className="text-gray-700">Image URL:</span>
                                <input 
                                    type="text" 
                                    name="image" 
                                    value={personalDetails.image} 
                                    onChange={handleImageChange} 
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
                                />
                            </label>
                            <button 
                                type="submit" 
                                className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition duration-300">
                                Save
                            </button>
                        </form>
                    ) : (
                        <div className="personal-details-view text-center">
                            {personalDetails.image && (
                                <img 
                                    src={personalDetails.image} 
                                    alt="Profile" 
                                    className="mx-auto w-32 h-32 object-cover rounded-full border border-gray-300"
                                />
                            )}
                            <h2 className="text-2xl font-semibold mt-4">{personalDetails.name}</h2>
                            <p className="text-gray-700 mt-2"><strong>Age:</strong> {personalDetails.age}</p>
                            <p className="text-gray-700 mt-2"><strong>Date of Birth:</strong> {formatDate(personalDetails.dob)}</p>
                            <button 
                                onClick={handleEdit} 
                                className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 transition duration-300"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>
                <div className="opportunities-list mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Applied Opportunities</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {appliedOpportunities.map((opportunity, index) => (
                            <div key={index} className="opportunity-card bg-white p-4 shadow-lg rounded-md">
                                <h2 className="text-xl font-semibold mb-2">{opportunity.profile_name}</h2>
                                <p><strong>Company:</strong> {opportunity.company_name}</p>
                                <p><strong>Duration:</strong> {opportunity.duration}</p>
                                <p><strong>Stipend:</strong> {opportunity.stipend}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
