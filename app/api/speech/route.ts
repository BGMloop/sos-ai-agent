import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const formData = await req.formData();
  const audioFile = formData.get('audio') as File;

  // Create new FormData for the backend request
  const backendFormData = new FormData();
  backendFormData.append('audio', audioFile);

  const response = await fetch('http://localhost:8000/transcribe', {
    method: 'POST',
    body: backendFormData
  });

  const data = await response.json();
  return NextResponse.json(data);
} 