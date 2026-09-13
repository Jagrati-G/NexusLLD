import { Problem } from '../../domain/entities/Problem';
import { ProblemRepository } from '../../domain/repositories/ProblemRepository';

export class GetProblemUseCase {
  constructor(private problemRepository: ProblemRepository) {}

  public async execute(problemId?: string): Promise<Problem | Problem[]> {
    if (problemId) {
      const problem = await this.problemRepository.findById(problemId);
      if (!problem) throw new Error('Problem not found');
      return problem;
    }
    return this.problemRepository.findAll();
  }
}
