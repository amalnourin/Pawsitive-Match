
# Pawsitive Match – Pet Adoption Management System

## Overview
Pawsitive Match is a web-based system designed to manage pet adoption efficiently.  
It allows users to view available pets, submit adoption requests, and enables admins to manage adoption data seamlessly.

---

## Tech Stack
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Frontend:** HTML, CSS, JavaScript
- **APIs:** Fetch API for async communication
- **Storage:** localStorage for session handling

---

## Features
- User login and session management
- Admin and user dashboards
- Pet listing with filters (species, age)
- Adoption requests handling
- Database CRUD operations for pets and requests

---

## Database
- SQL schema available in `schema_and_data.sql`
- Tables included:
  - `pets`
  - `users`
  - `adoption_requests`
- ER diagram included in PPT (`Pawsitive Match.pptx`)

---

## Installation & Run Locally

1. Clone the repository:
```bash
git clone https://github.com/amalnourin/Pawsitive-Match.git
cd Pawsitive-Match
````

2. Install dependencies:

```bash
npm install
```
3. Update database credentials in `server.js` if needed.

4. Run the server:

```bash
node server.js
```

5. Open the frontend in your browser:

```
public/login.html
```

---

## Folder Structure

```
ADOPT-A-PET/
├── public/                 # Frontend files (HTML, CSS, JS, images)
├── .gitignore              # Git ignore rules
├── server.js               # Node.js backend
├── package.json            # Node.js dependencies
├── package-lock.json
├── schema_and_data.sql     # Database schema and sample data
├── *.sql                   # Additional SQL scripts
├── Pawsitive Match.pptx    # ER diagram & project documentation
```

---

## Notes

* `node_modules` is excluded; run `npm install` to restore dependencies.
* Basic validation is included for login and forms.
* Project is built for Semester 3 DBMS learning purposes.

---

