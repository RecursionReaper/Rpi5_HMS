## 🛠 Prerequisites

Before running the commands, make sure you have the following installed:

- Python 3.7+
- `virtualenv` or `venv`
- FastAPI and Uvicorn installed in your virtual environment
- A `yolo.py` file containing a FastAPI app instance named `app`

## 📦 Step 1: Activate the Virtual Environment

To activate the virtual environment, run the following command:

```bash
source yolo_object/bin/activate
```

## 🚀 Step 2: Run the Server
Once the virtual environment is activated, start the FastAPI server using Uvicorn by running:

```bash
uvicorn yolo:app --host 0.0.0.0 --port 8000 --workers 1
```

Explanation:

uvicorn: Uvicorn is an ASGI server used to run the FastAPI application.

yolo:app: Tells Uvicorn to import the app object from the yolo.py module (or any equivalent file). Make sure your FastAPI app is defined in yolo.py and named app.

--host 0.0.0.0: Makes the server accessible on all available network interfaces (useful for accessing it over LAN or remotely).

--port 8000: The server will listen on port 8000.

--workers 1: This option sets the number of worker processes to 1. This can be increased for production deployment but is typically kept at 1 during development.
