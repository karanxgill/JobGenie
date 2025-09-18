#!/bin/bash

# Start Server Script for JobGenie
# This script starts the JobGenie server and checks if it's running

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}JobGenie Server Starter${NC}"
echo "==============================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed.${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if server directory exists
if [ ! -d "server" ]; then
    echo -e "${RED}Error: Server directory not found.${NC}"
    echo "Make sure you're running this script from the JobGenie root directory."
    exit 1
fi

# Check if server.js exists
if [ ! -f "server/server.js" ]; then
    echo -e "${RED}Error: server.js not found.${NC}"
    echo "Make sure the server.js file exists in the server directory."
    exit 1
fi

# Check if server is already running
if lsof -i :3000 &> /dev/null; then
    echo -e "${YELLOW}Server is already running on port 3000.${NC}"
    echo "You can access the API at http://localhost:3000/api"
    echo ""
    echo "To stop the server, run: kill $(lsof -t -i:3000)"
    exit 0
fi

# Install dependencies if needed
if [ ! -d "server/node_modules" ]; then
    echo -e "${YELLOW}Installing server dependencies...${NC}"
    cd server && npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error installing dependencies.${NC}"
        exit 1
    fi
    cd ..
fi

# Start the server
echo -e "${GREEN}Starting JobGenie server...${NC}"
cd server && node server.js &

# Wait for server to start
echo "Waiting for server to start..."
sleep 3

# Check if server started successfully
if lsof -i :3000 &> /dev/null; then
    echo -e "${GREEN}Server started successfully!${NC}"
    echo "You can access the API at http://localhost:3000/api"
    echo ""
    echo "To stop the server, run: kill $(lsof -t -i:3000)"
else
    echo -e "${RED}Failed to start server.${NC}"
    echo "Check the server logs for errors."
fi
