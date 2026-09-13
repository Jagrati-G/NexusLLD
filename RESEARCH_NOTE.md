# RESEARCH NOTE: Industry Gaps in LLD Practice Platforms

### The Current Landscape
Currently, engineering education platforms focus heavily on **Data Structures and Algorithms (DSA)** (e.g., LeetCode, HackerRank). While there are some platforms for System Design (HLD), **Low-Level Design (LLD)** practice remains severely underserved.
Most LLD interviews require candidates to design object-oriented systems (e.g., Elevator, Parking Lot) within 45 minutes, emphasizing SOLID principles, Design Patterns, and Extensibility.

### Identified Gaps
1. **Lack of Automated Feedback for Architecture**: Current platforms evaluate code based on I/O test cases (black-box testing). They cannot evaluate *how* the code is structured (e.g., "Did you use Composition over Inheritance?", "Is this class tightly coupled?").
2. **Subjective Evaluation**: LLD is inherently subjective. A purely rule-based system fails to understand the trade-offs a candidate makes.
3. **Absence of Design Pattern Recognition**: No mainstream platform automatically recognizes and critiques the application of design patterns (Strategy, Factory, Observer) in candidate code.

### Our Solution
This MVP addresses these gaps using a **Hybrid Evaluation Engine**:
- **Deterministic Static Analysis**: Ensures baseline constraints (e.g., classes exist, encapsulation is used).
- **Heuristic Rubric Matching**: Checks for anti-patterns (e.g., `extends` without `implements`).
- **LLM Qualitative Critic**: Provides nuanced feedback on SOLID violations and trade-offs, mimicking a real Principal Engineer's code review.
