import { AbstractEvaluator, EvaluationContext } from '../IEvaluatorStrategy';

export class HeuristicEvaluator extends AbstractEvaluator {
  public async evaluate(context: EvaluationContext): Promise<void> {
    const code = context.attempt.submission?.code || '';
    
    // Stage 2: Heuristic Rubric Matcher
    // Validates relationship presence based on rubric contracts.
    
    context.problem.rubricContracts.forEach(contract => {
      // E.g., contract might be "Composition over Inheritance: No extending concrete classes"
      if (contract.includes('Composition')) {
        const hasExtends = code.includes('extends ');
        const hasImplements = code.includes('implements ');
        
        if (hasExtends && !hasImplements) {
           context.solidViolations.push('Potential violation of Composition over Inheritance (LSP). Found extends without interface implementations.');
           context.designQualityScore = Math.max(0, context.designQualityScore - 5);
        }
      }
    });

    // Check for Strategy Pattern heuristic (e.g. interface ending in Strategy)
    if (context.problem.baselineExpectations.some(e => e.includes('Strategy'))) {
      if (!code.match(/interface \w+Strategy/)) {
        context.actionableAdvice.push({
          category: 'patterns',
          suggestion: 'Consider implementing the Strategy pattern for variable behaviors as requested in baseline expectations.'
        });
      } else {
        context.designQualityScore = Math.min(100, context.designQualityScore + 10);
      }
    }

    await super.evaluate(context);
  }
}
