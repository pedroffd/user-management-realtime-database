# User Management System

A modern, full-stack user management application built with Next.js, featuring CRUD operations with location data integration.

## 🚀 Features

- ✅ **Complete CRUD Operations** - Create, Read, Update, Delete users
- ✅ **Location Data Integration** - Automatic latitude, longitude, and timezone fetching via OpenWeather API
- ✅ **Google Maps Integration** - Interactive map view with user markers and info windows
- ✅ **Multiple View Modes** - Cards, Table, and Map visualization options
- ✅ **Firebase Realtime Database** - NoSQL database for data storage
- ✅ **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- ✅ **Dark Mode Support** - System, light, and dark theme options
- ✅ **Form Validation** - Zod schema validation with React Hook Form
- ✅ **Real-time Updates** - React Query for optimistic updates and caching
- ✅ **TypeScript** - Full type safety throughout the application
- ✅ **Code Quality** - Biome for linting/formatting, Husky for git hooks
- ✅ **Responsive Design** - Mobile-first responsive interface

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern component library
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Google Maps JavaScript API** - Interactive maps and markers
- **Lucide React** - Icons

### Backend (App Router API Routes)
- **Next.js App Router API Routes** - Modern serverless functions
- **Firebase Admin SDK** - Database operations
- **OpenWeather API** - Location data fetching

### Database
- **Firebase Realtime Database** - NoSQL real-time database

### DevOps
- **Biome** - Linting and formatting
- **Husky** - Git hooks
- **Commitlint** - Conventional commits

## 📋 User Data Schema

Each user contains:
- `id` - Unique identifier
- `name` - User's name
- `zipcode` - Postal code
- `latitude` - Auto-fetched from zipcode
- `longitude` - Auto-fetched from zipcode
- `timezone` - Auto-calculated timezone

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Yarn package manager
- Firebase project with Realtime Database
- OpenWeather API key
- Google Maps API key with Maps JavaScript API enabled

### Installation

1. **Clone and install dependencies:**
```bash
git clone <your-repo>
cd user-management-app
yarn install
```

2. **Environment Setup:**
```bash
# Copy environment file
cp env.example.txt .env.local

# Edit .env.local with your credentials:
OPENWEATHER_API_KEY=your_api_key_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/

# For production (optional):
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
```

3. **Firebase Authentication Setup:**

**Option A: Application Default Credentials (Development)**
```bash
# Install Google Cloud CLI
gcloud auth application-default login
```

**Option B: Service Account (Production)**
- Download service account JSON from Firebase Console
- Add the credentials to your .env.local file

4. **Google Maps API Setup:**
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Enable the **Maps JavaScript API**
- Create an API key and restrict it to your domain(s)
- Add the API key to your `.env.local` file
- **Important:** Configure API key restrictions for security:
  - Application restrictions: HTTP referrers (websites)
  - Add your domains: `localhost:3000/*` and your production domain
  - API restrictions: Limit to Maps JavaScript API

5. **Run the development server:**
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📡 API Endpoints

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
  ```json
  {
    "name": "John Doe",
    "zipcode": "12345"
  }
  ```
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

## 🗺️ Google Maps Features

### Interactive Map View
- **View Toggle**: Switch between Cards, Table, and Map views
- **User Markers**: Each user appears as a blue pin on the map
- **Info Windows**: Click markers to see user details (name, zipcode, coordinates, timezone)
- **Auto-centering**: Map automatically adjusts to show all users
- **Bounds Fitting**: Intelligent zoom based on user distribution
- **Edit Integration**: Click markers to open user edit modal

### Map Components
- **MapView**: Base Google Maps component with loading/error states
- **UserMap**: Specialized component for displaying user markers
- **Custom Markers**: Company-branded blue location pins
- **Responsive Design**: Optimized for both desktop and mobile

### Technical Implementation
- Uses `@googlemaps/js-api-loader` for optimized API loading
- Type-safe integration with `@types/google.maps`
- Real-time marker updates when users are created/edited/deleted
- Leverages existing latitude/longitude data from OpenWeather API

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub:**
```bash
git add .
git commit -m "feat: initial commit"
git push origin main
```

2. **Deploy to Vercel:**
   - Connect your GitHub repo to Vercel
   - Add environment variables in Vercel dashboard:
     - `OPENWEATHER_API_KEY`
     - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
     - `FIREBASE_DATABASE_URL`
     - `FIREBASE_PROJECT_ID` (for production)
     - `FIREBASE_CLIENT_EMAIL` (for production)
     - `FIREBASE_PRIVATE_KEY` (for production)

3. **Deploy automatically** on every push to main branch

### Other Platforms

The app can also be deployed to:
- **Netlify** (with Next.js plugin)
- **Railway**
- **Digital Ocean App Platform**

## 🔧 Development

### Code Quality
```bash
# Lint and format code
yarn biome

# Run linting only
yarn lint
```

### Git Hooks
- **Pre-commit**: Runs `yarn biome` + `yarn build` automatically
- **Commit-msg**: Validates conventional commit format with commitlint

### Commit Convention
The project enforces **Conventional Commits** with automatic validation:

```bash
# ✅ Valid examples:
git commit -m "feat: add user deletion functionality"
git commit -m "fix: resolve location data fetching issue"  
git commit -m "docs: update README with deployment instructions"
git commit -m "refactor: extract API logic into services"

# ❌ Invalid examples (will be rejected):
git commit -m "add user form"           # Missing type
git commit -m "feature: new user form"  # Invalid type
git commit -m "feat Add user form"      # Missing colon
```

📖 See [COMMIT_GUIDELINES.md](./COMMIT_GUIDELINES.md) for complete rules.

## 🏗️ Project Structure

```
user-management-app/
├── app/                      # Next.js App Router
│   ├── api/users/           # API Routes (App Router)
│   │   ├── route.ts         # GET/POST /api/users
│   │   └── [id]/route.ts    # GET/PUT/DELETE /api/users/[id]
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── providers.tsx        # React Query provider
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   └── users/              # User-specific components
│       ├── UserCard.tsx    # User display card
│       ├── UserForm.tsx    # User creation/edit form
│       └── UserList.tsx    # Main user list component
├── lib/                    # Utilities
│   └── utils.ts           # Utility functions
├── app/                    # Next.js App Router
│   ├── api/                # API Routes
│   │   └── users/
│   │       ├── route.ts    # GET/POST /api/users
│   │       └── [id]/route.ts # GET/PUT/DELETE /api/users/[id]
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── providers.tsx       # React Query provider
├── services/              # API service layer
│   └── userService.ts     # User API calls
├── public/               # Static assets
├── .env.local           # Environment variables (create from example)
├── env.example.txt      # Environment variables template
└── vercel.json          # Vercel deployment config
```

## 🔒 Security Considerations

- Environment variables are properly secured
- Firebase Admin SDK uses service account for production
- API routes include proper error handling
- Form validation on both client and server
- CORS is handled by Next.js automatically

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is MIT licensed.

## 🆘 Troubleshooting

### Common Issues

**Firebase Permission Denied:**
- Ensure Firebase Realtime Database rules allow read/write
- Check authentication setup

**OpenWeather API Errors:**
- Verify API key is valid
- Check zipcode format (US format required)

**TypeScript Errors:**
- Run `yarn install` to ensure all dependencies are installed
- Restart your IDE/TypeScript server

### Support

If you encounter any issues, please check the existing issues or create a new one in the repository. 