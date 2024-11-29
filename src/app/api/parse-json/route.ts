import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Extract the JSON string from the request body
    const { jsonString } = await request.json();

    // Ensure the JSON string is present
    if (!jsonString) {
      return NextResponse.json(
        { error: 'Invalid input: JSON string is required' },
        { status: 400 },
      );
    }

    // Parse the JSON string
    const parsedJson = JSON.parse(jsonString);

    // Send the parsed JSON object back as a response
    return NextResponse.json({ ...parsedJson }, { status: 200 });
  } catch (error) {
    // Handle any parsing errors
    console.error('Error parsing JSON string:', error);
    return NextResponse.json({ error: 'Invalid JSON string' }, { status: 400 });
  }
}
