# Rich English Teacher Portal

A modern, user-friendly teacher portal for managing Korean and Chinese students' English classes. Built with Node.js, React, and MySQL.

## Features

- **Student Management**: Add, edit, and manage Korean Manager (KM) and Chinese Manager (CM) students
- **Class Scheduling**: Create and manage class schedules with time slots and platforms (Zoom/Voov)
- **Attendance Tracking**: Record student attendance with quick actions and detailed notes
- **Makeup Classes**: Schedule and track makeup classes for absent students
- **Dashboard**: Overview of key metrics and recent activities
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React + Vite
- **Database**: MySQL
- **UI**: Tailwind CSS + Headless UI
- **Authentication**: JWT tokens
- **Icons**: Heroicons

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd richenglish
   npm run install-all
   ```

2. **Set up MySQL database**:
   ```bash
   # Create database
   mysql -u root -p
   CREATE DATABASE rich_english_portal;
   
   # Import schema
   mysql -u root -p rich_english_portal < server/database/schema.sql
   ```

3. **Configure environment**:
   ```bash
   cd server
   cp env.example .env
   # Edit .env with your database credentials
   ```

4. **Start the application**:
   ```bash
   # From root directory
   npm run dev
   ```

5. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Demo Login

- **Email**: teacher.mitch@richenglish.com
- **Password**: password

## Project Structure

```
richenglish/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── database/
│   │   └── schema.sql     # MySQL schema
│   ├── index.js           # Express server
│   └── package.json
└── package.json           # Root package.json
```

## Key Features Explained

### Student Management
- Track Korean and Chinese students separately (KM/CM)
- Store student information including books, levels, and contact details
- Filter students by manager type and nationality

### Class Scheduling
- Create class schedules with specific time slots
- Support for different platforms (Zoom, Voov)
- Track class duration and days of the week
- Manage class status (active, completed, cancelled)

### Attendance Tracking
- Quick attendance recording with present/absent buttons
- Detailed attendance notes and minutes attended
- Date-based attendance views
- Support for makeup and substitute classes

### Makeup Classes
- Schedule makeup classes for absent students
- Track makeup class status (scheduled, completed, cancelled)
- Record reasons for makeup classes
- Manage makeup class notes and details

## API Endpoints

### Authentication
- `POST /api/auth/login` - Teacher login

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Classes
- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create new class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Record attendance

### Makeup Classes
- `GET /api/makeup-classes` - Get makeup classes
- `POST /api/makeup-classes` - Schedule makeup class
- `PUT /api/makeup-classes/:id` - Update makeup class
- `DELETE /api/makeup-classes/:id` - Delete makeup class

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Development

### Running in Development Mode

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run server  # Backend only
npm run client  # Frontend only
```

### Building for Production

```bash
npm run build
npm start
```

## Database Schema

The application uses MySQL with the following main tables:

- **teachers**: Teacher accounts and authentication
- **students**: Student information and details
- **classes**: Class schedules and timetables
- **attendance**: Attendance records and notes
- **makeup_classes**: Makeup class scheduling
- **substitute_classes**: Substitute teacher management

## Customization

### Adding New Features

1. **Backend**: Add new routes in `server/index.js`
2. **Frontend**: Create new components in `client/src/components/`
3. **Database**: Update schema in `server/database/schema.sql`

### Styling

The application uses Tailwind CSS for styling. Custom styles can be added in:
- `client/src/index.css` - Global styles
- `client/tailwind.config.js` - Tailwind configuration

## Support

For questions or issues, please refer to the code comments or create an issue in the project repository.

## License

MIT License - feel free to use and modify as needed.


