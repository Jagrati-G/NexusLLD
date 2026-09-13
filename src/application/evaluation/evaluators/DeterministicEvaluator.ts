import { AbstractEvaluator, EvaluationContext } from '../IEvaluatorStrategy';

export class DeterministicEvaluator extends AbstractEvaluator {
  public async evaluate(context: EvaluationContext): Promise<void> {
    const code = context.attempt.submission?.code || '';
    
    // Stage 1: Deterministic Static Analysis
    const hasClassKeyword = code.includes('class ');
    context.deterministicChecks.push({
      rule: 'Uses classes for domain modeling',
      passed: hasClassKeyword,
      message: hasClassKeyword ? 'Found class declarations.' : 'No class declarations found. LLD requires class structures.'
    });

    const hasInterfaceKeyword = code.includes('interface ') || code.includes('abstract class');
    context.deterministicChecks.push({
      rule: 'Uses abstractions (interfaces/abstract classes)',
      passed: hasInterfaceKeyword,
      message: hasInterfaceKeyword ? 'Found abstractions.' : 'No interfaces or abstract classes found. Consider using abstractions for flexibility.'
    });

    // Simple keyword based checks for basic OOP principles
    const hasPrivateFields = code.includes('private ');
    context.deterministicChecks.push({
      rule: 'Encapsulation (uses private fields)',
      passed: hasPrivateFields,
      message: hasPrivateFields ? 'Encapsulation observed.' : 'No private fields found. Protect internal state.'
    });

    // Score deduction based on deterministic checks
    const baseScore = 40; // Base score for compiling/valid submission
    const passedChecks = context.deterministicChecks.filter(c => c.passed).length;
    context.designQualityScore = baseScore + (passedChecks * 10); // up to 70

    if (!hasClassKeyword) {
      context.actionableAdvice.push({
        category: 'architecture',
        suggestion: 'Wrap your logic in appropriate Classes to represent domain entities.'
      });
    }

    await super.evaluate(context);
  }
}
