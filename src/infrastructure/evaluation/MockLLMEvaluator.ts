import { AbstractEvaluator, EvaluationContext } from '../../application/evaluation/IEvaluatorStrategy';

export class MockLLMEvaluator extends AbstractEvaluator {
  public async evaluate(context: EvaluationContext): Promise<void> {
    const code = context.attempt.submission?.code || '';
    
    // Stage 3: LLM Qualitative Critic (Mocked for MVP)
    // In a real scenario, this would call OpenAI/Gemini with the code and problem statement.

    // Simulate async network delay for realism
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock response based on simple heuristics to feel dynamic
    if (code.includes('class ') && !code.includes('public')) {
       context.solidViolations.push('Classes are present but missing explicit access modifiers (public/private). This can violate encapsulation principles.');
       context.actionableAdvice.push({
         category: 'solid',
         suggestion: 'Explicitly define access modifiers for your class members to ensure strict encapsulation.'
       });
       context.designQualityScore = Math.max(0, context.designQualityScore - 5);
    }

    if (code.includes('implements ')) {
      context.actionableAdvice.push({
         category: 'general',
         suggestion: 'Good use of interfaces for defining contracts. Ensure that implementations do not violate the Liskov Substitution Principle.'
       });
    }

    // Example of a mocked fallback scenario if the code contains a specific trigger word
    if (code.includes('THROW_ERROR')) {
      context.isFallback = true;
      throw new Error('LLM Provider Timeout');
    }

    await super.evaluate(context);
  }
}
