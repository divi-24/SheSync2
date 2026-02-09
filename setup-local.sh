#!/bin/bash

# Local Development Setup Script for SheSync

echo "🚀 Setting up SheSync for local development..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js detected${NC}"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python3 is not installed. Please install Python3 first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Python3 detected${NC}"

# Setup Frontend
echo -e "\n${YELLOW}📦 Setting up Frontend...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend setup failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

# Copy .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}📝 Creating .env.local${NC}"
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000
EOF
    echo -e "${GREEN}✓ .env.local created${NC}"
else
    echo -e "${GREEN}✓ .env.local already exists${NC}"
fi

# Setup Backend
echo -e "\n${YELLOW}📦 Setting up Backend...${NC}"
cd backend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend setup failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Copy .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creating .env${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Edit .env with your actual credentials${NC}"
    echo -e "${GREEN}✓ .env created (UPDATE WITH YOUR CREDENTIALS)${NC}"
else
    echo -e "${GREEN}✓ .env already exists${NC}"
fi

cd ..

# Setup ML Service
echo -e "\n${YELLOW}📦 Setting up ML Service...${NC}"
cd SheSyncML

# Create virtual environment
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating Python virtual environment...${NC}"
    python3 -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
fi

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ ML Service setup failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ ML Service dependencies installed${NC}"

cd ..

echo -e "\n${GREEN}✅ Setup complete!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Edit backend/.env with your credentials"
echo "2. Make sure MongoDB is running"
echo "3. Run: npm run dev (frontend in terminal 1)"
echo "4. Run: cd backend && npm run dev (backend in terminal 2)"
echo "5. Run: cd SheSyncML && source venv/bin/activate && uvicorn main:app --reload (ML in terminal 3)"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo "ML API: http://localhost:8000"
