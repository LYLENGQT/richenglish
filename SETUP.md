# Rich English Teacher Portal - Setup Instructions

## Quick Setup Guide

### 1. Install Dependencies
```bash
# From the project root directory
npm run install-all
```

### 2. Set Up MySQL Database

#### Option A: Using MySQL Command Line
```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE rich_english_portal;

# Exit MySQL
exit

# Import schema
mysql -u root -p rich_english_portal < server/database/schema.sql
```

#### Option B: Using MySQL Workbench or phpMyAdmin
1. Create a new database named `rich_english_portal`
2. Import the file `server/database/schema.sql`

### 3. Configure Environment Variables
```bash
cd server
cp env.example .env
```

Edit the `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=rich_english_portal
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

### 4. Start the Application
```bash
# From the project root directory
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:3000

### 5. Access the Application
1. Open your browser and go to http://localhost:3000
2. Login with the demo credentials:
   - **Email**: teacher.mitch@richenglish.com
   - **Password**: password

## Troubleshooting

### Common Issues

#### 1. Database Connection Error
- Make sure MySQL is running
- Check your database credentials in `.env`
- Ensure the database `rich_english_portal` exists

#### 2. Port Already in Use
- Change the PORT in `.env` file
- Or kill the process using the port:
  ```bash
  # For Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID_NUMBER> /F
  
  # For Mac/Linux
  lsof -ti:5000 | xargs kill -9
  ```

#### 3. Node Modules Issues
- Delete `node_modules` folders and reinstall:
  ```bash
  rm -rf node_modules server/node_modules client/node_modules
  npm run install-all
  ```

#### 4. MySQL Import Issues
- Make sure the schema.sql file path is correct
- Check MySQL user permissions
- Try importing manually through MySQL Workbench

### Development Commands

```bash
# Install all dependencies
npm run install-all

# Start both frontend and backend
npm run dev

# Start only backend
npm run server

# Start only frontend
npm run client

# Build for production
npm run build

# Start production server
npm start
```

### File Structure
```
richenglish/
├── client/                 # React frontend
│   ├── src/components/     # UI components
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── database/schema.sql # Database setup
│   ├── index.js           # Server code
│   └── package.json
└── package.json           # Root package
```

### Features Overview
- **Dashboard**: Overview of students, classes, and attendance
- **Students**: Manage Korean (KM) and Chinese (CM) students
- **Classes**: Schedule and manage class timetables
- **Attendance**: Track student attendance and notes
- **Makeup Classes**: Schedule makeup sessions for absent students

### Sample Data
The database comes pre-populated with sample students from your CSV file, including:
- Korean students (KM) with various age groups
- Chinese students (CM) 
- Class schedules and time slots
- Sample attendance records

### Next Steps
1. Explore the dashboard to see your data
2. Add new students or edit existing ones
3. Schedule classes for your students
4. Record attendance for today's classes
5. Schedule makeup classes as needed

For any issues, check the browser console and server logs for error messages.


