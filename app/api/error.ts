import { NextResponse } from 'next/server';

export function errorHandler(error: unknown) {
  console.error('API Error:', error);
  
  if (error instanceof Response) {
    return error;
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
