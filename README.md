# Mortgage Calculator

A modern, responsive mortgage calculator built with React, Vite, and Tailwind CSS. This application allows users to calculate monthly mortgage payments based on loan amount, interest rate, and loan term.

## 🚀 Features

- **Real-time Calculations**: Instant mortgage payment calculations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Fast Development**: Built with Vite for rapid development and hot reloading
- **Type-Safe**: Full TypeScript support with proper type definitions
- **Accessible**: Built with accessibility best practices

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 18.0.0 or higher)
- **pnpm** (recommended) or npm

### Installing Prerequisites

#### Option 1: Using winget (Windows)
```bash
# Install Node.js
winget install OpenJS.NodeJS

# Install pnpm globally
npm install -g pnpm
```

#### Option 2: Manual Installation
- Download and install Node.js from [nodejs.org](https://nodejs.org/)
- Install pnpm: `npm install -g pnpm`

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/mortgage_calculator.git
   cd mortgage_calculator
   ```

2. **Install dependencies:**
   ```bash
   # Using pnpm (recommended)
   pnpm install

   # Or using npm
   npm install
   ```

## 🚀 Running the Application

### Development Server

Start the development server with hot reloading:

```bash
# Using pnpm
pnpm run dev

# Or using npm
npm run dev
```

The application will be available at:
- **Local**: http://localhost:5173/mortgage_calculator/
- **Network**: http://localhost:5173/ (if you add `--host` flag)

### Build for Production

Create an optimized production build:

```bash
# Using pnpm
pnpm run build

# Or using npm
npm run build
```

The built files will be in the `docs/` directory, ready for deployment.

### Preview Production Build

Test the production build locally:

```bash
# Using pnpm
pnpm run preview

# Or using npm
npm run preview
```

## 📁 Project Structure

```
mortgage_calculator/
├── public/                 # Static assets
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── ui/            # Reusable UI components (shadcn/ui)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── App.jsx            # Main application component
│   ├── App.css            # Application styles
│   ├── index.css          # Global styles
│   └── main.jsx           # Application entry point
├── docs/                  # Production build output
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── eslint.config.js       # ESLint configuration
```

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm run dev` | Start development server with hot reloading |
| `pnpm run build` | Create production build |
| `pnpm run preview` | Preview production build locally |
| `pnpm run lint` | Run ESLint for code quality checks |

## 🏗️ Technologies Used

### Core Framework
- **React 19.1.0** - Modern React with latest features
- **Vite 6.3.5** - Fast build tool and development server

### UI & Styling
- **Tailwind CSS 4.1.7** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible UI components
- **Lucide React** - Beautiful icon library

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript** - Type definitions for better development experience

### Package Manager
- **pnpm** - Fast, disk-efficient package manager

## 🌐 Deployment

### GitHub Pages

The project is configured for deployment to GitHub Pages:

1. **Build the project:**
   ```bash
   pnpm run build
   ```

2. **Commit and push the changes:**
   ```bash
   git add .
   git commit -m "Build for production"
   git push origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages"
   - Select "Deploy from a branch"
   - Choose the `main` branch and `/docs` folder

### Other Platforms

The built files in the `docs/` directory can be deployed to:
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any static hosting service

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory for environment-specific configurations:

```env
# Example environment variables
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=Mortgage Calculator
```

### Vite Configuration

The `vite.config.js` file contains build and development configurations:

```javascript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/mortgage_calculator/',
  build: {
    outDir: 'docs',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Node.js Version Issues
```bash
# Check Node.js version
node --version

# Check npm version
npm --version
```

#### 2. Port Already in Use
If port 5173 is already in use:
```bash
# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use a different port
pnpm run dev --port 3000
```

#### 3. Dependencies Installation Issues
```bash
# Clear cache and reinstall
pnpm store prune
rm -rf node_modules
pnpm install
```

#### 4. Build Errors
```bash
# Clear build cache
rm -rf node_modules/.vite
pnpm run build
```

### Development Tips

- Use `pnpm run lint` to check code quality
- The app supports hot reloading during development
- All UI components are from shadcn/ui for consistency
- Tailwind CSS classes are available globally

## 📱 Usage

1. **Enter Loan Amount**: Input the total loan amount in dollars
2. **Enter Interest Rate**: Input the annual interest rate as a percentage
3. **Enter Loan Term**: Input the loan term in years
4. **Calculate**: Click the calculate button to see your monthly payment

The calculator uses the standard mortgage payment formula:
```
M = P[r(1+r)^n]/[(1+r)^n-1]
```
Where:
- M = Monthly payment
- P = Loan principal
- r = Monthly interest rate
- n = Number of payments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is private and intended for personal use.

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the console for error messages
3. Ensure all prerequisites are properly installed
4. Check that you're using the correct Node.js version

---

**Happy calculating! 🏠💰**
