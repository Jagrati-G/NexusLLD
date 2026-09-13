import { Problem } from '../entities/Problem';

export interface ProblemRepository {
  findById(id: string): Promise<Problem | null>;
  findAll(): Promise<Problem[]>;
  save(problem: Problem): Promise<void>;
}
