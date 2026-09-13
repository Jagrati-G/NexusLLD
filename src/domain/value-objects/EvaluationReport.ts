export interface DeterministicCheckResult {
  rule: string;
  passed: boolean;
  message?: string;
}

export interface ActionableAdvice {
  category: 'architecture' | 'solid' | 'patterns' | 'general';
  suggestion: string;
}

export class EvaluationReport {
  constructor(
    public readonly deterministicChecks: DeterministicCheckResult[],
    public readonly designQualityScore: number,
    public readonly solidViolations: string[],
    public readonly actionableAdvice: ActionableAdvice[],
    public readonly isFallback: boolean = false
  ) {}
}
