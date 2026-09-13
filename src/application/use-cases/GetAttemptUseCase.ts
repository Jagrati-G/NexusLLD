import { Attempt } from '../../domain/entities/Attempt';
import { AttemptRepository } from '../../domain/repositories/AttemptRepository';

export class GetAttemptUseCase {
  constructor(private attemptRepository: AttemptRepository) {}

  public async execute(attemptId: string): Promise<Attempt> {
    const attempt = await this.attemptRepository.findById(attemptId);
    if (!attempt) throw new Error('Attempt not found');
    return attempt;
  }
}
