import { NextResponse } from 'next/server';
import { getProblemUseCase, problemRepository } from '../../../infrastructure/di/container';
import { Problem } from '../../../domain/entities/Problem';

export async function GET() {
  try {
    const problems = await getProblemUseCase.execute();
    return NextResponse.json(problems);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    const problem = Problem.create(
      id,
      body.title,
      body.statement,
      body.constraints || [],
      body.rubricContracts || [],
      body.baselineExpectations || []
    );
    await problemRepository.save(problem);
    return NextResponse.json({ success: true, problem });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
