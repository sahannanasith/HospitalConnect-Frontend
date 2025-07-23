import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react'; // Icons

const API_BASE_URL = 'http://localhost:8080/api/patients';

// Custom Toast Function
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


function PatientList() {
    const [patients, setPatients] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentPatient, setCurrentPatient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // State for form inputs
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        fetchPatients();
    }, []);

    // Fetches all patients from the backend
    const fetchPatients = async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
            showToast("Failed to fetch patients.", "destructive");
        }
    };

    // Opens the form for adding a new patient
    const handleAddPatient = () => {
        setCurrentPatient(null); // Clear current patient for add mode
        resetFormFields();
        setIsFormOpen(true);
    };

    // Opens the form for editing an existing patient
    const handleEditPatient = (patient) => {
        setCurrentPatient(patient);
        setFirstName(patient.firstName);
        setLastName(patient.lastName);
        setDateOfBirth(patient.dateOfBirth); // Assuming dateOfBirth is already in 'YYYY-MM-DD' format
        setGender(patient.gender);
        setPhoneNumber(patient.phoneNumber);
        setAddress(patient.address);
        setIsFormOpen(true);
    };

    // Resets all form fields
    const resetFormFields = () => {
        setFirstName('');
        setLastName('');
        setDateOfBirth('');
        setGender('');
        setPhoneNumber('');
        setAddress('');
    };

    // Handles form submission (add or update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const patientData = { firstName, lastName, dateOfBirth, gender, phoneNumber, address };

        try {
            if (currentPatient) {
                // Update existing patient
                await axios.put(`${API_BASE_URL}/${currentPatient.id}`, patientData);
                showToast("Patient updated successfully.", "success");
            } else {
                // Add new patient
                await axios.post(API_BASE_URL, patientData);
                showToast("Patient added successfully.", "success");
            }
            setIsFormOpen(false);
            fetchPatients(); // Refresh list
        } catch (error) {
            console.error('Error saving patient:', error);
            showToast("Failed to save patient. Please check your input.", "destructive");
        }
    };

    // Handles deleting a patient
    const handleDeletePatient = async (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                await axios.delete(`${API_BASE_URL}/${id}`);
                showToast("Patient deleted successfully.", "success");
                fetchPatients(); // Refresh list
            } catch (error) {
                console.error('Error deleting patient:', error);
                showToast("Failed to delete patient.", "destructive");
            }
        }
    };

    // Filters patients based on search term
    const filteredPatients = patients.filter(patient =>
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient.phoneNumber && patient.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-6 bg-white rounded-xl shadow-xl border border-gray-200">
            <h2 className="text-4xl font-extrabold text-blue-700 mb-8 text-center">Patient Management</h2>

            <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search patients by name or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full"
                    />
                </div>
                <button onClick={handleAddPatient} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-md transition-transform transform hover:scale-105 flex items-center space-x-2">
                    <PlusCircle size={20} />
                    <span>Add New Patient</span>
                </button>
            </div>

            {filteredPatients.length === 0 ? (
                <p className="text-center text-gray-600 text-lg py-10">No patients found. {searchTerm && "Try a different search term."}</p>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.firstName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.lastName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.dateOfBirth}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.gender}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.phoneNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.address}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <div className="flex justify-center space-x-2">
                                            <button onClick={() => handleEditPatient(patient)} className="p-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors duration-150">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDeletePatient(patient.id)} className="p-2 rounded-full border border-red-600 text-red-600 hover:bg-red-50 transition-colors duration-150">
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

            {/* Patient Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-auto">
                        <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">
                            {currentPatient ? 'Edit Patient' : 'Add New Patient'}
                        </h3>
                        <p className="text-gray-600 text-center mb-6">
                            {currentPatient ? 'Make changes to patient details here.' : 'Fill in the details for a new patient.'}
                        </p>
                        <form onSubmit={handleSubmit} className="grid gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" required />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" required />
                            </div>
                            <div>
                                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                <input id="dateOfBirth" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <input id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200">Cancel</button>
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow-md transition-transform transform hover:scale-105">
                                    {currentPatient ? 'Save Changes' : 'Add Patient'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PatientList;
