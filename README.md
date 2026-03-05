# 6-Axis Robotic Arm Control System

## Executive Summary

The 6-Axis Robotic Arm Control System is an enterprise-grade web application designed for real-time control, monitoring, and visualization of industrial robotic manipulators. The platform provides comprehensive motion planning, inverse kinematics computation, real-time data logging, and advanced analytics capabilities through an intuitive web interface with 3D visualization.

## Table of Contents

1. [System Overview](#system-overview)
2. [Core Features](#core-features)
3. [System Architecture](#system-architecture)
4. [Technology Stack](#technology-stack)
5. [Prerequisites](#prerequisites)
6. [Installation](#installation)
7. [Configuration](#configuration)
8. [API Documentation](#api-documentation)
9. [Project Structure](#project-structure)
10. [Development](#development)
11. [Deployment](#deployment)
12. [Security Considerations](#security-considerations)
13. [Troubleshooting](#troubleshooting)
14. [Maintenance](#maintenance)
15. [License](#license)

## System Overview

This platform integrates advanced robotics control algorithms with modern web technologies to deliver a comprehensive solution for managing 6-axis robotic arms. The system enables operators to control robot movements, monitor performance metrics in real-time, generate detailed reports, and visualize robot configurations through an interactive 3D interface.

### Key Use Cases

- Industrial automation control and monitoring
- Robot motion planning and trajectory optimization
- Real-time performance analytics and logging
- Remote robot operation and supervision
- Predictive maintenance through data analysis
- Educational and training applications

## Core Features

### Motion Control

- **Inverse Kinematics Engine**: Real-time calculation of joint angles from desired end-effector positions
- **Motion Profile Generation**: Support for multiple trajectory profiles including:
  - Default linear profiles
  - Triangular velocity profiles
  - Trapezoidal acceleration profiles
  - S-curve (jerk-limited) profiles
- **Collision Detection**: Built-in algorithms to prevent unsafe robot movements
- **Real-time UDP Communication**: Low-latency data transmission to microcontroller hardware

### Monitoring & Analytics

- **Real-time Data Logging**: Comprehensive logging of robot operations, system events, and performance metrics
- **System Event Tracking**: Automatic capture and categorization of system-level events
- **Hardware/Software Feedback**: Separate channels for hardware and software feedback data
- **Performance Analytics**: Advanced analytics engine for operational insights
- **Data Visualization**: Interactive charts and graphs for trend analysis

### Communication Systems

- **WebSocket Support**: Real-time bidirectional communication with connected clients
- **Serial Communication**: Direct integration with STM32 and other microcontroller platforms
- **UDP Protocol**: High-speed data transmission for motion commands
- **REST API**: Comprehensive RESTful interface for all system operations

### User Management

- **Role-Based Access Control**: Secure authentication and authorization system
- **User Administration**: Administrative tools for user management
- **Session Management**: Secure session handling with configurable timeout policies

### Reporting

- **PDF Report Generation**: Automated generation of operational reports
- **CSV Data Export**: Bulk data export capabilities for external analysis
- **Custom Report Templates**: Configurable report formats and content

### 3D Visualization

- **Interactive Robot Model**: Real-time 3D visualization using React Three Fiber
- **Joint Manipulation**: Direct manipulation of robot joints through the UI
- **Workspace Visualization**: Visual representation of robot reach and constraints
- **Camera Controls**: Multiple viewing angles and zoom capabilities

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Web UI     │  │  3D Viewer   │  │  Dashboard   │      │
│  │  (React)     │  │ (Three.js)   │  │  (Charts)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/WebSocket
┌─────────────────────┴───────────────────────────────────────┐
│                    Application Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Motion     │  │  Monitoring  │  │     User     │      │
│  │   Control    │  │   Analytics  │  │  Management  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │Communication │  │   Reports    │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────────┐
│                     Data Layer                               │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │   SQLite     │  │   MongoDB    │                         │
│  │  (Primary)   │  │  (Optional)  │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────────┐
│                    Hardware Layer                            │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │ Serial Port  │  │  UDP Socket  │                         │
│  │  (STM32)     │  │(Microcontrol)│                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

### Communication Flow

1. **User Interface Layer**: React-based frontend with Three.js for 3D rendering
2. **API Layer**: Django REST Framework endpoints for business logic
3. **Real-time Layer**: Django Channels with WebSocket for live updates
4. **Hardware Interface**: Serial and UDP protocols for microcontroller communication
5. **Data Persistence**: SQLite for primary storage, MongoDB for optional analytics

## Technology Stack

### Backend Technologies

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | Django | 5.1.7 | Web application framework |
| API | Django REST Framework | 3.14+ | RESTful API development |
| ASGI Server | Daphne | 4.0+ | WebSocket and HTTP server |
| WebSocket | Django Channels | 4.0+ | Real-time communication |
| Database | SQLite | 3.x | Primary data storage |
| Database (Optional) | MongoDB | 4.x+ | Analytics data storage |
| Web Server | Gunicorn | 21.0+ | WSGI HTTP server |
| Numerical Computing | NumPy | 1.20+ | Mathematical operations |

### Frontend Technologies

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | React | 19.0 | UI component library |
| Build Tool | Vite | 6.2 | Frontend build system |
| 3D Rendering | Three.js | 0.169 | 3D graphics library |
| 3D Framework | React Three Fiber | 9.1 | React renderer for Three.js |
| 3D Utilities | Drei | 10.0 | Three.js helpers |
| HTTP Client | Axios | 1.8 | API communication |
| Routing | React Router | 7.4 | Client-side routing |
| Charts | Recharts | 2.15 | Data visualization |
| Styling | Tailwind CSS | 4.1 | Utility-first CSS |
| Icons | Lucide React | 0.525 | Icon library |

### Infrastructure

- **Deployment Platform**: Render.com (configured for cloud deployment)
- **Static File Serving**: WhiteNoise
- **Environment Management**: python-decouple
- **CORS Handling**: django-cors-headers

## Prerequisites

### System Requirements

- **Operating System**: Windows 10/11, Linux (Ubuntu 20.04+), or macOS 11+
- **Python**: 3.9 or higher
- **Node.js**: 18.0 or higher
- **npm**: 8.0 or higher
- **RAM**: Minimum 4GB, recommended 8GB
- **Storage**: Minimum 2GB free space

### Hardware Requirements (Optional)

- Serial port (COM/USB) for STM32 communication
- Network interface for UDP communication
- 6-axis robotic arm hardware (for physical deployment)

### Development Tools

- Git version control
- Code editor (VS Code recommended)
- Python virtual environment tool
- Terminal/Command prompt access

## Installation

### Backend Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd clo
   ```

2. **Create Virtual Environment**
   ```bash
   # Windows
   python -m venv env
   .\env\Scripts\activate

   # Linux/macOS
   python3 -m venv env
   source env/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Database Migration**
   ```bash
   python manage.py migrate
   ```

5. **Create Superuser**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start Development Server**
   ```bash
   # For HTTP-only development
   python manage.py runserver

   # For WebSocket support
   daphne -b 127.0.0.1 -p 8000 robotics.asgi:application
   ```

### Frontend Setup

1. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin

## Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Django Configuration
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,.onrender.com

# Database Configuration (Optional MongoDB)
MONGO_DB_USERNAME=your-mongodb-username
MONGO_DB_PASSWORD=your-mongodb-password

# Authentication
LOG_USERNAME=admin_logs
LOG_PASSWORD=your-secure-password

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend-domain.com
```

### Frontend Configuration

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

### Serial Port Configuration

Update the serial port settings in `backend/communication/consumers.py`:

```python
# Windows
self.port_name = "COM4"

# Linux
self.port_name = "/dev/ttyUSB0"

# Baudrate
baudrate=115200
```

### UDP Configuration

Update UDP settings in `backend/motion_control/views.py`:

```python
UDP_HOST = "127.0.0.1"
UDP_PORT = 12345
```

## API Documentation

### Authentication Endpoints

#### Login
```http
POST /api/auth/login/
Content-Type: application/json

{
  "username": "user",
  "password": "password"
}
```

### Motion Control Endpoints

#### Inverse Kinematics
```http
POST /api/motion/ik/
Content-Type: application/json

{
  "x": 300.0,
  "y": 0.0,
  "z": 400.0,
  "rx": 0.0,
  "ry": 0.0,
  "rz": 0.0
}
```

#### Motion Profiles
```http
GET /api/motion/profile/{profile_name}/?total_time=4&steps=20&max_vel=40&max_accel=10
```

Supported profiles:
- `default`: Linear velocity profile
- `triangular`: Triangular velocity profile
- `trapezoidal`: Trapezoidal acceleration profile
- `s_curve`: S-curve (jerk-limited) profile

### Monitoring Endpoints

#### Robot Logs
```http
GET /api/monitoring/logs/
```

#### System Events
```http
GET /api/monitoring/events/
```

#### Hardware Feedback
```http
GET /api/monitoring/feedback/hardware/
```

#### Software Feedback
```http
GET /api/monitoring/feedback/software/
```

### WebSocket Endpoints

#### Robot Control WebSocket
```javascript
ws://localhost:8000/ws/robot/
```

Send messages:
```json
{
  "type": "command",
  "data": {
    "joint": 1,
    "angle": 45.0
  }
}
```

## Project Structure

```
6-axis/
├── backend/
│   ├── communication/          # WebSocket and serial communication
│   │   ├── consumers.py        # WebSocket consumers
│   │   ├── routing.py          # WebSocket routing
│   │   └── ...
│   ├── monitoring/             # Data logging and analytics
│   │   ├── models.py           # Database models
│   │   ├── views.py            # API views
│   │   ├── analytics.py        # Analytics engine
│   │   └── ...
│   ├── motion_control/         # Motion planning and kinematics
│   │   ├── views.py            # Motion control API
│   │   ├── collision_detection.py
│   │   ├── motion_planner.py
│   │   └── ...
│   ├── reports/                # Report generation
│   │   ├── pdf_generator.py
│   │   ├── csv_export.py
│   │   └── ...
│   ├── user_management/        # Authentication and authorization
│   │   ├── models.py
│   │   ├── views.py
│   │   └── ...
│   ├── udp_communication/      # UDP protocol implementation
│   │   ├── udp_receiver.py
│   │   └── README.md
│   ├── robotics/               # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── r3f/                # React Three Fiber components
│   │   ├── context/            # React context providers
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Utility functions
│   │   ├── App.jsx             # Main application component
│   │   ├── Routes.jsx          # Route definitions
│   │   └── main.jsx            # Application entry point
│   ├── public/                 # Static assets
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── env/                        # Python virtual environment
├── render.yaml                 # Render.com deployment config
└── README.md
```

## Development

### Running Tests

#### Backend Tests
```bash
cd backend
python manage.py test
```

#### Frontend Tests
```bash
cd frontend
npm run lint
```

### Code Style Guidelines

#### Python (Backend)
- Follow PEP 8 style guide
- Use type hints where applicable
- Document all public functions and classes
- Maximum line length: 120 characters

#### JavaScript/React (Frontend)
- Follow ESLint configuration
- Use functional components with hooks
- Implement proper prop validation
- Use meaningful variable and function names

### Database Management

#### Create Migration
```bash
python manage.py makemigrations
```

#### Apply Migration
```bash
python manage.py migrate
```

#### Database Shell
```bash
python manage.py dbshell
```

### Adding New Features

1. Create feature branch from main
2. Implement changes with appropriate tests
3. Update documentation
4. Submit pull request with detailed description
5. Address code review feedback

## Deployment

### Production Deployment (Render.com)

The application includes a `render.yaml` configuration for automated deployment:

1. **Push to Repository**
   ```bash
   git push origin main
   ```

2. **Render.com Auto-Deploy**
   - Backend: Automatically deploys using Daphne ASGI server
   - Frontend: Builds and deploys static site

3. **Environment Configuration**
   - Set production environment variables in Render dashboard
   - Configure custom domain (optional)
   - Enable automatic deployments

### Manual Production Deployment

#### Backend
```bash
# Collect static files
python manage.py collectstatic --noinput

# Start production server
daphne -b 0.0.0.0 -p 8000 robotics.asgi:application
```

#### Frontend
```bash
# Build production bundle
npm run build

# Serve with static server
npm run preview
```

### Database Backup

```bash
# SQLite backup
python manage.py dumpdata > backup.json

# Restore
python manage.py loaddata backup.json
```

## Security Considerations

### Authentication & Authorization

- Implement JWT tokens for API authentication
- Use HTTPS in production environments
- Configure CORS policies appropriately
- Implement rate limiting on API endpoints
- Regular security audits of dependencies

### Data Protection

- Encrypt sensitive data at rest
- Use environment variables for credentials
- Implement database backup strategies
- Regular security updates and patches
- Audit logging for critical operations

### Production Security Checklist

- [ ] Set `DEBUG=False` in production
- [ ] Use strong `SECRET_KEY`
- [ ] Configure proper `ALLOWED_HOSTS`
- [ ] Enable HTTPS/SSL certificates
- [ ] Implement CSRF protection
- [ ] Configure secure session cookies
- [ ] Set up firewall rules
- [ ] Regular dependency updates
- [ ] Implement monitoring and alerting

## Troubleshooting

### Common Issues

#### Backend Won't Start

**Issue**: Django server fails to start
```
Solution:
1. Check virtual environment activation
2. Verify all dependencies installed: pip install -r requirements.txt
3. Check for port conflicts: netstat -an | findstr :8000
4. Review error logs in console output
```

#### Frontend Build Errors

**Issue**: Vite build fails
```
Solution:
1. Delete node_modules: rm -rf node_modules
2. Clear npm cache: npm cache clean --force
3. Reinstall: npm install
4. Check Node.js version compatibility
```

#### Serial Port Connection Issues

**Issue**: Cannot connect to STM32
```
Solution:
1. Verify correct COM port in consumers.py
2. Check device drivers installed
3. Ensure port not in use by other applications
4. Verify baud rate settings (115200)
5. Check physical cable connection
```

#### WebSocket Connection Failed

**Issue**: Real-time updates not working
```
Solution:
1. Verify Daphne server running (not runserver)
2. Check WebSocket URL configuration
3. Verify CORS settings for WebSocket
4. Check browser console for connection errors
5. Ensure firewall allows WebSocket connections
```

#### Database Migration Errors

**Issue**: Migration conflicts
```
Solution:
1. Delete migration files (keep __init__.py)
2. Remove db.sqlite3
3. Run: python manage.py makemigrations
4. Run: python manage.py migrate
```

### Logging

Enable detailed logging in `settings.py`:

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'debug.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
```

### Performance Optimization

- Enable database query optimization
- Implement caching strategies (Redis)
- Optimize WebSocket message frequency
- Compress static assets
- Use CDN for frontend delivery
- Implement database indexing
- Monitor memory usage and optimize

## Maintenance

### Regular Maintenance Tasks

#### Daily
- Monitor system logs for errors
- Check disk space usage
- Verify backup completion

#### Weekly
- Review security alerts
- Update dependencies (minor versions)
- Check database performance
- Review user feedback

#### Monthly
- Security audit and updates
- Database optimization
- Performance testing
- Backup verification
- Documentation updates

### Dependency Updates

```bash
# Backend
pip list --outdated
pip install --upgrade package-name

# Frontend
npm outdated
npm update
```

### Monitoring

Implement monitoring solutions:
- Application performance monitoring (APM)
- Error tracking (Sentry)
- Log aggregation (ELK stack)
- Uptime monitoring
- Database performance monitoring


---

**Version**: 1.0.0  
