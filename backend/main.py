from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import speechbrain as sb
from speechbrain.inference import EncoderDecoderASR
import os
import io

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ASR model
asr_model = EncoderDecoderASR.from_hparams(
    source="speechbrain/asr-conformer-transformerlm-librispeech",
    run_opts={"device": "cpu"}
)

@app.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    if not audio:
        raise HTTPException(status_code=400, detail="No audio file provided")
    
    print(f"Received audio file: {audio.filename}")
    
    # Create temp directory if it doesn't exist
    os.makedirs("temp", exist_ok=True)
    temp_path = "temp/temp.wav"
    
    try:
        # Save uploaded file temporarily
        content = await audio.read()
        print(f"File size: {len(content)} bytes")
        with open(temp_path, "wb") as buffer:
            buffer.write(content)
        
        # Transcribe using SpeechBrain
        text = asr_model.transcribe_file(temp_path)
        print(f"Transcribed text: {text}")
        
        return {"text": text}
    except Exception as e:
        print(f"Error processing audio: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path) 