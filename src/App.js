import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PatientList from './components/PatientList';
import DoctorList from './components/DoctorList';
import AppointmentList from './components/AppointmentList';

// Main App component
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navigation Bar */}
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 shadow-lg rounded-b-lg">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-white text-3xl font-bold tracking-wide">
              HospitalConnect
            </Link>
            <div className="space-x-4">
              <Link to="/patients" className="text-white hover:bg-blue-700 transition-colors duration-200 text-lg px-6 py-3 rounded-full shadow-md inline-block">
                Patients
              </Link>
              <Link to="/doctors" className="text-white hover:bg-blue-700 transition-colors duration-200 text-lg px-6 py-3 rounded-full shadow-md inline-block">
                Doctors
              </Link>
              <Link to="/appointments" className="text-white hover:bg-blue-700 transition-colors duration-200 text-lg px-6 py-3 rounded-full shadow-md inline-block">
                Appointments
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow container mx-auto p-6 mt-8">
          <Routes>
            <Route path="/" element={
              <div className="text-center py-20 bg-white rounded-xl shadow-xl border border-gray-200">
                <h1 className="text-5xl font-extrabold text-blue-800 mb-6 animate-fade-in-down">
                  Welcome to HospitalConnect
                </h1>
                <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto animate-fade-in-up">
                  Your comprehensive solution for managing hospital operations efficiently.
                  Navigate through patients, doctors, and appointments using the links above.
                </p>
                <div className="flex justify-center space-x-6">
                  <Link to="/patients" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-full shadow-lg transition-transform transform hover:scale-105 inline-block">
                    Manage Patients
                  </Link>
                  <Link to="/doctors" className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-full shadow-lg transition-transform transform hover:scale-105 inline-block">
                    Manage Doctors
                  </Link>
                  <Link to="/appointments" className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-4 rounded-full shadow-lg transition-transform transform hover:scale-105 inline-block">
                    Manage Appointments
                  </Link>
                </div>
              </div>
            } />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/doctors" element={<DoctorList />} />
            <Route path="/appointments" element={<AppointmentList />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white text-center p-4 mt-10 rounded-t-lg shadow-inner">
          <p>&copy; {new Date().getFullYear()} HospitalConnect. All rights reserved.</p>
          <p className="text-sm mt-1">Designed with <span className="text-red-500">&hearts;</span> for efficient healthcare management.</p>
        </footer>
      </div>
      {/* Custom Toast Container */}
      <div id="toast-container" className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2"></div>
    </Router>
  );
}

export default App;