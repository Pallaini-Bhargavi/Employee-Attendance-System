# Employee Attendance Management System

## Overview

A full-stack Employee Attendance Management System supporting Employee and Manager roles. Employees can check-in/check-out, view their history, and track attendance. Managers can view all employee attendance, department statistics, team calendars, and generate reports.

---

## Features

### Employee

* Login / Register
* Daily Check-In & Check-Out
* Monthly Summary
* Recent 7-Day Attendance
* Full Attendance History (Calendar, Table, Summary)

### Manager

* Total Employees, Present/Absent overview
* Weekly Attendance Trend
* Department-wise Attendance Chart
* All Attendance Table
* Team Calendar
* Generate Reports (CSV)

---

## Project Structure

```
/project
│── backend/
│── frontend/
│── Screenshots/
│── .env
│── .env.example
│── README.md
```

---

## Tech Stack

* React (Material UI, FullCalendar, Recharts)
* Node.js / Express 
* MongoDB 
* JWT Authentication
* Redux

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone 
cd Employee-Attendance-System
```

---

## Install Dependencies

### Backend

```bash
cd backend
npm install
# or
pip install -r requirements.txt
```

### Frontend

```bash
cd frontend
npm install
```

---

## Environment Variables

Create `.env` in root:

```
PORT=
MONGO_URI=
JWT_SECRET=
REACT_APP_API_URL=

---

## Run the Project

### Backend

```
cd backend
npm run dev
# or
python manage.py runserver
```

### Frontend

```
cd frontend
npm start
```

Application runs at:

```
http://localhost:5173
```

---

## Seed Data (Sample Users)

### Manager

```
Email: manager@example.com
Password: manager123
```

### Employees

```
amit@example.com / amit123 (Tech)
john@example.com / john123 (HR)
```

### Sample Attendance

```
CheckIn: 9:30 AM
CheckOut: 6:00 PM
Status: PRESENT
```


## Screenshots
 Screenshots/Home Page

* Employee Login
* Employee Register
* Employee Dashboard
* Attendance History
* Team Calendar
* All Employees Attendance
* Manager Dashboard
