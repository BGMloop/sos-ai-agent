from speechbrain.inference import EncoderDecoderASR
import torchaudio

def test_asr():
    # Initialize the ASR model
    asr_model = EncoderDecoderASR.from_hparams(
        source="speechbrain/asr-conformer-transformerlm-librispeech",
        run_opts={"device": "cpu"}
    )

    try:
        # Load a test audio file (you can use any .wav file)
        # Replace with path to your test audio file
        audio_path = "test_audio.wav"
        waveform, sr = torchaudio.load(audio_path)
        
        # Transcribe
        text = asr_model.transcribe_file(audio_path)
        print(f"Transcription: {text}")
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    test_asr() 