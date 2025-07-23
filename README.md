# HospitalConnect - Hospital Management System Frontend 🏥

This repository contains the frontend application for HospitalConnect, a modern and intuitive Hospital Management System. Built with React and styled with Tailwind CSS, it provides a user-friendly interface for managing patients, doctors, and appointments by interacting with the Spring Boot backend.

## ✨ Features

* Responsive Design: Optimized for various screen sizes, from mobile to desktop.

* Patient Management: View, add, edit, and delete patient records with ease.

* Doctor Management: Manage doctor profiles including specialization and contact details.

* Appointment Scheduling: Create, update, and cancel appointments, linking patients and doctors.

* Intuitive Interface: Clean and modern UI for a smooth user experience.

* API Integration: Seamless communication with the Spring Boot backend.

* Custom Toast Notifications: Provides user feedback for actions.

## 🛠️ Technologies Used

* React: A JavaScript library for building user interfaces.

* Tailwind CSS: A utility-first CSS framework for rapid UI development.

* Axios: Promise-based HTTP client for making API requests.

* React Router DOM: For declarative routing in the application.

## ✅ Prerequisites

Before you begin, ensure you have the following installed on your system:

* Node.js: Version 14 or higher.

* npm (Node Package Manager) or Yarn: For managing project dependencies.

* HospitalConnect Backend: Ensure the Spring Boot backend is running and accessible (default: http://localhost:8080).

## 🚀 Setup & Installation

Follow these steps to get the HospitalConnect frontend up and running on your local machine.

1. Clone the Repository:

```bash
git clone https://github.com/sahannanasith/HospitalConnect-Frontend.git
cd hospital-frontend
```

2. Install Dependencies:

```bash
npm install
# or yarn install
```

3. Configure Tailwind CSS:

* Initialize Tailwind CSS (if not already done):

```bash
npx tailwindcss init -p
```

* Open tailwind.config.js (at the root of your project) and ensure its content array includes paths to your React components:

```bash
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

* Open src/index.css and add the Tailwind directives at the top:

```bash
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: "Inter", sans-serif;
}
```

4. Start the Application:

```bash
npm start
# or yarn start
```

The application will open in your browser, usually at http://localhost:3000.

## 📸 Screenshots

Here are some glimpses of the HospitalConnect frontend in action:

### Welcome Page
The landing page provides a quick overview and navigation options.

![Welcome Page](https://github.com/sahannanasith/HospitalConnect-Frontend/blob/main/Welcome%20Page.PNG)

### Patient Management
Easily view, add, edit, and delete patient records.

![Welcome Page](https://github.com/sahannanasith/HospitalConnect-Frontend/blob/main/Patient%20Management.PNG)

### Doctor Management
Manage doctor profiles and their specializations.

![Welcome Page](https://github.com/sahannanasith/HospitalConnect-Frontend/blob/main/Doctor%20Management.PNG)

### Appointment Management
Schedule and track appointments with linked patient and doctor details.

![Welcome Page](https://github.com/sahannanasith/HospitalConnect-Frontend/blob/main/Appointment%20Management.PNG)

## 🤝 Contributing

Contributions are always welcome! If you have ideas for new features, improvements, or bug fixes, please feel free to:

1. Fork the repository.

2. Create a new branch (git checkout -b feature/your-feature-name).

3. Make your changes.

4. Commit your changes (git commit -m 'Implement new feature X').

5. Push to the branch (git push origin feature/your-feature-name).

6. Open a Pull Request.

## 📄 License

This project is open-source and available under the MIT License.

















