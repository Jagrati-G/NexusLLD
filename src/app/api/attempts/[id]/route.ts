import { NextResponse } from 'next/server';
import { getAttemptUseCase } from '../../../../infrastructure/di/container';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const attempt = await getAttemptUseCase.execute(id);
    return NextResponse.json(attempt);
  } catch (error: any) {
    if (error.message === 'Attempt not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
