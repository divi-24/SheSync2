# SheSync 🌸

SheSync is a comprehensive women's health and wellness platform built with modern web technologies. The platform aims to provide a supportive environment for women to access health resources, connect with healthcare professionals, and engage with a community of like-minded individuals.

**Latest Updates (2025):**

- ✨ Enhanced Period Tracker with Backend Integration
- 🔒 JWT-based Authentication System
- 📊 Real-time Health Analytics and Data Visualization
- 🎯 Interactive Data Modals with Beautiful UI
- 🤖 AI-Powered Health Assistant with Google Gemini
- �️ Voice Agent Integration with Vapi AI
- 📱 Fully Responsive Next.js 15 Application
- 🔄 Server-Side Rendering with Hydration Optimization
- 🏥 Complete Healthcare Ecosystem

## 🚀 Features

### Core Health Features

- **AI-Powered Health Assistant**: Get instant answers using Google Gemini AI
- **Period Tracker**: Complete menstrual cycle tracking with MongoDB backend
- **Symptom Analyzer**: AI-powered health symptom assessment and tracking
- **Ovulation Calculator**: Advanced fertility tracking and predictions
- **PCOS Support**: Specialized tools and resources for PCOS management
- **Health Analytics**: Real-time data visualization with interactive modals

### Community & Support

- **Community Forums**: Connect with other women and share experiences
- **Global Chat**: Real-time chat functionality for peer support
- **Expert Consultation**: Book sessions with certified healthcare professionals
- **Educational Blogs**: Access curated health and wellness articles

### Advanced Technology

- **Voice Agent**: Voice-based AI interaction using Vapi AI
- **Chatbot**: Intelligent health assistant powered by Google Gemini
- **Progressive Web App**: PWA capabilities for mobile-like experience
- **Real-time Updates**: Live data synchronization across the platform

### Specialized Dashboards

- **Parent Dashboard**: Multi-child health tracking and management
- **Partner Dashboard**: Features for partners/spouses to support health journey
- **Diet Planning**: Personalized nutrition and meal planning tools

### E-commerce & Services

- **Period Products**: Shop for menstrual health products
- **Healthcare Marketplace**: Access to health and wellness products
- **Professional Services**: Healthcare provider booking and consultation system

## 🛠️ Technologies Used

### Frontend

- **Next.js 15**: React framework with App Router and Server-Side Rendering
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **Framer Motion**: Advanced animations and transitions
- **Clsx & CVA**: Conditional styling utilities

### AI & APIs

- **Google Gemini AI**: Advanced AI for health assistance
- **Vapi AI**: Voice interaction capabilities
- **Google Maps API**: Location-based services
- **Cloudinary**: Image and media management
- **SerpAPI**: Search functionality

### Backend

- **Node.js**: JavaScript runtime
- **Express.js 4**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Token authentication
- **Socket.io**: Real-time communication
- **Cloudinary**: File upload and storage

### UI Components & Icons

- **Headless UI**: Unstyled, accessible UI components
- **Lucide React**: Modern icon library
- **React Icons**: Popular icon packs
- **Custom UI Components**: Modular component system

### Development Tools

- **ESLint**: Code linting and formatting
- **TypeScript**: Static type checking
- **Turbopack**: Fast bundler for development
- **PWA**: Progressive Web App capabilities

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/divi-24/SheSync-Auth.git
cd SheSync-Auth
```

2. Install frontend dependencies:

```bash
npm install
```

3. Install backend dependencies:

```bash
cd backend
npm install
cd ..
```

4. Create environment variables:

**Frontend (.env.local):**

```env
NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

**Backend (.env):**

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
FRONTEND_URL=http://localhost:3000
```

5. Start the backend server:

```bash
cd backend
npm run dev
```

6. Start the frontend development server:

```bash
npm run dev
```

7. Access the application at `http://localhost:3000`

## 🏗️ Project Structure

