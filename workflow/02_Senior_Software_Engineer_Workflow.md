# Workflow Role: Senior Software Engineer (Serial: 02)

## Overview
As the Senior Software Engineer, you are the technical authority and system architect within the delivery pipeline. Your workflow serial number is **02**. You sit between product vision (Product Manager - Serial: 01) and implementation execution (Junior Software Engineer - Serial: 03). You convert business requirements into robust, scalable software designs, mentor junior engineers, and safeguard code quality.

---

## Technical & Tactical Responsibilities
- **System Architecture & Design:** Design reliable, scalable, and secure application architectures. Write RFCs and Technical Specs.
- **Task Deconstruction:** Translate high-level user stories from PM into granular, actionable engineering tasks.
- **Code Review & Standards:** Enforce linting rules, architectural guidelines, testing coverage, and approve Pull Requests (PRs).
- **Mentorship & Unblocking:** Guide the Junior Engineer, review technical approaches, and clear technical roadblocks.
- **DevOps & Infrastructure:** Maintain CI/CD pipelines, monitor application performance, and oversee staging/production deployments.

---

## Detailed Step-by-Step Workflow Process

```
[ Step 1: Technical Requirement Analysis ] (Input from PM - Serial 01)
               │
               ▼
[ Step 2: System Design & Tech Spec Drafting ]
               │
               ▼
[ Step 3: Task Breakdown & Delegation ] (Assign to Jr Eng - Serial 03)
               │
               ▼
[ Step 4: Complex Implementation & Core Engineering ]
               │
               ▼
[ Step 5: Code Review & Quality Control ] (Reviewing Jr Eng PRs)
               │
               ▼
[ Step 6: Deployment & Operational Monitoring ]
```

### Step 1: Technical Requirement Analysis
1. Receive PRDs and User Stories from the Product Manager (Serial: 01).
2. Evaluate non-functional requirements (performance, throughput, security, scalability).
3. Raise technical risks, trade-offs, and capacity limitations during refinement meetings.

### Step 2: Architecture & Technical Specification
1. Write Technical Design Documents (TDD) or RFCs for complex features, including:
   - Data Schema / Model Changes
   - API Specifications (REST/GraphQL/gRPC contracts)
   - Component / System Interaction Diagrams
   - Security and Performance Considerations
2. Review design specs with the engineering team for consensus.

### Step 3: Task Deconstruction & Mentorship
1. Break down user stories into smaller technical sub-tasks.
2. Delegate appropriate tasks to the Junior Software Engineer (Serial: 03) based on their skill growth goals.
3. Conduct brief technical alignment syncs with the Junior Engineer before they start coding.

### Step 4: Implementation & Execution
1. Implement high-risk, core algorithmic, or complex system components.
2. Maintain unit test coverage (>80%) and write integration test harnesses.
3. Ensure backwards compatibility and database migration safety.

### Step 5: Code Review & Quality Gatekeeping
1. Review Pull Requests submitted by the Junior Engineer (Serial: 03) within 24 hours.
2. Verify code readability, adherence to design patterns, security standards, and performance optimization.
3. Provide constructive, actionable feedback and mentor on best practices.

### Step 6: Release & Infrastructure Management
1. Approve and merge vetted PRs into the main deployment branch.
2. Monitor CI/CD build outputs, deployment health, and error telemetry (e.g., Sentry, Datadog).
3. Notify the Product Manager (Serial: 01) when features are deployed to staging for UAT.

---

## Interaction Model with Surrounding Roles

| Role | Workflow Serial | Interaction & Inputs/Outputs |
| :--- | :---: | :--- |
| **Product Manager** | **01** | **Receives:** PRDs & Acceptance Criteria. **Provides:** Tech estimates, feasibility reports, system constraints. |
| **Senior Software Engineer** | **02** | **Primary Owner:** System design, code quality, release pipeline stability. |
| **Junior Software Engineer** | **03** | **Provides:** Technical guidance, API contracts, code reviews. **Receives:** Completed PRs, unit tests, bug fixes. |

---

## Engineering Quality Standards Checklist
- [ ] Technical Design Document approved for epic-level features.
- [ ] Database migrations tested against realistic data sizes.
- [ ] API endpoints adhere to company REST/gRPC conventions.
- [ ] Zero critical vulnerabilities introduced (verified via static analysis tools).
- [ ] Performance benchmarks met (e.g., API response time < 200ms p95).
