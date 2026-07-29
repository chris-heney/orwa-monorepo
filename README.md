# ORWA Monorepo

A modern full-stack monorepo built with NX, featuring a Strapi CMS backend and multiple React frontend applications.

## 🏗️ Project Architecture

### Backend
- **strapi**: Strapi v5.22.0 CMS with TypeScript
- **Database**: MySQL LTS (containerized)

### Frontend Applications
- **grant-application** (Port 4200) - Grant application management
- **membership-application** (Port 4201) - Membership management
- **conference-registration** (Port 4202) - Conference registration system
- **grant-map** (Port 4203) - Geographic grant visualization
- **grant-scoring-directory** (Port 4204) - Grant scoresheet / Ranking Packet viewer (`/application-search`)
- **grant-scoring** (Port 4206) - Committee/ORWA/DEQ evaluation tool (`/grant-administration`)
- **associate-directory** (Port 4205) - Member directory
- **member-manager** (Port 4205/nearby) - Admin (react-admin)

### Tech Stack
- **Monorepo**: NX 21.4.0
- **Backend**: Strapi 5.22.0, Node.js 18, TypeScript
- **Frontend**: React 19, TypeScript, Vite
- **Database**: MySQL LTS
- **Testing**: Jest, Cypress (E2E)
- **Linting**: ESLint
- **Formatting**: Prettier

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- npm

### Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the database**:
   ```bash
   docker-compose up mysql -d
   ```

3. **Start all applications**:
   ```bash
   # Backend API
   npx nx serve strapi
   
   # Frontend applications (in separate terminals)
   npx nx serve grant-application
   npx nx serve membership-application
   npx nx serve conference-registration
   npx nx serve grant-map
   npx nx serve grant-scoring-directory
   npx nx serve grant-scoring
   npx nx serve associate-directory
   ```

### Access URLs
- **Strapi Admin**: http://localhost:1337/admin
- **Strapi API**: http://localhost:1337/api
- **Grant Application**: http://localhost:4200
- **Membership**: http://localhost:4201
- **Conference**: http://localhost:4202
- **Grant Map**: http://localhost:4203
- **Grant Scoring Directory**: http://localhost:4204 (prod: `https://orwa.org/application-search/`)
- **Associate Directory**: http://localhost:4205
- **Grant Scoring (Eval)**: http://localhost:4206 (prod: `https://orwa.org/grant-administration/`)

> **Build note:** Prefer `npx vite build` from each app directory for production bundles. `nx build` can bake localhost API endpoints from tracked `.env` files. Always `grep -c 'localhost:1337' dist/assets/*.js` before rsync.

## 📁 Project Structure

```
orwa-monorepo/
├── apps/
│   ├── strapi/              # Strapi CMS backend
│   │   ├── config/             # Strapi configuration
│   │   ├── public/uploads/     # File uploads
│   │   ├── src/                # Custom Strapi code
│   │   └── .env                # Environment variables
│   ├── grant-application/      # React frontend apps
│   ├── membership-application/
│   ├── conference-registration/
│   ├── grant-map/
│   ├── grant-scoring-directory/  # application-search viewer
│   ├── grant-scoring/            # grant-administration eval tool
│   ├── associate-directory/
│   └── grant-application-e2e/  # E2E tests
├── docker-compose.yml          # Development environment
├── docker-compose.prod.yml     # Production with Traefik
├── nx.json                     # NX configuration
├── package.json                # Root dependencies & scripts
└── tsconfig.base.json          # Shared TypeScript config
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev                     # Start all services with Docker
npm run dev:stop               # Stop all Docker services

# Individual services
npm run start:strapi           # Start Strapi backend
npm run start:grant-app        # Start grant application
npm run start:membership       # Start membership application
npm run start:conference       # Start conference registration
npm run start:grant-map        # Start grant map
npm run start:scoring-directory # Start grant scoring directory (application-search)
npm run start:scoring          # Start grant scoring eval (grant-administration)
npm run start:directory        # Start associate directory

# Testing & Quality
npm run test                   # Run all tests
npm run test:watch            # Run tests in watch mode
npm run lint                  # Lint all applications
npm run build                 # Build all applications

# Docker
npm run build:docker          # Build Docker images
npm run deploy                # Deploy to production
npm run deploy:stop          # Stop production deployment
```

