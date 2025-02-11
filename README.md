# Digital Management System Front-End

## Overview
The MLS Digital Management System Front-End is a comprehensive web application for the Malawi Law Society that manages various aspects of legal practice including license applications, pro bono work, and member management.

## Features

### Core Functionality
- User Authentication and Authorization
- Role-based Access Control
- Google OAuth Integration
- Token-based Security

### Key Areas

#### Member Management
- Member Profile Management
- CPD (Continuing Professional Development) Units Tracking
- License Application Processing
- Pro Bono Work Management

#### License Management
- License Application Submission
- Multi-level Approval Workflow
- Application Status Tracking
- License History

#### Pro Bono System
- Pro Bono Application Management
- Client Management
- Pro Bono Hours Tracking
- Reports Generation

#### Administrative Functions
- User Management
- Firm Management
- Department Administration
- Country/Location Management
- Year of Operation Settings

#### Financial Management
- License Application Processing
- Financial Tracking
- Payment Management

#### Executive Functions
- Application Approvals
- System Oversight
- Performance Metrics
- Statistical Reports

## Technology Stack
- ASP.NET Core MVC
- C# Programming Language
- Bootstrap for UI Components
- JavaScript/jQuery
- Cookie-based Authentication
- Google OAuth Integration

## Project Structure
The application is organized into different areas representing various user roles and functionalities:

- Admin Area: System administration and configuration
- Member Area: Member-specific functions
- Finance Area: Financial management
- Executive Area: Executive oversight
- CEO Area: Top-level management
- Secretariat Area: Administrative operations
- Complaints Area: Complaint management

## Installation

### Prerequisites
- .NET Core SDK (Latest Version)
- Visual Studio 2022 or later
- SQL Server (for local development)

### Setup Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/MLS-Digital-Management-System-Front-End.git
   ```

2. Navigate to the project directory:
   ```bash
   cd MLS-Digital-Management-System-Front-End
   ```

3. Restore dependencies:
   ```bash
   dotnet restore
   ```

4. Run the application:
   ```bash
   dotnet run
   ```

The application will be available at `http://localhost:5002`

## Authentication and Authorization
The system implements a comprehensive authentication system with:
- Cookie-based Authentication
- Role-based Authorization
- Google OAuth Integration
- Token-based API Communication

## Areas and Roles
- **Admin**: System configuration and user management
- **Member**: Regular system users (lawyers)
- **Finance**: Financial operations and tracking
- **Executive**: Oversight and approvals
- **CEO**: Top-level management
- **Secretariat**: Administrative operations
- **Complaints**: Complaint handling

## API Integration
The front-end communicates with a backend API using:
- RESTful API calls
- Token-based authentication
- Service repository pattern
- Asynchronous operations

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
[Add License Information]

## Support
For support, please contact [Add Contact Information] 