```
SheSync-Auth/
├── src/                          # Source code
│   ├── app/                      # Next.js App Router pages
│   │   ├── page.tsx             # Landing page
│   │   ├── layout.tsx           # Root layout
│   │   ├── globals.css          # Global styles
│   │   ├── api/                 # API routes
│   │   ├── bliss/               # Wellness games and activities
│   │   ├── blogs/               # Health blog section
│   │   ├── chatbot/             # AI-powered health assistant
│   │   ├── consultation/        # Healthcare consultation booking
│   │   ├── dashboard/           # User dashboard interface
│   │   ├── diet-plan/           # Nutrition planning tools
│   │   ├── wellnessproducts/                # E-commerce marketplace
│   │   ├── forums/              # Community forum
│   │   ├── login/               # User authentication
│   │   ├── signup/              # User registration
│   │   ├── ovulationcalc/       # Ovulation calculator
│   │   ├── parent/              # Parent dashboard
│   │   ├── partner/             # Partner dashboard
│   │   ├── pcos/                # PCOS support tools
│   │   ├── periodproducts/      # Period product marketplace
│   │   ├── symptomsanalyzer/    # Health symptom analysis
│   │   ├── tracker/             # Period tracking interface
│   │   └── voice-agent/         # Voice interaction interface
│   │
│   ├── components/              # Reusable UI components
│   │   ├── NavbarWrapper.tsx    # Navigation wrapper
│   │   ├── GlobalChat.tsx       # Community chat interface
│   │   ├── PostCard.tsx         # Forum post component
│   │   ├── PostList.tsx         # Forum posts list
│   │   ├── ProtectedRoute.tsx   # Route protection
│   │   ├── SheSyncLoader.tsx    # Loading component
│   │   ├── tracker/             # Period tracker components
│   │   │   ├── PeriodTracking.tsx    # Period tracking module
│   │   │   └── HealthTracking.tsx    # Health tracking module
│   │   ├── ovulationCalc/       # Ovulation calculator components
│   │   └── ui/                  # UI components
│   │       ├── NavbarComponent.tsx   # Navigation component
│   │       ├── button.tsx       # Button component
│   │       ├── input.tsx        # Input component
│   │       └── modal.tsx        # Modal component
│   │
│   ├── context/                 # React contexts
│   │   ├── AuthContext.tsx      # Authentication context
│   │   └── ThemeContext.tsx     # Theme management
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuthStatus.ts     # Authentication status
│   │   └── useScreenSize.ts     # Screen size detection
│   │
│   ├── lib/                     # Utility libraries
│   │   ├── api.ts               # API client
│   │   └── auth.ts              # Authentication helpers
│   │
│   ├── utils/                   # Utility functions
│   └── middleware.ts            # Next.js middleware
│
├── backend/                     # Backend server
│   ├── server.js               # Main server file
│   ├── config/                 # Configuration files
│   │   ├── cloudinary.js       # Cloudinary setup
│   │   └── multer.js           # File upload middleware
│   ├── controllers/            # Route controllers
│   │   ├── communityController.js     # Community features
│   │   ├── cycleControllers.js        # Period tracking
│   │   ├── messageController.js       # Chat functionality
│   │   ├── postController.js          # Forum posts
│   │   ├── pregnancyController.js     # Pregnancy tracking
│   │   └── symptomsController.js      # Symptom analysis
│   ├── middleware/             # Express middleware
│   │   └── auth.js             # JWT authentication
│   ├── models/                 # Database models
│   │   ├── user.js             # User model
│   │   ├── cycle.js            # Period cycle model
│   │   ├── Post.js             # Forum post model
│   │   ├── Community.js        # Community model
│   │   ├── Message.js          # Chat message model
│   │   └── symptoms.js         # Symptoms model
│   └── routes/                 # API routes
│       ├── auth.js             # Authentication routes
│       ├── cycleRoutes.js      # Period tracking routes
│       ├── postRoutes.js       # Forum routes
│       ├── communityRoutes.js  # Community routes
│       └── messageRoutes.js    # Chat routes
│
├── public/                     # Static assets
│   ├── assets/                 # Application assets
│   └── icons/                  # Icon files
│
├── package.json               # Frontend dependencies
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Project documentation
```

### Key Features Overview

#### Core Health Platform

- **Landing Page**: Modern landing with hero section, feature showcase, and navigation
- **Period Tracker**: Complete menstrual cycle tracking with backend data storage
  - **PeriodTracking.tsx**: Main period tracking functionality
  - **HealthTracking.tsx**: Health metrics and symptom tracking
  - Interactive data visualization modals with beautiful UI
  - Analytics, History, and Active data views
