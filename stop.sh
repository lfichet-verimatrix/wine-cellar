#!/bin/bash
# stop.sh — Stop all components of the Wine Cellar app

echo "🍷 Wine Cellar — Stopping..."

# Helper: kill a process and all its children
kill_tree() {
  local pid=$1
  # Kill child processes first
  pkill -P "$pid" 2>/dev/null
  # Then kill the parent
  kill "$pid" 2>/dev/null
}

# 1. Stop frontend
if [ -f /tmp/wine-cellar-frontend.pid ]; then
  FRONTEND_PID=$(cat /tmp/wine-cellar-frontend.pid)
  if kill -0 $FRONTEND_PID 2>/dev/null; then
    kill_tree $FRONTEND_PID
    echo "✓ Frontend stopped (PID: $FRONTEND_PID)"
  else
    echo "· Frontend was not running"
  fi
  rm -f /tmp/wine-cellar-frontend.pid
else
  echo "· Frontend PID file not found"
fi

# Fallback: kill any remaining vite processes for this project
pkill -f "vite.*--port 5173" 2>/dev/null

# 2. Stop backend
if [ -f /tmp/wine-cellar-backend.pid ]; then
  BACKEND_PID=$(cat /tmp/wine-cellar-backend.pid)
  if kill -0 $BACKEND_PID 2>/dev/null; then
    kill_tree $BACKEND_PID
    echo "✓ Backend stopped (PID: $BACKEND_PID)"
  else
    echo "· Backend was not running"
  fi
  rm -f /tmp/wine-cellar-backend.pid
else
  echo "· Backend PID file not found"
fi

# Fallback: kill any remaining backend processes
pkill -f "node src/server.js" 2>/dev/null

# 3. Stop MongoDB (optional — keep data for next run)
if docker ps --format '{{.Names}}' | grep -q '^mongo-wine-cellar$'; then
  docker stop mongo-wine-cellar > /dev/null
  echo "✓ MongoDB stopped"
else
  echo "· MongoDB was not running"
fi

# Clean up log files
rm -f /tmp/wine-cellar-backend.log /tmp/wine-cellar-frontend.log

echo ""
echo "All components stopped."
