import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react'; // Icons

const API_BASE_URL = 'http://localhost:8080/api/doctors';

// Custom Toast Function (re-used from PatientList.js, consider centralizing if many components use it)
const showToast = (message, type = 'success') => {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toastDiv = document.createElement('div');
    toastDiv.className = `p-4 rounded-lg shadow-lg text-white flex items-center justify-between space-x-4 transition-all duration-300 ease-out transform translate-x-full opacity-0`;

    if (type === 'success') {
        toastDiv.classList.add('bg-green-500');
    } else if (type === 'destructive') {
        toastDiv.classList.add('bg-red-500');
    } else {
        toastDiv.classList.add('bg-gray-700');
    }

    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    toastDiv.appendChild(messageSpan);

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.className = 'text-white text-xl font-bold ml-4';
    closeButton.onclick = () => toastDiv.remove();
    toastDiv.appendChild(closeButton);

    toastContainer.appendChild(toastDiv);

    // Animate in
    setTimeout(() => {
        toastDiv.classList.remove('translate-x-full', 'opacity-0');
        toastDiv.classList.add('translate-x-0', 'opacity-100');
    }, 100);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        toastDiv.classList.remove('translate-x-0', 'opacity-100');
        toastDiv.classList.add('translate-x-full', 'opacity-0');
        toastDiv.addEventListener('transitionend', () => toastDiv.remove());
    }, 5000);
};

function DoctorList() {
    const [doctors, setDoctors] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentDoctor, setCurrentDoctor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // State for form inputs
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        fetchDoctors();
    }, []);

    // Fetches all doctors from the backend
    const fetchDoctors = async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            showToast("Failed to fetch doctors.", "destructive");
        }
    };

    // Opens the form for adding a new doctor
    const handleAddDoctor = () => {
        setCurrentDoctor(null); // Clear current doctor for add mode
        resetFormFields();
        setIsFormOpen(true);
    };

    // Opens the form for editing an existing doctor
    const handleEditDoctor = (doctor) => {
        setCurrentDoctor(doctor);
        setFirstName(doctor.firstName);
        setLastName(doctor.lastName);
        setSpecialization(doctor.specialization);
        setPhoneNumber(doctor.phoneNumber);
        setEmail(doctor.email);
        setIsFormOpen(true);
    };

    // Resets all form fields
    const resetFormFields = () => {
        setFirstName('');
        setLastName('');
        setSpecialization('');
        setPhoneNumber('');
        setEmail('');
    };

    // Handles form submission (add or update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const doctorData = { firstName, lastName, specialization, phoneNumber, email };

        try {
            if (currentDoctor) {
                // Update existing doctor
                await axios.put(`${API_BASE_URL}/${currentDoctor.id}`, doctorData);
                showToast("Doctor updated successfully.", "success");
            } else {
                // Add new doctor
                await axios.post(API_BASE_URL, doctorData);
                showToast("Doctor added successfully.", "success");
            }
            setIsFormOpen(false);
            fetchDoctors(); // Refresh list
        } catch (error) {
            console.error('Error saving doctor:', error);
            showToast("Failed to save doctor. Please check your input.", "destructive");
        }
    };

    // Handles deleting a doctor
    const handleDeleteDoctor = async (id) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            try {
                await axios.delete(`${API_BASE_URL}/${id}`);
                showToast("Doctor deleted successfully.", "success");
                fetchDoctors(); // Refresh list
            } catch (error) {
                console.error('Error deleting doctor:', error);
                showToast("Failed to delete doctor.", "destructive");
            }
        }
    };

    // Filters doctors based on search term
    const filteredDoctors = doctors.filter(doctor =>
        doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doctor.specialization && doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doctor.email && doctor.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-6 bg-white rounded-xl shadow-xl border border-gray-200">
            <h2 className="text-4xl font-extrabold text-green-700 mb-8 text-center">Doctor Management</h2>

            <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search doctors by name, specialty, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-green-500 focus:border-green-500 transition-all duration-200 w-full"
                    />
                </div>
                <button onClick={handleAddDoctor} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-md transition-transform transform hover:scale-105 flex items-center space-x-2">
                    <PlusCircle size={20} />
                    <span>Add New Doctor</span>
                </button>
            </div>

            {filteredDoctors.length === 0 ? (
                <p className="text-center text-gray-600 text-lg py-10">No doctors found. {searchTerm && "Try a different search term."}</p>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDoctors.map((doctor) => (
                                <tr key={doctor.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doctor.firstName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doctor.lastName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doctor.specialization}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doctor.phoneNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doctor.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <div className="flex justify-center space-x-2">
                                            <button onClick={() => handleEditDoctor(doctor)} className="p-2 rounded-full border border-green-600 text-green-600 hover:bg-green-50 transition-colors duration-150">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDeleteDoctor(doctor.id)} className="p-2 rounded-full border border-red-600 text-red-600 hover:bg-red-50 transition-colors duration-150">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Doctor Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-auto">
                        <h3 className="text-2xl font-bold text-green-700 mb-4 text-center">
                            {currentDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                        </h3>
                        <p className="text-gray-600 text-center mb-6">
                            {currentDoctor ? 'Make changes to doctor details here.' : 'Fill in the details for a new doctor.'}
                        </p>
                        <form onSubmit={handleSubmit} className="grid gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500" required />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500" required />
                            </div>
                            <div>
                                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                                <input id="specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500" />
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500" />
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200">Cancel</button>
                                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full shadow-md transition-transform transform hover:scale-105">
                                    {currentDoctor ? 'Save Changes' : 'Add Doctor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DoctorList;