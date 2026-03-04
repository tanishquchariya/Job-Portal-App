# 🚀 TU Job Portal

A full-stack **MERN Job Portal Application** designed to connect **job seekers** with **recruiters** efficiently.
Users can explore job opportunities, create professional profiles, upload resumes and apply for jobs, while Recruiters can post job openings, manage companies, and review applicants.

---

## 🌐 Live Demo

🔗 Live Website: https://tu-job-portal.onrender.com

---

## 📸 Screenshots
* Home Page
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/e9a2e851-1a24-4747-a373-1d4f58313efe" />

* Jobs Page
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/adeec49b-bdfd-49cf-b45f-574bc7bc44b8" />



---

## ✨ Features

### 👨‍💼 Job Seeker

* User authentication (Signup / Login)
* Update profile and upload resume
* Browse available job listings
* Apply for jobs
* Save jobs for later

### 🏢 Recruiter / Admin

* Create and manage companies
* Post new job openings
* View job applicants
* Manage job listings

---

## 🛠 Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Redux Toolkit
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

### Other Tools

* Cloudinary (File uploads)
* Render (Deployment)
* GitHub (Version Control)

---

## 📂 Project Structure

```
TU-Job-Portal
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   └── utils
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── hooks
│   │   ├── redux
│   │   └── pages
│
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### Clone the repository

```bash
git clone https://github.com/yourusername/TU-Job-Portal.git
cd TU-Job-Portal
```

### Install dependencies

Backend

```bash
npm install
```

Frontend

```bash
cd frontend
npm install
```

---

### Run the application

Build frontend and start the full application:

```bash
npm run build
npm start
```
---

## 🔐 Environment Variables

Create a `.env` file in the backend folder and add:

```
PORT=8000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🚀 Deployment

This project can be deployed on:

* Render
* Railway
* AWS
* Vercel (Frontend)

Current deployment: Render

---

## 👨‍💻 Author

**Tanishq Uchariya**
Computer Science Engineer

GitHub: https://github.com/tanishquchariya

---

⭐ If you like this project, please consider giving it a **star**!
