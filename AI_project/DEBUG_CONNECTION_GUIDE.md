# 🔧 **How to Check Ollama Connection - DEBUG GUIDE**

## ✅ **Step 1: Check Ollama Status**
```powershell
# Test if Ollama is running
curl http://localhost:11434/api/version
# Should return: {"version":"0.10.1"} ✅

# Check available models  
curl http://localhost:11434/api/tags
# Should show your models ✅
```

## ❌ **Step 2: Check Backend Status** 
```powershell
# Test if backend is responding
curl http://localhost:8080/health
# Should return backend health info
# If you get "Unable to connect" → Backend is DOWN ❌
```

## 🚨 **Current Status:**
- ✅ **Ollama**: Working perfectly (version 0.10.1)
- ❌ **Backend**: DOWN - Not responding to requests

## 🔄 **How to Restart Backend Properly:**

### **Option 1: Using Startup Script**
```powershell
cd backend
.\start_windows.bat
```

### **Option 2: Manual Start**
```powershell
cd backend
python -m uvicorn open_webui.main:app --host 0.0.0.0 --port 8080
```

## 📊 **What to Look For During Startup:**
```
INFO:     Uvicorn running on http://0.0.0.0:8080
INFO:     Application startup complete
INFO:     Connected to Ollama at http://localhost:11434  ← This line is KEY!
```

## 🧪 **How to Test Connection After Restart:**

### **Test 1: Backend Health**
```powershell
curl http://localhost:8080/health
# Should return JSON with status info
```

### **Test 2: Ollama Integration**  
```powershell
curl http://localhost:8080/ollama/api/tags
# Should return the same models as direct Ollama call
```

### **Test 3: Chat API**
```powershell
# Test the actual chat endpoint
Invoke-RestMethod -Uri "http://localhost:8080/ollama/v1/chat/completions" -Method POST -Headers @{"Content-Type"="application/json"; "Authorization"="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjNGNjMzNmLTlkNjItNDc3NS1hZjI5LWZkMzFjYWY0NDFmOCJ9.91BTvnGe5Nc2Yn6Ut1Q1Y4r9sEOPuUAArLWtz5J3DFM"} -Body (@{model="llama3.2:latest"; messages=@(@{role="user"; content="hello"}); stream=$false} | ConvertTo-Json -Depth 10)
```

## 🚀 **Once Backend is Running, You'll See:**
- ✅ No more HTTP 400 errors
- ✅ Clean Python code (no type annotations)  
- ✅ All chat features working
- ✅ Debug/Fix/Run buttons working

## 📋 **Quick Connection Check Commands:**
```powershell
# All these should return 200 OK:
curl http://localhost:11434/api/version    # Ollama direct
curl http://localhost:8080/health          # Backend health  
curl http://localhost:8080/ollama/api/tags # Backend → Ollama proxy
```

**The issue is your backend stopped running, not the Ollama connection!**