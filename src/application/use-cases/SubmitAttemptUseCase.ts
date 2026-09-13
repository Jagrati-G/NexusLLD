import { Attempt } from '../../domain/entities/Attempt';
import { Submission } from '../../domain/entities/Submission';
import { AttemptRepository } from '../../domain/repositories/AttemptRepository';
import { ProblemRepository } from '../../domain/repositories/ProblemRepository';
import { randomUUID } from 'crypto';

export class SubmitAttemptUseCase {
  constructor(
    private attemptRepository: AttemptRepository,
    private problemRepository: ProblemRepository
  ) {}

  public async execute(problemId: string, userId: string, code: string, rationale?: string): Promise<Attempt> {
    const problem = await this.problemRepository.findById(problemId);
    if (!problem) throw new Error('Problem not found');

    const submission = new Submission(code, rationale);
    if (!submission.isValid()) throw new Error('Invalid submission payload');

    const attempt = new Attempt(randomUUID(), problemId, userId);
    attempt.submit(submission);

    await this.attemptRepository.save(attempt);

    return attempt;
  }
}
