#!/bin/bash
# start.sh — Start all components of the Wine Cellar app

set -e

echo "🍷 Wine Cellar — Starting..."

# 1. Start MongoDB (Docker)
if docker ps --format '{{.Names}}' | grep -q '^mongo-wine-cellar$'; then
  echo "✓ MongoDB already running"
else
  if docker ps -a --format '{{.Names}}' | grep -q '^mongo-wine-cellar$'; then
    echo "→ Starting existing MongoDB container..."
    docker start mongo-wine-cellar > /dev/null
  else
    echo "→ Creating MongoDB container..."
    docker run -d --name mongo-wine-cellar -p 27017:27017 mongo:7 > /dev/null
    sleep 2
  fi
  echo "✓ MongoDB started on port 27017"
fi

# 2. Start backend
echo "→ Starting backend on port 3000..."
node src/server.js > /tmp/wine-cellar-backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > /tmp/wine-cellar-backend.pid
sleep 1

if kill -0 $BACKEND_PID 2>/dev/null; then
  echo "✓ Backend running (PID: $BACKEND_PID)"
else
  echo "✗ Backend failed to start. Check /tmp/wine-cellar-backend.log"
  exit 1
fi

# 3. Start frontend
echo "→ Starting frontend on port 5173..."
cd client && npx vite --port 5173 > /tmp/wine-cellar-frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > /tmp/wine-cellar-frontend.pid
sleep 2

if kill -0 $FRONTEND_PID 2>/dev/null; then
  echo "✓ Frontend running (PID: $FRONTEND_PID)"
else
  echo "✗ Frontend failed to start. Check /tmp/wine-cellar-frontend.log"
  exit 1
fi

echo ""
echo "═══════════════════════════════════════"
echo "  🍷 Wine Cellar is ready!"
echo ""
echo "  Frontend:  http://localhost:5173"
echo "  API:       http://localhost:3000"
echo "  MongoDB:   localhost:27017"
echo ""
echo "  Logs:"
echo "    Backend:  /tmp/wine-cellar-backend.log"
echo "    Frontend: /tmp/wine-cellar-frontend.log"
echo ""
echo "  Stop with: ./stop.sh"
echo "═══════════════════════════════════════"
