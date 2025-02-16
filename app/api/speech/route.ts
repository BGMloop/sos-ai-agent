import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const formData = await req.formData();
  const audioFile = formData.get('audio') as File;

  const response = await fetch('http://localhost:8000/transcribe', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  return NextResponse.json(data);
} 