import { NextResponse } from 'next/server';
import { getProblemUseCase } from '../../../../infrastructure/di/container';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const problem = await getProblemUseCase.execute(id);
    return NextResponse.json(problem);
  } catch (error: any) {
    if (error.message === 'Problem not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
