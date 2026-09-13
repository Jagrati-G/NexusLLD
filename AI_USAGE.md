# AI Usage Documentation

This document outlines four high-signal engineering decisions guided by AI during the development of this prototype.

### 1. Hybrid Evaluation Pipeline Architecture
**Decision**: Implementing a Chain of Responsibility pattern for the evaluation engine rather than a single monolithic LLM call.
**AI Influence**: AI suggested that relying purely on LLMs for deterministic things (like checking if an interface is declared) is slow, expensive, and prone to hallucination. By separating the pipeline into Deterministic -> Heuristic -> LLM, we save costs and improve accuracy.

### 2. State Machine for Attempt Lifecycles
**Decision**: Using a strict State Pattern (`DRAFT` -> `SUBMITTED` -> `EVALUATING` -> `EVALUATED` / `FAILED`) inside the `Attempt` entity.
**AI Influence**: AI recognized that async evaluations can lead to race conditions in the UI (e.g., a user submitting twice). Enforcing strict transitions at the domain level prevents invalid states before hitting the database.

### 3. Graceful Degradation Strategy
**Decision**: Implementing a fallback mechanism where if the LLM (Stage 3) times out or fails, the user still receives Stage 1 and Stage 2 feedback.
**AI Influence**: AI advised that UX in EdTech must be resilient. A spinner that loads forever is worse than partial feedback. The `EvaluationReport` object was structured to explicitly flag `isFallback: true`.

### 4. Modular Monolith over Microservices
**Decision**: Choosing Next.js API Routes structured with Domain-Driven Design (DDD) folders instead of separate backend/frontend repositories.
**AI Influence**: AI highlighted that for a 2-day MVP, the operational overhead of microservices (CORS, deployment, orchestration) distracts from the core domain problem. A well-structured Modular Monolith provides the benefits of clean architecture without the deployment complexity.
