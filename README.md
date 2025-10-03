# Streamview UMC Chikanga East - Fundraising Tracking System

## About the Project

This is a comprehensive fundraising tracking system built for **Streamview United Methodist Church Chikanga East**. The application helps manage and track contributions, mutupo (totem) groups, and generate detailed reports for the church's building fundraising initiative.

Built with **Laravel 11** on the backend and **ReactJS** with **Inertia.js** on the frontend, this system provides a modern, responsive interface for efficient fundraising management.

## 🎯 Key Features

### 1. **Contributions Management**
- Add, edit, and delete individual contributions
- Track T-shirts and cement bag donations
- Automatic calculation of total contributions
- Group contributions by mutupo (totem)

### 2. **Mutupo (Totem) Management**
- Manage different mutupo groups (Shava, Mhofu, Moyo, Shumba, etc.)
- View contributions organized by mutupo
- Track performance across different groups

### 3. **Comprehensive Reporting**
- **Summary Reports**: Overview of total contributions and key metrics
- **Mutupo Reports**: Contributions grouped by totem
- **Contributor Type Reports**: Analysis by guest types (External, Internal, Task Force)
- **Monthly Breakdown**: Contributions by time period
- **Detailed Reports**: Complete list of all contributions
- **CSV Export**: Download reports for external analysis

### 4. **Data Import/Export**
- Bulk import contributions via CSV files
- Download contribution data in CSV format
- Template-based import system with validation

### 5. **User Management**
- Secure authentication system
- User profile management
- Role-based access control

## 🚀 Quick Start Guide

### Prerequisites
- PHP 8.2+
- Node.js 18+
- Composer
- SQLite (default) or MySQL

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd streamview-fundraising
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install JavaScript dependencies**
   ```bash
   npm install
   ```

4. **Setup environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Setup database**
   ```bash
   php artisan migrate --seed
   ```

6. **Build assets**
   ```bash
   npm run build
   ```

7. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   php artisan serve

   # Terminal 2 - Frontend (for development)
   npm run dev
   ```

## 📊 System Overview

### Contribution Types
- **T-Shirt Sales**: $7 per shirt (automatically calculated)
- **Cement Bag Donations**: Custom amounts per bag
- **Total Contribution**: Automatically calculated sum

### Contributor Categories
1. **External Guest** - Visitors and friends of the church
2. **Internal Guest** - Church members from other departments
3. **Fundraising Task Force Member** - Core team members

### Mutupo Groups
The system supports tracking contributions by traditional totem groups including:
- Shava
- Mhofu  
- Moyo
- Shumba
- Soko
- Gumbo
- Ngwena

## 📈 Reporting Capabilities

### Available Reports
1. **Summary Report**: High-level overview with totals and averages
2. **By Mutupo**: Contributions grouped by totem with comparative analysis
3. **By Contributor Type**: Breakdown by guest categories
4. **Monthly Breakdown**: Time-based contribution analysis
5. **Detailed Report**: Complete transaction listing

### Export Features
- All reports exportable to CSV format
- Custom date range filtering
- Real-time data visualization

## 🛠 Technical Stack

### Backend
- **Laravel 11** - PHP framework
- **Eloquent ORM** - Database management
- **Inertia.js** - Server-side routing
- **SQLite/MySQL** - Database

### Frontend
- **React 18** - User interface
- **Tailwind CSS** - Styling framework
- **Inertia.js** - Client-side navigation

### Key Packages
- **Laravel Breeze** - Authentication scaffolding
- **Inertia React** - React integration
- **Tailwind CSS** - Utility-first CSS framework

## 📱 Usage Guide

### Adding Contributions
1. Navigate to **Contributions** → **Add New Contribution**
2. Fill in contributor details
3. Select mutupo and contributor type
4. Enter T-shirt and/or cement bag quantities
5. System automatically calculates totals

### Generating Reports
1. Go to **Reports** section
2. Select report type and date range
3. Click **Generate Report**
4. Export to CSV if needed

### Bulk Import
1. Download the CSV template
2. Fill with contribution data
3. Upload via **Import CSV** feature
4. System validates and imports data

## 🔒 Security Features

- Secure authentication with Laravel Breeze
- CSRF protection
- SQL injection prevention
- XSS protection
- Secure file upload validation

## 📞 Support

For technical support or questions about the fundraising system, please contact:
- **Developer**: [hapanamambod@africau.edu]

## 🙏 Acknowledgments

This system was developed to support **Streamview UMC Chikanga East** in their building fundraising efforts. May this tool help in achieving the church's vision and mission.
