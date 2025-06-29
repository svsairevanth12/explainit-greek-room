# Explain It - AI-Powered EdTech Platform

A comprehensive educational technology platform that combines OpenAI and Omnidim APIs to provide personalized learning experiences through AI-powered explanations, voice interactions, and progress tracking.

## 🌟 Features

### 🎓 **Exam Whisperer**
- **AI-Powered Explanations**: Get instant, detailed explanations for any question using OpenAI
- **Interactive Quizzes**: Auto-generated quizzes with detailed feedback
- **Progress Tracking**: Monitor learning progress across subjects
- **Difficulty Levels**: Easy, Medium, Hard with adaptive content

### 🗣️ **Language Buddy**
- **Multi-Language Support**: 50+ languages including Spanish, French, German, Italian, Japanese, Korean, Chinese
- **Voice Practice**: Real-time conversation practice with Omnidim voice AI
- **AI Content Generation**: Vocabulary, dialogues, grammar tips, cultural notes
- **Pronunciation Feedback**: Accent correction and pronunciation scoring

### 👨‍👩‍👧‍👦 **Parent Portal**
- **Voice-Activated Interface**: Control dashboard with voice commands using Omnidim
- **Progress Summaries**: Visual dashboards with student performance analytics
- **Meeting Scheduling**: Parent-teacher meeting coordination
- **Real-time Notifications**: Updates on student progress and activities

### 🎯 **Additional Features**
- **Voice Chat Widget**: Floating AI assistant available on all pages
- **Beautiful UI/UX**: Professional design with dark/light mode
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **User Authentication**: Secure JWT-based authentication system
- **Settings & Preferences**: Comprehensive user customization options

## 🚀 **Technology Stack**

### **Frontend**
- **Next.js 15**: React framework with App Router
- **TypeScript**: Full type safety
- **Tailwind CSS**: Modern styling system
- **shadcn/ui**: Beautiful, accessible components
- **Framer Motion**: Smooth animations
- **Lucide Icons**: Consistent iconography

### **Backend & Database**
- **SQLite**: Local database with Prisma ORM
- **Next.js API Routes**: Serverless API endpoints
- **JWT Authentication**: Secure user sessions
- **bcryptjs**: Password hashing

### **AI Integration**
- **OpenAI API**: GPT-4o-mini for explanations and content generation
- **Omnidim API**: Voice AI for conversation and commands
- **Real-time Processing**: Instant AI responses

## 📦 **Installation & Setup**

### **Prerequisites**
- Node.js 18+
- npm or pnpm
- OpenAI API key
- Omnidim API key

### **Environment Variables**
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# App Configuration
APP_NAME="Explain It"
APP_URL="http://localhost:3000"

# API Keys
OPENAI_API_KEY="your-openai-api-key"
OMNIDIM_API_KEY="your-omnidim-api-key"
```

### **Installation Steps**

1. **Clone the repository**
```bash
git clone <repository-url>
cd explain-it
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Set up the database**
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:3000`

## 🎯 **Usage**

### **Demo Accounts**
- **Student**: `student@demo.com` / `password123`
- **Parent**: `parent@demo.com` / `password123`

### **Key Features to Test**

1. **Sign Up/Sign In**: Create account or use demo credentials
2. **Dashboard**: View personalized learning dashboard
3. **Exam Whisperer**: Ask questions and get AI explanations
4. **Language Buddy**: Generate learning content and practice
5. **Parent Portal**: Monitor progress with voice interface
6. **Voice Widget**: Click floating chat button for AI assistance
7. **Settings**: Customize preferences and notifications

## 🔧 **Available Scripts**

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with demo data
npm run db:studio    # Open Prisma Studio
```

## 🔌 **API Integration**

### **OpenAI Integration**
- **Explanations**: `/api/ai/explain` - Generate detailed explanations
- **Quizzes**: `/api/ai/quiz` - Create interactive quizzes
- **Language Content**: `/api/language/content` - Generate learning materials

### **Omnidim Integration**
- **Voice Agents**: `/api/voice/agents` - Manage voice AI agents
- **Voice Initialization**: `/api/voice/initialize` - Set up voice features

### **Authentication**
- **Sign Up**: `/api/auth/signup` - Create new account
- **Sign In**: `/api/auth/signin` - Authenticate user
- **Dashboard Data**: `/api/dashboard` - Get user dashboard data

## 🧪 **Testing**

### **API Testing**
```bash
# Test OpenAI explanation
curl -X POST http://localhost:3000/api/ai/explain \
  -H "Content-Type: application/json" \
  -d '{"question":"What is 2+2?","subject":"Mathematics","difficulty":"easy"}'

# Test dashboard data
curl http://localhost:3000/api/dashboard
```

## 🆘 **Support**

- **Documentation**: Visit `/help` in the application
- **Email**: support@explainit.com
- **Issues**: Create a GitHub issue

---

**Built with ❤️ using Next.js, OpenAI, and Omnidim APIs**
