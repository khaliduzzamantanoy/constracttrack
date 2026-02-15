# Constract Log - Construction Material Tracker

An advanced, data-driven construction material and labor tracking system designed with a premium "liquid glass" aesthetic. This application provides real-time logging, material inventory tracking, and automated PDF reporting for construction sites.

## Features

- **Real-time Trip Logging**: Track material movement (Cement, Sand, Chips) and Crane Lifts with precision.
- **Manual & Zero-Data Entry**: Flexible input system allowing zero values and manual adjustments.
- **Material Archive**: Comprehensive history log with filtering by floor and operator.
- **Stock Management**: Real-time inventory tracking for Cement, Sand, and Chips with automatic deduction logic.
- **Global Notifications**: Robust toast system using React Portals to ensure visibility across all devices.
- **Automated Reporting**: One-click generation of professional PDF audit reports with automated formatting.
- **Premium UI/UX**: Modern "Glassmorphism" design with fluid animations and ergonomic mobile navigation.
- **Responsive Design**: Fully optimized for tablets and mobile devices with dedicated navigation modes.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: MongoDB (Mongoose)
- **PDF Generation**: jsPDF & html2canvas

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB connection string

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/khaliduzzamantanoy/constracttrack.git
   cd constracttrack
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```
4. **Run Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser.

## Usage

- **Dashboard**: View real-time aggregated stats and recent activity.
- **Trip Log**: Submit new material entries. Use the "+" and "-" buttons or type numbers directly.
- **Materials**: Browse the full history of all logs. Filter by floor or search by operator name.
- **Report**: Generate and download professional PDF audit reports.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Developed by TANOY**
