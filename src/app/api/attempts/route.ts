import { NextResponse } from 'next/server';
import { submitAttemptUseCase, evaluateAttemptUseCase } from '../../../infrastructure/di/container';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { problemId, userId, code } = body;

    if (!problemId || !userId || !code) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const attempt = await submitAttemptUseCase.execute(problemId, userId, code);
    
    // Kick off evaluation asynchronously (Background Worker Mock)
    // We don't await this so the request returns immediately
    evaluateAttemptUseCase.execute(attempt.id).catch(err => console.error('Evaluation failed:', err));

    return NextResponse.json({ attemptId: attempt.id, status: attempt.status }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
