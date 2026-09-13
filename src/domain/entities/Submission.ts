export class Submission {
  constructor(
    public readonly code: string,
    public readonly rationale?: string
  ) {}

  public isValid(): boolean {
    return this.code.trim().length > 0;
  }
}
