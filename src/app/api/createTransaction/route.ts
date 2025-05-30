// app/api/createTransaction/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const body = await req.json();
 const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const response = await fetch('http://localhost:8080/transaction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
