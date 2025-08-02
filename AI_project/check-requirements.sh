#!/bin/bash

echo "================================"
echo "  Code Tutor AI - Requirements Check"
echo "================================"
echo

all_good=1

# Check Python
echo "[1/4] Checking Python..."
if command -v python3 &> /dev/null; then
    python_version=$(python3 --version 2>&1)
    echo "✅ $python_version"
elif command -v python &> /dev/null; then
    python_version=$(python --version 2>&1)
    echo "✅ $python_version"
else
    echo "❌ Python not found. Install Python 3.11+ from https://www.python.org/"
    all_good=0
fi

# Check Node.js
echo "[2/4] Checking Node.js..."
if command -v node &> /dev/null; then
    node_version=$(node --version)
    echo "✅ Node.js found: $node_version"
else
    echo "❌ Node.js not found. Install Node.js 18+ from https://nodejs.org/"
    all_good=0
fi

# Check npm
echo "[3/4] Checking npm..."
if command -v npm &> /dev/null; then
    npm_version=$(npm --version)
    echo "✅ npm found: $npm_version"
else
    echo "❌ npm not found. It should come with Node.js"
    all_good=0
fi

# Check Ollama
echo "[4/4] Checking Ollama..."
if command -v ollama &> /dev/null; then
    ollama_version=$(ollama --version 2>&1 | grep -o 'ollama version [0-9.]*' | cut -d' ' -f3)
    echo "✅ Ollama found: $ollama_version"
else
    echo "❌ Ollama not found. Install from https://ollama.ai/"
    all_good=0
fi

echo
echo "================================"

if [ "$all_good" -eq 1 ]; then
    echo "✅ All requirements satisfied!"
    echo "You can now run: ./start-app.sh"
else
    echo "❌ Please install missing requirements above"
fi

echo "================================"
echo