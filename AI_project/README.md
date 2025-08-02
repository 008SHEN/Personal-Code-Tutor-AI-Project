# Code Tutor AI

A React-based frontend for a code tutor AI agent that connects to Ollama (localhost:11434) via FastAPI backend.

## 🎯 Quick Installation (3 Steps)

1. **Install Prerequisites**: Python 3.11+, Node.js 18+, Ollama
2. **Run Setup**: `pip install -r backend/requirements.txt && npm install`
3. **Start App**: `ollama serve` → `.\start-app.bat` (Windows) or `./start-app.sh` (Linux/Mac)

Then open: http://localhost:5173

### 🔍 Check Your Setup
Run this first to verify all requirements are installed:
- **Windows**: `.\check-requirements.bat`
- **Linux/Mac**: `chmod +x check-requirements.sh && ./check-requirements.sh`

## Features

- **Chat Interface**: Clean, minimalist chat UI with dark theme
- **Code Highlighting**: Syntax highlighting for multiple programming languages
- **Programming-Only Conversations**: Filters out non-programming related questions
- **Auto Debug**: Automatically analyze code for bugs and issues
- **Auto Fix**: Generate corrected versions of problematic code
- **Auto Run**: Execute JavaScript code directly in the browser
- **Copy Code**: Easy code copying functionality

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Code Highlighting**: react-syntax-highlighter
- **Markdown**: react-markdown
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Project Structure

```
src/
├── components/
│   ├── ChatInterface.tsx      # Main chat component
│   ├── MessageList.tsx        # Message display with code highlighting
│   ├── CodeActions.tsx        # Debug/Fix/Run buttons for code blocks
│   └── ExecutionResult.tsx    # Code execution results display
├── services/
│   ├── api.ts                 # API service for backend communication
│   └── codeExecutor.ts        # Code execution and prompt generation
├── App.tsx                    # Main app component
├── main.tsx                   # App entry point
└── index.css                  # Global styles + Tailwind imports
```

## 🚀 Complete Setup Instructions

### Prerequisites

Before running the Code Tutor AI, you need to install:

