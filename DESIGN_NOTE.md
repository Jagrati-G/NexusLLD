# DESIGN NOTE: Architecture & Trade-offs

## Architecture Overview
The system is built as a **Modular Monolith** using **Next.js (App Router)**. This choice allows for rapid iteration of the MVP while maintaining a strict separation of concerns within the `src/` directory.

### Layered Architecture (Domain-Driven Design)
1. **Domain Layer**: Contains pure TypeScript entities (`Problem`, `Attempt`, `Submission`, `EvaluationReport`). This layer has zero dependencies on Next.js or external APIs.
2. **Application Layer**: Contains Use Cases and the Evaluation Engine. It orchestrates the domain objects.
3. **Infrastructure Layer**: Implements repositories (In-Memory for MVP) and the actual LLM integration (mocked for MVP).
4. **Presentation Layer**: The Next.js API Routes and React components.

## Design Patterns Utilized
- **Strategy Pattern**: The `IEvaluatorStrategy` interface allows us to define multiple ways to evaluate code (Deterministic, Heuristic, LLM).
- **Chain of Responsibility**: `EvaluationPipeline` chains the evaluators together, allowing the code to pass through Stage 1, Stage 2, and Stage 3 sequentially.
- **State Pattern**: The `Attempt` entity manages its own state transitions (`DRAFT` -> `SUBMITTED` -> `EVALUATING` -> `EVALUATED`/`FAILED`), ensuring invalid transitions throw domain errors.
- **Dependency Injection**: A simple DI container (`src/infrastructure/di/container.ts`) wires the application together, making the system highly testable.

## Trade-offs
1. **In-Memory Storage vs Database**: For this 2-day assignment prototype, an In-Memory repository was chosen to remove the overhead of setting up Postgres/Prisma. The Repository interfaces ensure a real database can be swapped in seamlessly later.
2. **Mocked LLM vs Real API**: A mock LLM was used to guarantee the prototype runs instantly without requiring API keys, while still demonstrating the async architecture and fallback resilience (simulated via timeouts).
3. **Regex/AST for Deterministic Checks**: Simple string inclusion (Regex) was used for deterministic checks. In a production system, a full AST (Abstract Syntax Tree) parser like TypeScript Compiler API would be used for accurate static analysis.