### Working with NX

```bash
# Generate new React application
npx nx generate @nx/react:application --name=new-app

# Generate new Node.js application  
npx nx generate @nx/node:application --name=new-api

# Run specific commands
npx nx serve app-name         # Serve specific app
npx nx build app-name         # Build specific app
npx nx test app-name          # Test specific app
npx nx lint app-name          # Lint specific app

# Show project information
npx nx show project app-name
npx nx show projects          # List all projects
```

### Database Management

The MySQL database runs in Docker with the following default credentials:
- **Host**: localhost:3306
- **Database**: strapi
- **Username**: strapi  
- **Password**: strapi

```bash
# Database operations
docker-compose up mysql -d     # Start database
docker-compose down            # Stop all services
docker logs orwa-monorepo-mysql-1  # View database logs

# Connect to database
mysql -h localhost -u strapi -p strapi
```

## 🔧 Configuration

### Environment Variables

Create `.env` files in individual applications as needed:

**apps/strapi/.env**:
```bash
HOST=0.0.0.0
PORT=1337
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
APP_KEYS=your-app-keys
ADMIN_JWT_SECRET=your-admin-secret
API_TOKEN_SALT=your-api-token-salt
JWT_SECRET=your-jwt-secret
```

### Strapi Configuration

Strapi configuration files are located in `apps/strapi/config/`:
- `database.js` - Database connection
- `server.js` - Server configuration
- `admin.js` - Admin panel settings
- `middlewares.js` - Middleware configuration
- `api.js` - API settings

## 🧪 Testing

### Unit Tests
```bash
npm run test                  # Run all unit tests
npx nx test app-name         # Test specific application
```

### E2E Tests  
```bash
npx nx e2e grant-application-e2e  # Run E2E tests
```

### Linting
```bash
npm run lint                 # Lint all applications
npx nx lint app-name        # Lint specific application
```

## 📦 Building & Deployment

### Development Build
```bash
npm run build               # Build all applications
npx nx build app-name      # Build specific application
```

### Production Deployment

1. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

2. **Deploy with Docker Compose**:
   ```bash
   npm run deploy            # Start production environment
   npm run deploy:stop       # Stop production environment
   ```

### Production Environment

The production setup (`docker-compose.prod.yml`) includes:
- Traefik reverse proxy with SSL
- Domain-based routing
- Automatic HTTPS certificates
- Production-optimized containers

Domain configuration:
- `api.your-domain.com` - Strapi API
- `grants.your-domain.com` - Grant Application
- `membership.your-domain.com` - Membership Application
- `conference.your-domain.com` - Conference Registration
- `map.your-domain.com` - Grant Map
- `scoring.your-domain.com` - Grant Scoring  
- `directory.your-domain.com` - Associate Directory

## 🤝 Contributing

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and test locally:
   ```bash
   npm run lint              # Check code quality
   npm run test              # Run tests
   npm run build             # Verify builds
   ```

3. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

4. **Create a pull request** for review

### Code Standards

- **TypeScript**: All new code should use TypeScript
- **ESLint**: Follow the configured linting rules
- **Prettier**: Code formatting is enforced
- **Testing**: Add tests for new features
- **Documentation**: Update README for significant changes

### Adding New Applications

1. **Generate new React app**:
   ```bash
   npx nx generate @nx/react:application --name=new-app --style=css --bundler=vite --unitTestRunner=jest --linter=eslint --routing
   ```

2. **Add to package.json scripts**:
   ```json
   "start:new-app": "nx serve new-app"
   ```

3. **Update docker-compose.yml** if containerization needed

## 🐛 Troubleshooting

### Common Issues

**Port already in use**:
```bash
lsof -i :PORT_NUMBER          # Find process using port
kill -9 PID                   # Kill process
```

**Database connection issues**:
```bash
docker-compose ps             # Check MySQL status
docker logs orwa-monorepo-mysql-1  # Check database logs
```

**Build failures**:
```bash
rm -rf node_modules           # Clear dependencies
npm install                   # Reinstall
npm run build                 # Rebuild
```

**NX cache issues**:
```bash
npx nx reset                  # Clear NX cache
```

## 📚 Resources

- [NX Documentation](https://nx.dev)
- [Strapi Documentation](https://docs.strapi.io)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## 📄 License

MIT License - see LICENSE file for details.