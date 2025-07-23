import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react'; // Icons

const API_BASE_URL = 'http://localhost:8080/api/appointments';
const PATIENT_API_URL = 'http://localhost:8080/api/patients';
const DOCTOR_API_URL = 'http://localhost:8080/api/doctors';

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

function AppointmentList() {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentAppointment, setCurrentAppointment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // State for form inputs
    const [patientId, setPatientId] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [appointmentTime, setAppointmentTime] = useState(''); // YYYY-MM-DDTHH:MM format
    const [reason, setReason] = useState('');
    const [status, setStatus] = useState('Scheduled');

    useEffect(() => {
        fetchAppointments();
        fetchPatientsAndDoctors();
    }, []);

    // Fetches all appointments from the backend
    const fetchAppointments = async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            showToast("Failed to fetch appointments.", "destructive");
        }
    };

    // Fetches patients and doctors for dropdowns
    const fetchPatientsAndDoctors = async () => {
        try {
            const [patientsRes, doctorsRes] = await Promise.all([
                axios.get(PATIENT_API_URL),
                axios.get(DOCTOR_API_URL)
            ]);
            setPatients(patientsRes.data);
            setDoctors(doctorsRes.data);
        } catch (error) {
            console.error('Error fetching patients or doctors:', error);
            showToast("Failed to load patient and doctor data.", "destructive");
        }
    };

    // Opens the form for adding a new appointment
    const handleAddAppointment = () => {
        setCurrentAppointment(null); // Clear current appointment for add mode
        resetFormFields();
        setIsFormOpen(true);
    };

    // Opens the form for editing an existing appointment
    const handleEditAppointment = (appointment) => {
        setCurrentAppointment(appointment);
        setPatientId(appointment.patient.id);
        setDoctorId(appointment.doctor.id);
        // Format LocalDateTime to YYYY-MM-DDTHH:MM for input type="datetime-local"
        const formattedTime = new Date(appointment.appointmentTime).toISOString().slice(0, 16);
        setAppointmentTime(formattedTime);
        setReason(appointment.reason);
        setStatus(appointment.status);
        setIsFormOpen(true);
    };

    // Resets all form fields
    const resetFormFields = () => {
        setPatientId('');
        setDoctorId('');
        setAppointmentTime('');
        setReason('');
        setStatus('Scheduled');
    };

    // Handles form submission (add or update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const appointmentData = {
            patient: { id: patientId },
            doctor: { id: doctorId },
            appointmentTime: appointmentTime + ':00', // Add seconds for LocalDateTime
            reason,
            status
        };

        try {
            if (currentAppointment) {
                // Update existing appointment
                await axios.put(`${API_BASE_URL}/${currentAppointment.id}`, appointmentData);
                showToast("Appointment updated successfully.", "success");
            } else {
                // Add new appointment
                await axios.post(API_BASE_URL, appointmentData);
                showToast("Appointment added successfully.", "success");
            }
            setIsFormOpen(false);
            fetchAppointments(); // Refresh list
        } catch (error) {
            console.error('Error saving appointment:', error);
            showToast("Failed to save appointment. Please check your input and ensure Patient/Doctor IDs are valid.", "destructive");
        }
    };

    // Handles deleting an appointment
    const handleDeleteAppointment = async (id) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            try {
                await axios.delete(`${API_BASE_URL}/${id}`);
                showToast("Appointment deleted successfully.", "success");
                fetchAppointments(); // Refresh list
            } catch (error) {
                console.error('Error deleting appointment:', error);
                showToast("Failed to delete appointment.", "destructive");
            }
        }
    };

    // Helper to format date-time for display
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '';
        const options = {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        };
        return new Date(dateTimeString).toLocaleString('en-US', options);
    };

    // Filters appointments based on search term (patient name, doctor name, reason)
    const filteredAppointments = appointments.filter(appointment =>
        (appointment.patient && appointment.patient.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (appointment.patient && appointment.patient.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (appointment.doctor && appointment.doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (appointment.doctor && appointment.doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (appointment.reason && appointment.reason.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-6 bg-white rounded-xl shadow-xl border border-gray-200">
            <h2 className="text-4xl font-extrabold text-purple-700 mb-8 text-center">Appointment Management</h2>

            <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search appointments by patient, doctor, or reason..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 w-full"
                    />
                </div>
                <button onClick={handleAddAppointment} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full shadow-md transition-transform transform hover:scale-105 flex items-center space-x-2">
                    <PlusCircle size={20} />
                    <span>Add New Appointment</span>
                </button>
            </div>

            {filteredAppointments.length === 0 ? (
                <p className="text-center text-gray-600 text-lg py-10">No appointments found. {searchTerm && "Try a different search term."}</p>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAppointments.map((appointment) => (
                                <tr key={appointment.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {appointment.patient?.firstName} {appointment.patient?.lastName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {appointment.doctor?.firstName} {appointment.doctor?.lastName} ({appointment.doctor?.specialization})
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {formatDateTime(appointment.appointmentTime)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{appointment.reason}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            appointment.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                                            appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {appointment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <div className="flex justify-center space-x-2">
                                            <button onClick={() => handleEditAppointment(appointment)} className="p-2 rounded-full border border-purple-600 text-purple-600 hover:bg-purple-50 transition-colors duration-150">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDeleteAppointment(appointment.id)} className="p-2 rounded-full border border-red-600 text-red-600 hover:bg-red-50 transition-colors duration-150">
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

            {/* Appointment Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-auto">
                        <h3 className="text-2xl font-bold text-purple-700 mb-4 text-center">
                            {currentAppointment ? 'Edit Appointment' : 'Add New Appointment'}
                        </h3>
                        <p className="text-gray-600 text-center mb-6">
                            {currentAppointment ? 'Make changes to appointment details here.' : 'Fill in the details for a new appointment.'}
                        </p>
                        <form onSubmit={handleSubmit} className="grid gap-4">
                            <div>
                                <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                                <select id="patient" value={patientId} onChange={(e) => setPatientId(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500" required>
                                    <option value="">Select a patient</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.firstName} {p.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                                <select id="doctor" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500" required>
                                    <option value="">Select a doctor</option>
                                    {doctors.map(d => (
                                        <option key={d.id} value={d.id}>
                                            {d.firstName} {d.lastName} ({d.specialization})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-1">Appointment Time</label>
                                <input id="appointmentTime" type="datetime-local" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500" required />
                            </div>
                            <div>
                                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                <input id="reason" value={reason} onChange={(e) => setReason(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500" />
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500" required>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200">Cancel</button>
                                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full shadow-md transition-transform transform hover:scale-105">
                                    {currentAppointment ? 'Save Changes' : 'Add Appointment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AppointmentList;