1. **Python 3.11+** - [Download Python](https://www.python.org/downloads/)
2. **Node.js 18+** - [Download Node.js](https://nodejs.org/)
3. **Ollama** - [Download Ollama](https://ollama.ai/) for running local AI models
4. **Git** - [Download Git](https://git-scm.com/) (if cloning the repository)

### Step 1: Install Ollama and Download Models

1. **Install Ollama**:
   - Download and install Ollama from https://ollama.ai/
   - Verify installation: `ollama --version`

2. **Download AI Models**:
   ```bash
   # Download recommended models (choose one or more)
   ollama pull llama3.2:latest          # Fast, good for coding
   ollama pull codellama:latest         # Specialized for code
   ollama pull deepseek-coder:latest    # Excellent for programming
   ```

3. **Start Ollama** (keep running in background):
   ```bash
   ollama serve
   ```
   #curl http://localhost:11434


### Step 2: Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the FastAPI backend**:
   ```bash
   # Option 1: Using uvicorn directly (recommended)
   python -m uvicorn open_webui.main:app --host 0.0.0.0 --port 8080 --reload

   # Option 2: Using the provided script (Windows)
   .\start_windows.bat
   ```

4. **Wait for initialization** (first run takes 5-10 minutes):
   - Database migrations will run automatically
   - AI embedding models will be downloaded (~500MB)
   - Server will start on `http://localhost:8080`

### Step 3: Frontend Setup

1. **Open a new terminal** and navigate to project root:
   ```bash
   cd .. # (if you're in backend directory)
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Start the React development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   - Navigate to `http://localhost:5173`
   - You should see the Code Tutor AI interface

### Step 4: Test the Setup

1. **Backend Health Check**:
   ```bash
   curl http://localhost:8080/health
   ```

2. **Try the AI Tutor**:
   - Go to `http://localhost:5173`
   - Type a programming question like: "How do I reverse a string in Python?"
   - The AI should respond with code examples and explanations

## 🔧 First Run - What to Expect

**Backend startup** (5-10 minutes first time):
```
✅ Database migrations running...
✅ Downloading AI embedding models...
✅ Server starting on http://0.0.0.0:8080
✅ Open WebUI banner appears
✅ Ready to accept connections!
```

**Frontend startup** (30 seconds):
```
✅ Installing dependencies...
✅ Starting Vite dev server...
✅ Frontend ready at http://localhost:5173
```

### Backend Connection

The frontend connects to the FastAPI backend via proxy configuration in `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
    '/v1': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

## AI Tutor Behavior

The AI is configured with a system prompt that ensures it:

1. **Only responds to programming-related questions**
2. **Provides correct code solutions**
3. **Includes clear explanations**  
4. **Shows Big-O complexity for algorithms**
5. **Uses beginner-friendly language**
6. **Offers corrected versions for buggy code**

### Supported Languages

- Python
- JavaScript/TypeScript
- C++
- Java
- Go
- Rust
- And many more...

## Code Features

### Auto Debug
Click the "Debug" button on any code block to get:
- Syntax error analysis
- Logic error detection
- Performance issue identification
- Best practice suggestions

### Auto Fix
Click the "Fix" button to get:
- Corrected code versions
- Explanations of what was fixed
- Improved implementations

### Auto Run (JavaScript only)
Click the "Run" button to execute JavaScript code directly in the browser with:
- Console output capture
- Error handling
- Execution time measurement

## Development

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Configuration

### Change Ollama Model

Edit `src/services/api.ts` and modify the `model` field in the `sendMessage` function:

```typescript
const response = await api.post('/v1/chat/completions', {
  model: 'your-preferred-model:latest', // Change this
  // ...
})
```

### Customize System Prompt

Modify the `SYSTEM_PROMPT` constant in `src/services/api.ts` to customize the AI's behavior.

## ⚡ Quick Start Commands

### Option 1: One-Click Start (Recommended)

**Windows**:
```bash
# Start Ollama first (in separate terminal)
ollama serve

# Then run the quick start script
.\start-app.bat
```

**Linux/Mac**:
```bash
# Start Ollama first (in separate terminal)
ollama serve

# Then run the quick start script
chmod +x start-app.sh
./start-app.sh
```

### Option 2: Manual Start

**Terminal 1** (Ollama):
```bash
ollama serve
```

**Terminal 2** (Backend):
```bash
cd backend
python -m uvicorn open_webui.main:app --host 0.0.0.0 --port 8080 --reload
```

**Terminal 3** (Frontend):
```bash
npm run dev
```

## 🔍 Troubleshooting

### Common Issues & Solutions

#### ❌ "HTTP undefined: Network Error"
**Problem**: Backend not running
**Solution**: 
```bash
cd backend
python -m uvicorn open_webui.main:app --host 0.0.0.0 --port 8080
```

#### ❌ "No models found" or "Model not available"
**Problem**: Ollama models not installed
**Solution**:
```bash
ollama pull llama3.2:latest
ollama list  # Verify model is installed
```

#### ❌ Backend takes forever to start
**Problem**: First-time model downloads
**Solution**: Wait 5-10 minutes - models are downloading (~500MB)

#### ❌ Port 8080 already in use
**Problem**: Another service using port 8080
**Solution**: 
```bash
# Find and kill process using port 8080
netstat -ano | findstr :8080
taskkill /PID <PID_NUMBER> /F

# Or use a different port
python -m uvicorn open_webui.main:app --host 0.0.0.0 --port 8081
```

#### ❌ CORS errors in browser
**Problem**: Cross-origin request blocked
**Solution**: Start backend with CORS settings:
```bash
$env:CORS_ALLOW_ORIGIN="http://localhost:5173"
python -m uvicorn open_webui.main:app --host 0.0.0.0 --port 8080
```

### Performance Optimization

#### Install optional packages for better performance:
```bash
# For faster model downloads
pip install huggingface_hub[hf_xet]

# For audio processing (optional)
# Install FFmpeg from https://ffmpeg.org/
```

### System Requirements

- **RAM**: Minimum 8GB (16GB recommended for larger models)
- **Storage**: 5GB free space (for models and dependencies)
- **CPU**: Any modern processor (GPU acceleration optional)
- **OS**: Windows 10+, macOS 10.15+, or Linux

### Backend Connection Issues

1. **Check if backend is running**:
   ```bash
   curl http://localhost:8080/health
   ```

2. **Verify Ollama is accessible**:
   ```bash
   curl http://localhost:11434/api/version
   ```

3. **List available models**:
   ```bash
   ollama list
   ```

### Code Execution Issues

- **JavaScript**: Runs directly in browser ✅
- **Python**: Requires Pyodide setup (not included) ⚠️
- **Other languages**: Display only (no execution) ℹ️

### Development Mode

For development with auto-reload:
```bash
# Backend with reload
cd backend
python -m uvicorn open_webui.main:app --host 0.0.0.0 --port 8080 --reload

# Frontend with hot reload
npm run dev
```

## License

This project is part of an AI assistant system for code tutoring and debugging.


# # 1. Check Ollama
curl http://localhost:11434/api/version
# Should return: {"version":"0.10.1"}

# 2. Check Backend
curl http://localhost:8080/health  
# Should return: {"status":true}

# 3. Check Frontend
# Visit localhost:5173 - should load without errors
# ollama run mistral
