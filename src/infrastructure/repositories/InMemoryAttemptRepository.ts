import { Attempt } from '../../domain/entities/Attempt';
import { AttemptRepository } from '../../domain/repositories/AttemptRepository';

export class InMemoryAttemptRepository implements AttemptRepository {
  private attempts: Map<string, Attempt> = new Map();

  public async findById(id: string): Promise<Attempt | null> {
    return this.attempts.get(id) || null;
  }

  public async save(attempt: Attempt): Promise<void> {
    this.attempts.set(attempt.id, attempt);
  }

  public async findByUserId(userId: string): Promise<Attempt[]> {
    return Array.from(this.attempts.values()).filter(a => a.userId === userId);
  }
}
