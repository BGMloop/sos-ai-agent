import { spawn } from 'child_process';

export async function recordAudio(duration: number = 5): Promise<string> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['backend/record_audio.py', duration.toString()]);

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error: ${data}`);
      reject(new Error(data.toString()));
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve('test_audio.wav');
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });
}