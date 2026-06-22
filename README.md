# 🇱🇰 LankaLens: Spatial Audio Documentaries

LankaLens is an AI-powered exploration application that transforms visual captures of Sri Lankan historical monuments, natural reserves, and landmarks into immersive, 45-second spatial audio documentaries. 

The system leverages Google's **Gemini 2.5 Flash** model for multimodal historical analysis and pairs it with a native mobile client featuring real-time audio visualization and synchronized progressive text tracking.

---

## 🚀 Key Features


### 🧠 FastAPI Backend Pipeline
* **Multimodal Core:** Extracts geographical and visual insight from image buffers with fallback logic for missing GPS inputs.
* **Deterministic Output Execution:** Mandates a strict `Pydantic` JSON schema from the Gemini model to eliminate API structural drift.
* **Zero-Overhead TTS:** Generates high-fidelity streaming audio narrations dynamically via `gTTS` with instant base64 encoding wrapper transport layers.

### 📱 React Native Mobile Client
* **Custom Typography Styling:** Integrated elegant `PlayfairDisplay` serif variable fonts across navigation layouts for authentic cultural presentation.
* **Gemini-Style Text Synch:** Features a progressive syllable tracking highlight mechanism mirroring premium conversational AI platforms.
* **Dynamic Waveform Engine:** Animates a multi-stave vector audio canvas powered completely via native UI driver hooks.
* **Intelligent Audio Caching:** Saves base64 audio packages to native temporary directories to guarantee skip-free local playback.

---

## 📂 Repository Structure

LANKALENS/
├── .github/                  # GitHub Actions CI/CD workflows context
├── backend/                  # FastAPI Web Pipeline Engine
│   ├── __pycache__/
│   ├── venv/                 # Python local virtual isolated environment
│   └── main.py               # Application entrypoint & endpoint routing
├── frontend/                 # React Native Mobile Client Application
│   ├── android/              # Native Android project configuration folder
│   ├── ios/                  # Native iOS project configuration folder
│   ├── node_modules/         # Node ecosystem vendor code modules
│   ├── src/
│   │   ├── assests/          # Local static resources wrapper
│   │   │   ├── fonts/        # PlayfairDisplay typography suite (.ttf files)
│   │   │   └── images/       # Operational PNG icon targets (play, pause, home)
│   │   ├── components/
│   │   ├── screens/          # Application view controllers
│   │   │   ├── CameraScreen.tsx
│   │   │   ├── LandingScreen.tsx
│   │   │   ├── LoadingScreen.tsx
│   │   │   ├── PreviewScreen.tsx
│   │   │   ├── ProcessingScreen.tsx
│   │   │   └── ResultScreen.tsx
│   │   └── theme/            # Shared color and design system presets
│   ├── App.tsx               # Main mobile core entrypoint & stack navigator
│   ├── package.json          # Node script & dependency registry
│   └── tsconfig.json         # TypeScript compiler configurations
├── LankaLens+.mp4            # Application app demo presentation media
└── README.md                 # Project configuration manual

---

## 🛠️ Local Setup & Installation

**1. Prerequisites**
Python: 3.10 or higher installed.

Node.js: 18.x or higher installed.

Mobile Environment: Android Studio Emulator / physical test unit configured.

API Access: A valid Google Gemini API Key.

**2. Backend Configuration (FastAPI)**
Navigate to the backend directory:

```bash
*Bash*
cd backend
Activate your pre-configured local virtual environment:


*Bash*
Windows (Command Prompt / PowerShell):
venv\Scripts\activate
macOS/Linux:
source venv/bin/activate
Ensure dependencies are fully satisfied:

*Bash*
pip install fastapi uvicorn google-genai pydantic gTTS
Inject your secret Gemini Key into your local terminal process window:

*Bash*
Windows (PowerShell):
$env:GEMINI_API_KEY="your_actual_api_key_here"(run this on terminal before running your python file.)
macOS/Linux:
export GEMINI_API_KEY="your_actual_api_key_here"

***Launch the local development pipeline server instance:***

*Bash*
python main.py
The backend will start processing actively at http://localhost:8000.

**3. Frontend Configuration (React Native)**
Navigate to the frontend directory:

```bash
*Bash*
cd ../frontend
Compile node modules packages if workspace assets require reset updates:

```bash
*Bash*
npm install
Initialize the development bundler link and execute native platform compilation:

```bash
*Bash*
npm run android




