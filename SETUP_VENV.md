# Virtual Environment Setup Guide

## Why Use a Virtual Environment?

A virtual environment (venv) isolates your project dependencies from your system Python, preventing conflicts between projects.

---

## Setup Instructions

### Windows (PowerShell)

#### Step 1: Create Virtual Environment

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
```

#### Step 2: Activate Virtual Environment

```powershell
# Activate venv (PowerShell)
.\venv\Scripts\Activate.ps1

# If you get an error about execution policy, run this first:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Your prompt should now show `(venv)` at the beginning.

#### Step 3: Install Dependencies

```powershell
# Upgrade pip first
python -m pip install --upgrade pip

# Install requirements
pip install -r requirements.txt
```

#### Step 4: Run Backend

```powershell
# Make sure you're still in backend directory with venv activated
uvicorn app.main:app --reload --port 8000
```

#### Step 5: Deactivate (when done)

```powershell
deactivate
```

---

### Windows (Command Prompt)

```cmd
cd backend
python -m venv venv
venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

### Linux / macOS

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## Troubleshooting

### "Cannot be loaded because running scripts is disabled"

**Error:**
```
.\venv\Scripts\Activate.ps1 cannot be loaded because running scripts is disabled on this system.
```

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try activating again.

### "Python was not found"

Make sure Python is installed and in your PATH:
```powershell
python --version
```

Should show Python 3.9 or higher.

### Packages won't install

```powershell
# Upgrade pip
python -m pip install --upgrade pip

# Try installing again
pip install -r requirements.txt
```

### Still getting Rust/compilation errors?

The updated `requirements.txt` should fix this. If you still see errors:

1. Make sure your Python version is 3.9-3.13
2. Make sure pip is updated: `python -m pip install --upgrade pip`
3. Try installing packages one by one:
   ```powershell
   pip install fastapi
   pip install uvicorn[standard]
   pip install pydantic
   pip install pydantic-settings
   ```

---

## Verification

After installation, verify everything works:

```powershell
# Should show no errors
python -c "import fastapi, uvicorn, pydantic; print('All imports successful!')"
```

---

## Quick Reference

```powershell
# Create venv (once)
python -m venv venv

# Activate venv (every time you work)
.\venv\Scripts\Activate.ps1   # PowerShell
# OR
venv\Scripts\activate.bat      # Command Prompt

# Install/update packages
pip install -r requirements.txt

# Run backend
uvicorn app.main:app --reload --port 8000

# Deactivate when done
deactivate
```

---

## For Frontend (Optional but Recommended)

Frontend doesn't need venv (uses npm), but you can use **nvm** (Node Version Manager) for similar isolation:

```powershell
# Frontend setup
cd frontend
npm install
npm run dev
```

---

## IDE Integration

### VS Code

VS Code should automatically detect the venv. If not:
1. Press `Ctrl+Shift+P`
2. Type "Python: Select Interpreter"
3. Choose the one with `venv` in the path

### PyCharm

1. File → Settings → Project → Python Interpreter
2. Add Interpreter → Existing
3. Select `backend/venv/Scripts/python.exe`

---

**Remember:** Always activate the venv before working on the backend!

