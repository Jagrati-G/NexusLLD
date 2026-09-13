import { Attempt } from '../../domain/entities/Attempt';
import { Problem } from '../../domain/entities/Problem';
import { EvaluationReport, DeterministicCheckResult, ActionableAdvice } from '../../domain/value-objects/EvaluationReport';

export interface EvaluationContext {
  problem: Problem;
  attempt: Attempt;
  deterministicChecks: DeterministicCheckResult[];
  designQualityScore: number;
  solidViolations: string[];
  actionableAdvice: ActionableAdvice[];
  isFallback: boolean;
}

export interface IEvaluatorStrategy {
  evaluate(context: EvaluationContext): Promise<void>;
  setNext(evaluator: IEvaluatorStrategy): IEvaluatorStrategy;
}

export abstract class AbstractEvaluator implements IEvaluatorStrategy {
  private nextEvaluator?: IEvaluatorStrategy;

  public setNext(evaluator: IEvaluatorStrategy): IEvaluatorStrategy {
    this.nextEvaluator = evaluator;
    return evaluator;
  }

  public async evaluate(context: EvaluationContext): Promise<void> {
    if (this.nextEvaluator) {
      await this.nextEvaluator.evaluate(context);
    }
  }
}
