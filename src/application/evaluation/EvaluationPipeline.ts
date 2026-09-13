import { EvaluationContext, IEvaluatorStrategy } from './IEvaluatorStrategy';
import { EvaluationReport } from '../../domain/value-objects/EvaluationReport';
import { Attempt } from '../../domain/entities/Attempt';
import { Problem } from '../../domain/entities/Problem';

export class EvaluationPipeline {
  private entryPoint?: IEvaluatorStrategy;

  constructor(evaluators: IEvaluatorStrategy[]) {
    if (evaluators.length > 0) {
      this.entryPoint = evaluators[0];
      let current = this.entryPoint;
      for (let i = 1; i < evaluators.length; i++) {
        current = current.setNext(evaluators[i]);
      }
    }
  }

  public async run(attempt: Attempt, problem: Problem): Promise<EvaluationReport> {
    const context: EvaluationContext = {
      attempt,
      problem,
      deterministicChecks: [],
      designQualityScore: 0,
      solidViolations: [],
      actionableAdvice: [],
      isFallback: false
    };

    if (this.entryPoint) {
      await this.entryPoint.evaluate(context);
    }

    return new EvaluationReport(
      context.deterministicChecks,
      context.designQualityScore,
      context.solidViolations,
      context.actionableAdvice,
      context.isFallback
    );
  }
}
