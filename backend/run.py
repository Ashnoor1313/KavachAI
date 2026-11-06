import os
import sys
from pathlib import Path
import uvicorn

# Ensure the backend directory is in sys.path
BASE_DIR = Path(__file__).parent.resolve()
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

if __name__ == "__main__":
    # Render assigns the PORT environment variable dynamically (e.g. 10000)
    port_env = os.environ.get("PORT") or os.environ.get("BACKEND_PORT") or "8000"
    try:
        port = int(port_env)
    except ValueError:
        port = 8000

    print(f"🚀 Starting Kavach AI Backend on 0.0.0.0:{port}...")
    uvicorn.run("main:app", app_dir=str(BASE_DIR), host="0.0.0.0", port=port)