- **Symptom Analyzer**: AI-powered health assessment using Google Gemini
- **Ovulation Calculator**: Advanced fertility tracking and predictions
- **PCOS Support**: Specialized tools and resources

#### AI & Voice Features

- **Chatbot**: Advanced AI health assistant powered by Google Gemini
- **Voice Agent**: Voice-based interaction using Vapi AI technology
- **Health Analytics**: Real-time data processing with interactive visualizations

#### Community Features

- **Forums**: Community discussion platform with post creation and interaction
- **Global Chat**: Real-time chat functionality with Socket.io
- **Expert Consultation**: Healthcare provider booking system

#### User Management & Authentication

- **Authentication System**: JWT-based secure authentication
- **Protected Routes**: Route-level security with authentication checks
- **User Dashboard**: Personalized interface with health metrics
- **Profile Management**: User settings and preferences

#### Specialized Dashboards

- **Parent Dashboard**: Multi-child health tracking and management
- **Partner Dashboard**: Features for partners/spouses to support health journey
- **Diet Planning**: Personalized nutrition and meal planning tools

#### E-commerce & Services

- **Period Products**: Specialized marketplace for menstrual health products
- **Healthcare Marketplace**: Access to health and wellness products
- **Professional Services**: Healthcare provider booking and consultation

### Technology Stack Details

#### Frontend Architecture (Next.js 15)

- **App Router**: Modern Next.js routing with server components
- **Server-Side Rendering**: Optimized hydration and performance
- **TypeScript Components**: Type-safe React development
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Progressive Web App**: PWA capabilities for mobile experience
- **Animation Framework**: Framer Motion for smooth interactions

#### Backend Infrastructure (Node.js/Express)

- **RESTful API**: Comprehensive API with Express.js 4
- **Authentication**: JWT-based secure authentication system
- **Database**: MongoDB with Mongoose ODM for data modeling
- **File Upload**: Cloudinary integration for media management
- **Real-time Features**: Socket.io for live chat and updates
- **Rate Limiting**: Express rate limiting for API protection

#### AI & External Services

- **Google Gemini AI**: Advanced conversational AI for health assistance
- **Vapi AI**: Voice interaction and speech recognition
- **Google Maps**: Location-based services for healthcare providers
- **Cloudinary**: Image and media management platform

#### Development & Deployment

- **TypeScript**: Full type safety across frontend and backend
- **ESLint**: Code quality and formatting standards
- **Turbopack**: Fast development bundling
- **Environment Management**: Secure environment variable handling

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Style Guidelines

- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Write unit tests for new features
- Ensure all tests pass before submitting a PR
- Follow accessibility guidelines for inclusive design

## 📝 Code of Conduct

### Our Pledge

We are committed to making participation in this project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- All contributors who have helped shape this project
- The open-source community for their invaluable tools and libraries
- Healthcare professionals who have provided guidance and expertise

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or cloud)
- Google Gemini API key
- Vapi AI account (for voice features)
- Cloudinary account (for media uploads)

### Running the Application

1. **Clone and Install:**

   ```bash
   git clone https://github.com/divi-24/SheSync-Auth.git
   cd SheSync-Auth
   npm install
   cd backend && npm install && cd ..
   ```

2. **Environment Setup:**
   Create `.env.local` (frontend) and `backend/.env` files with required API keys

3. **Start Backend Server:**

   ```bash
   cd backend
   npm run dev
   ```

4. **Start Frontend:**

   ```bash
   npm run dev
   ```

5. **Access Application:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

### Key Features to Explore

- **Period Tracker**: Complete cycle tracking with data visualization
- **AI Chatbot**: Health assistance powered by Google Gemini
- **Voice Agent**: Voice-based interaction with Vapi AI
- **Community Forums**: Connect with other users
- **Real-time Chat**: Global chat functionality
- **Health Analytics**: Interactive data modals and insights

## 📞 Support

If you need help or have questions, please:

- Open an issue in the GitHub repository
- Contact the maintainers
- Join our community forum
- Check the [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines

---
