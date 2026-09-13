import { InMemoryAttemptRepository } from '../repositories/InMemoryAttemptRepository';
import { InMemoryProblemRepository } from '../repositories/InMemoryProblemRepository';
import { EvaluationPipeline } from '../../application/evaluation/EvaluationPipeline';
import { DeterministicEvaluator } from '../../application/evaluation/evaluators/DeterministicEvaluator';
import { HeuristicEvaluator } from '../../application/evaluation/evaluators/HeuristicEvaluator';
import { MockLLMEvaluator } from '../evaluation/MockLLMEvaluator';
import { EvaluateAttemptUseCase } from '../../application/use-cases/EvaluateAttemptUseCase';
import { SubmitAttemptUseCase } from '../../application/use-cases/SubmitAttemptUseCase';
import { GetProblemUseCase } from '../../application/use-cases/GetProblemUseCase';
import { GetAttemptUseCase } from '../../application/use-cases/GetAttemptUseCase';

// Singleton Repositories
export const problemRepository = new InMemoryProblemRepository();
const attemptRepository = new InMemoryAttemptRepository();

// Pipeline
const evaluators = [
  new DeterministicEvaluator(),
  new HeuristicEvaluator(),
  new MockLLMEvaluator()
];
const evaluationPipeline = new EvaluationPipeline(evaluators);

// Use Cases
export const evaluateAttemptUseCase = new EvaluateAttemptUseCase(attemptRepository, problemRepository, evaluationPipeline);
export const submitAttemptUseCase = new SubmitAttemptUseCase(attemptRepository, problemRepository);
export const getProblemUseCase = new GetProblemUseCase(problemRepository);
export const getAttemptUseCase = new GetAttemptUseCase(attemptRepository);
