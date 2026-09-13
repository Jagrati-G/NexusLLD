export class Problem {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly statement: string,
    public readonly constraints: string[],
    public readonly rubricContracts: string[],
    public readonly baselineExpectations: string[]
  ) {}

  static create(
    id: string,
    title: string,
    statement: string,
    constraints: string[],
    rubricContracts: string[],
    baselineExpectations: string[]
  ): Problem {
    return new Problem(id, title, statement, constraints, rubricContracts, baselineExpectations);
  }
}
