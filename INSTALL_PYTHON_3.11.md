# Python 3.11.9 Installation Guide for ClipMind AI

## Current Status
- **Current Python Version**: 3.14.0
- **Required Python Version**: 3.11.9 (latest stable Python 3.11 release)
- **Status**: Python 3.11.9 is NOT installed

## Installation Steps

### Step 1: Download Python 3.11.9

1. Open your browser and navigate to:
   ```
   https://www.python.org/downloads/release/python-3119/
   ```

2. Scroll down to the "Files" section

3. Download the **Windows installer (64-bit)**:
   - File name: `python-3.11.9-amd64.exe`
   - Or use this direct link format:
     ```
     https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe
     ```

### Step 2: Install Python 3.11.9

1. **Run the installer** (`python-3.11.9-amd64.exe`)

2. **IMPORTANT**: Check the box at the bottom:
   ```
   ✅ Add python.exe to PATH
   ```

3. Click **"Customize installation"**

4. **Optional Features** page:
   - Keep all default options checked (documentation, pip, tcl/tk, etc.)
   - Click "Next"

5. **Advanced Options** page:
   - ✅ Install for all users (recommended)
   - ✅ Add Python to environment variables
   - Installation path: `C:\Python311` (or your preferred location)
   - Click "Install"

6. Wait for installation to complete (2-3 minutes)
   - Click "Close" when done

### Step 3: Verify Installation

**Open a NEW Command Prompt or PowerShell window** (important - must be new!)

Then run:
```bash
py -3.11 --version
```

Expected output:
```
Python 3.11.9
```

### Step 4: Create Virtual Environment for ClipMind AI

Once Python 3.11.9 is installed, run these commands:

```bash
# Navigate to backend folder
cd D:\ClipMind AI\backend

# Create virtual environment with Python 3.11
py -3.11 -m venv venv

# Activate virtual environment
# For Command Prompt:
venv\Scripts\activate

# For PowerShell:
.\venv\Scripts\Activate.ps1
```

### Step 5: Install Dependencies

```bash
# Upgrade pip
py -3.11 -m pip install --upgrade pip

# Install from requirements.txt
py -3.11 -m pip install -r requirements.txt
```

## Your Current requirements.txt

Your project has these dependencies:
```
fastapi==0.111.0
uvicorn==0.30.1
sqlalchemy==2.0.30
psycopg2-binary==2.9.9
python-jose[cryptography]==3.3.0
bcrypt==5.0.0
python-multipart==0.0.9
pydantic==2.7.1
pydantic-settings==2.3.3
python-dotenv==1.0.0
email-validator==2.1.1
openai-whisper==20231117
transformers==4.41.2
torch==2.3.1
accelerate==0.31.0
sentencepiece==0.2.0
```

These versions are compatible with Python 3.11.

## Troubleshooting

### If Python 3.11 is not found after installation:
1. Restart your computer
2. Open a NEW terminal/command prompt
3. Try `py -3.11 --version` again

### If you get permission errors:
- Run Command Prompt as Administrator
- Or use PowerShell with Administrator privileges

### If pip install fails:
```bash
# Try installing with --no-cache-dir
py -3.11 -m pip install --no-cache-dir -r requirements.txt
```

## Next Steps After Installation

Once Python 3.11.9 is installed and the virtual environment is set up:
1. Test that FastAPI starts correctly
2. Verify that transformers and torch import without errors
3. Test Whisper functionality
4. Run any existing tests

## Notes

- Python 3.11 has better performance and memory efficiency than 3.14
- All your AI/ML libraries (PyTorch, Transformers, Whisper) are fully compatible with Python 3.11
- The virtual environment will keep your Python 3.11 dependencies isolated