import sounddevice as sd
import soundfile as sf
import numpy as np
import sys

def record_audio(duration=5, filename="test_audio.wav"):
    """Record audio from microphone and save to WAV file."""
    try:
        # Recording parameters
        sample_rate = 16000
        channels = 1
        
        print(f"Recording {duration} seconds of audio...")
        recording = sd.rec(
            int(duration * sample_rate),
            samplerate=sample_rate,
            channels=channels,
            dtype=np.float32
        )
        
        # Wait for recording to complete
        sd.wait()
        
        # Save recording
        sf.write(filename, recording, sample_rate)
        print(f"Audio saved to {filename}")
        return True
        
    except Exception as e:
        print(f"Error recording audio: {str(e)}")
        return False

if __name__ == "__main__":
    duration = float(sys.argv[1]) if len(sys.argv) > 1 else 5
    record_audio(int(duration)) 