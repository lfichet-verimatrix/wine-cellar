#!/bin/bash
# install.sh — Install dependencies, build the Wine Cellar app, and provide start instructions.
#
# This script checks for required tools (Node.js, npm, Docker), installs npm
# packages for both backend and frontend, builds the frontend, and prints
# instructions for starting the app.

set -e

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

info()  { echo -e "${CYAN}→${NC} $1"; }
ok()    { echo -e "${GREEN}✓${NC} $1"; }
warn()  { echo -e "${YELLOW}⚠${NC} $1"; }
fail()  { echo -e "${RED}✗${NC} $1"; exit 1; }

echo ""
echo -e "${CYAN}═══════════════════════════════════════${NC}"
echo -e "${CYAN}  🍷 Wine Cellar — Installation${NC}"
echo -e "${CYAN}═══════════════════════════════════════${NC}"
echo ""

# --- 1. Check Node.js ---
info "Checking Node.js..."

if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  NODE_MAJOR=$(echo "$NODE_VERSION" | sed 's/v//' | cut -d. -f1)
  if [ "$NODE_MAJOR" -ge 18 ]; then
    ok "Node.js $NODE_VERSION found"
  else
    fail "Node.js 18+ required (found $NODE_VERSION). Please upgrade: https://nodejs.org/"
  fi
else
  warn "Node.js not found."
  info "Attempting to install Node.js via nvm..."

  # Try to install via nvm
  if command -v nvm &> /dev/null || [ -s "$HOME/.nvm/nvm.sh" ]; then
    [ -s "$HOME/.nvm/nvm.sh" ] && source "$HOME/.nvm/nvm.sh"
    nvm install 20 && nvm use 20
    ok "Node.js $(node --version) installed via nvm"
  elif command -v curl &> /dev/null; then
    info "Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"
    nvm install 20 && nvm use 20
    ok "Node.js $(node --version) installed via nvm"
  else
    fail "Cannot install Node.js automatically. Please install Node.js 18+: https://nodejs.org/"
  fi
fi

# --- 2. Check npm ---
info "Checking npm..."

if command -v npm &> /dev/null; then
  ok "npm $(npm --version) found"
else
  fail "npm not found. It should come with Node.js. Please reinstall Node.js: https://nodejs.org/"
fi

# --- 3. Check Docker (for MongoDB) ---
info "Checking Docker..."

if command -v docker &> /dev/null; then
  if docker info &> /dev/null; then
    ok "Docker $(docker --version | cut -d' ' -f3 | tr -d ',') found and running"
  else
    warn "Docker is installed but not running. Start Docker before running the app."
  fi
else
  warn "Docker not found. MongoDB requires Docker (or a local/remote MongoDB instance)."
  warn "Install Docker: https://docs.docker.com/get-docker/"
  echo ""
  warn "You can still proceed — the app will build, but won't start without MongoDB."
fi

# --- 4. Install backend dependencies ---
echo ""
info "Installing backend dependencies..."

npm install --prefer-offline 2>&1 | tail -1
ok "Backend dependencies installed"

# --- 5. Install frontend dependencies ---
info "Installing frontend dependencies..."

cd client
npm install --prefer-offline 2>&1 | tail -1
ok "Frontend dependencies installed"

# --- 6. Build frontend ---
info "Building frontend..."

npx vite build 2>&1 | grep -E "✓|error" || true
if [ -d "dist" ]; then
  ok "Frontend built successfully (client/dist/)"
else
  fail "Frontend build failed. Check the output above for errors."
fi

cd ..

# --- 7. Summary ---
echo ""
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}  ✓ Installation complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""
echo -e "  To ${CYAN}start the application${NC}:"
echo ""
echo -e "    ${YELLOW}./start.sh${NC}"
echo ""
echo -e "  This will:"
echo -e "    1. Start MongoDB in Docker (port 27017)"
echo -e "    2. Start the backend API (port 3000)"
echo -e "    3. Start the frontend dev server (port 5173)"
echo ""
echo -e "  To ${CYAN}seed sample data${NC} (optional, first time only):"
echo ""
echo -e "    ${YELLOW}npm run seed${NC}"
echo ""
echo -e "  To ${CYAN}stop everything${NC}:"
echo ""
echo -e "    ${YELLOW}./stop.sh${NC}"
echo ""
echo -e "  Access the app at: ${CYAN}http://localhost:5173${NC}"
echo ""
