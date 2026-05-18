
# Requirements

- Python 3.12
- Working database

# Installation

## 1. Create a virtual environment

```
python -m venv .venv
```

## 3.Activate the virtual environment

### Windows (PowerShell)

```
.venv/Scripts/Activate.ps1
```

### Linux / macOS

```
source .venv/bin/activate
```

## 3. (Optional) Configure Visual Studio Code

1.  Open the Command Palette
	```
	Ctrl + Shift + P
	```
2.  Type:
    
    ```
    Python: Select Interpreter
    ```
    
3.  Select:
    
    ```
    .venv/Scripts/python.exe
    ```
   
## 4. Install dependencies

```
pip install -r requirements.txt
```

## 5. Create .env file

1.  Copy the .env.example file as .env file

2.  Fill out the missing variables with your environment values

