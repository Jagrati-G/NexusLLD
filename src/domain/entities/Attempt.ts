import { Submission } from './Submission';
import { EvaluationReport } from '../value-objects/EvaluationReport';

export type AttemptStatus = 'DRAFT' | 'SUBMITTED' | 'EVALUATING' | 'EVALUATED' | 'FAILED';

export class Attempt {
  private _status: AttemptStatus;
  private _submission?: Submission;
  private _report?: EvaluationReport;
  private _errorMessage?: string;

  constructor(
    public readonly id: string,
    public readonly problemId: string,
    public readonly userId: string,
    status: AttemptStatus = 'DRAFT'
  ) {
    this._status = status;
  }

  get status(): AttemptStatus {
    return this._status;
  }

  get submission(): Submission | undefined {
    return this._submission;
  }

  get report(): EvaluationReport | undefined {
    return this._report;
  }

  get errorMessage(): string | undefined {
    return this._errorMessage;
  }

  submit(submission: Submission): void {
    if (this._status !== 'DRAFT') {
      throw new Error(`Cannot submit attempt from state: ${this._status}`);
    }
    if (!submission.isValid()) {
      throw new Error('Invalid submission.');
    }
    this._submission = submission;
    this._status = 'SUBMITTED';
  }

  startEvaluation(): void {
    if (this._status !== 'SUBMITTED') {
      throw new Error(`Cannot start evaluation from state: ${this._status}`);
    }
    this._status = 'EVALUATING';
  }

  completeEvaluation(report: EvaluationReport): void {
    if (this._status !== 'EVALUATING') {
      throw new Error(`Cannot complete evaluation from state: ${this._status}`);
    }
    this._report = report;
    this._status = 'EVALUATED';
  }

  failEvaluation(errorMessage: string): void {
    if (this._status !== 'EVALUATING' && this._status !== 'SUBMITTED') {
      throw new Error(`Cannot fail evaluation from state: ${this._status}`);
    }
    this._errorMessage = errorMessage;
    this._status = 'FAILED';
  }
}
