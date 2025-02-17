import sounddevice as sd
import soundfile as sf
import sys

def record_audio(duration=5):
    fs = 16000  # Sample rate
    recording = sd.rec(int(duration * fs), samplerate=fs, channels=1)
    sd.wait()  # Wait until recording is finished
    sf.write('test_audio.wav', recording, fs)

if __name__ == "__main__":
    duration = float(sys.argv[1]) if len(sys.argv) > 1 else 5
    record_audio(duration) 