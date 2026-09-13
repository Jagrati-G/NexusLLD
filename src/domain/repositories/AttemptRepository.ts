import { Attempt } from '../entities/Attempt';

export interface AttemptRepository {
  findById(id: string): Promise<Attempt | null>;
  save(attempt: Attempt): Promise<void>;
  findByUserId(userId: string): Promise<Attempt[]>;
}
