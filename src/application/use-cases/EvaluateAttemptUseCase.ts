import { AttemptRepository } from '../../domain/repositories/AttemptRepository';
import { ProblemRepository } from '../../domain/repositories/ProblemRepository';
import { EvaluationPipeline } from '../evaluation/EvaluationPipeline';

export class EvaluateAttemptUseCase {
  constructor(
    private attemptRepository: AttemptRepository,
    private problemRepository: ProblemRepository,
    private evaluationPipeline: EvaluationPipeline
  ) {}

  public async execute(attemptId: string): Promise<void> {
    const attempt = await this.attemptRepository.findById(attemptId);
    if (!attempt) throw new Error('Attempt not found');

    const problem = await this.problemRepository.findById(attempt.problemId);
    if (!problem) throw new Error('Problem not found');

    // State transition
    attempt.startEvaluation();
    await this.attemptRepository.save(attempt);

    try {
      const report = await this.evaluationPipeline.run(attempt, problem);
      attempt.completeEvaluation(report);
    } catch (error: any) {
       attempt.failEvaluation(error.message || 'Evaluation failed due to an internal error.');
    }

    await this.attemptRepository.save(attempt);
  }
}
