from speechbrain.pretrained import EncoderDecoderASR
import torchaudio
import os

def test_asr():
    try:
        print("Loading ASR model...")
        asr_model = EncoderDecoderASR.from_hparams(
            source="speechbrain/asr-crdnn-rnnlm-librispeech",
            savedir="pretrained_models/asr-crdnn-rnnlm-librispeech"
        )

        print("Checking for audio file...")
        audio_path = "test_audio.wav"
        if not os.path.exists(audio_path):
            print(f"Error: {audio_path} not found")
            return False

        print("Starting transcription...")
        text = asr_model.transcribe_file(audio_path)
        print(f"Transcription: {text}")
        return True

    except Exception as e:
        print(f"Error in ASR (detailed): {str(e)}")
        import traceback
        print(traceback.format_exc())
        return False

if __name__ == "__main__":
    test_asr() 