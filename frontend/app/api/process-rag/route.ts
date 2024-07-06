import { NextRequest, NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  console.log('API Endpoint:', apiEndpoint);

  if (!apiEndpoint) {
    throw new Error('API endpoint is not defined');
  }

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      body: formData,
    });

    console.log('Response from Flask:', response.status);
    const result = await response.json();
    console.log('Result from Flask:', result);

    if (response.ok) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: response.status });
    }
  } catch (error) {
    console.error('Error processing the files:', error);
    return NextResponse.json({ error: 'Error processing the files' }, { status: 500 });
  }
}