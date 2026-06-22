import os
import base64
import io
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
from gtts import gTTS

app = FastAPI(
    title="LankaLens Backend",
    description="Production-grade AI pipeline for Sri Lankan Spatial Audio Documentaries"
)

# Enable CORS for React Native Emulator communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the new Google GenAI client
# Crucial: Secure your API key by loading it from the system environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "YOUR_NEW_API_KEY_HERE")
client = genai.Client(api_key=GEMINI_API_KEY)

# Strict Pydantic JSON structure ensuring reliable UI rendering in React Native
class AIResponseSchema(BaseModel):
    identified_location: str
    historical_script: str

@app.get("/")
def read_root():
    return {"status": "LankaLens API is operational"}

@app.post("/api/process-exploration")
async def process_exploration(
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    image: UploadFile = File(...)
):
    try:
        # 1. Read the uploaded image bytes (works for camera capture or gallery uploads)
        image_bytes = await image.read()
        
        # Build spatial context string if GPS data exists
        gps_context = f"The user's current GPS coordinates are: Latitude {latitude}, Longitude {longitude}." if latitude and longitude else "GPS data is unavailable for this image; rely purely on visual details."

        # The system instruction telling the AI exactly how to behave as an elite Lankan guide
        system_instruction = (
            "You are an expert Sri Lankan historian, archeologist, and elite tour guide. "
            "Analyze this image. "
            f"{gps_context} "
            "Identify the exact monument, building, nature reserve, or historical location in Sri Lanka. "
            "Generate a fascinating, high-quality 45-second audio documentary script. Speak directly to the explorer. "
            "Incorporate interesting architectural details, cultural stories, and a captivating tone. "
            "Return ONLY a JSON object matching this exact schema:\n"
            "{\n"
            '  "identified_location": "Name of the location",\n'
            '  "historical_script": "The spoken narrative text"\n'
            "}"
        )

        # 2. Package raw image bytes into the new Part structure
        image_part = types.Part.from_bytes(
            data=image_bytes,
            mime_type=image.content_type,
        )
        
        # 3. Call the updated generate_content API on the models service
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[image_part],
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json"
            ),
        )
        
        # Parse text into our validated Python object
        data_packet = AIResponseSchema.model_validate_json(response.text)
        
        # 4. Synthesize script to speech via gTTS (Free tier)
        tts = gTTS(text=data_packet.historical_script, lang='en', tld='com', slow=False)
        
        # Write to memory stream (0ms disk overhead, completely free)
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        
        # Encode binary audio data to base64 string for safe transport
        base64_audio = base64.b64encode(audio_buffer.read()).decode('utf-8')
        
        return {
            "success": True,
            "location_name": data_packet.identified_location,
            "narration_text": data_packet.historical_script,
            "audio_base64": f"data:audio/mp3;base64,{base64_audio}"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)