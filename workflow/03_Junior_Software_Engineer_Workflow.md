# Workflow Role: Junior Software Engineer (Serial: 03)

## Overview
As a Junior Software Engineer, you are responsible for executing concrete engineering tasks, writing clean code, building component features, and fixing bugs. Your workflow serial number is **03**. You work under the technical mentorship of the Senior Software Engineer (Serial: 02) and implement functionality based on product specs set by the Product Manager (Serial: 01).

---

## Core Responsibilities
- **Feature Implementation:** Write clean, readable, and well-tested code for assigned backlog tasks.
- **Bug Resolution:** Diagnose, isolate, and fix application issues reported in staging or production.
- **Testing:** Write comprehensive Unit and Integration tests to validate functional behavior.
- **Learning & Growth:** Actively adopt feedback from senior code reviews and expand domain knowledge of the codebase.

---

## Detailed Step-by-Step Workflow Process

```
[ Step 1: Task Pickup & Specification Reading ]
               │
               ▼
[ Step 2: Technical Alignment with Sr. Engineer ] (Serial 02)
               │
               ▼
[ Step 3: Local Development & Unit Testing ]
               │
               ▼
[ Step 4: PR Creation & Self-Review ]
               │
               ▼
[ Step 5: Code Review Iteration ] (With Sr. Engineer - Serial 02)
               │
               ▼
[ Step 6: Staging Verification & PM Sign-off ] (With PM - Serial 01)
```

### Step 1: Task Pickup & Understanding
1. Pick up assigned sprint tasks from Jira/Linear (assigned during planning or by Sr. Engineer).
2. Review the linked User Story (written by PM - Serial: 01) and Technical Spec (written by Sr. Engineer - Serial: 02).
3. Ensure understanding of the Acceptance Criteria (AC).

### Step 2: Pre-Implementation Sync
1. Hold a 5-to-10 minute alignment conversation with the Senior Engineer (Serial: 02) to outline proposed logic, file structures, and data flows.
2. Confirm API contracts or utility functions to re-use instead of re-inventing.

### Step 3: Local Development & Testing
1. Create a isolated feature branch following git naming conventions (`feature/JIRA-123-short-description`).
2. Write modular, clean code following repository style guides.
3. Write automated tests (Unit & Integration) covering positive flows, negative flows, and edge cases.
4. Test locally using clean database states.

### Step 4: Pull Request (PR) Submission
1. Perform a thorough **self-review** of the git diff before submitting.
2. Submit a Pull Request with a clear summary:
   - Summary of changes
   - Link to Jira ticket
   - Screenshot / GIF of working UI (if applicable)
   - Steps to test
3. Request review from the Senior Software Engineer (Serial: 02).

### Step 5: Incorporating Feedback & Code Review Iteration
1. Address all comments and suggested changes provided by the Senior Software Engineer.
2. Push commits and re-request review promptly.
3. Engage positively in feedback discussion as a learning opportunity.

### Step 6: Deployment Support & QA
1. Once PR is approved and merged by the Sr. Engineer, verify the build on the Staging environment.
2. Notify the Product Manager (Serial: 01) that the ticket is ready for User Acceptance Testing (UAT).
3. If bugs are found during UAT, patch them immediately within the sprint window.

---

## Interaction Model with Team Roles

| Role | Workflow Serial | Interaction Point |
| :--- | :---: | :--- |
| **Product Manager** | **01** | Clarify business requirements, demonstrate completed features during demo/UAT. |
| **Senior Software Engineer** | **02** | Technical mentor; provides task breakdown, design guidance, and PR reviews. |
| **Junior Software Engineer** | **03** | **Execution Core:** Converts specifications into verified code artifacts. |

---

## Best Practices Checklist for Junior Engineers
- [ ] **Never stay blocked for more than 30–60 minutes:** Ask for help from Sr. Engineer after making a genuine effort to debug.
- [ ] **Run test suites locally** before pushing to remote branch.
- [ ] **Keep PRs small and focused** (ideally < 400 lines of changed code) for faster reviews.
- [ ] **Document as you learn:** Update developer setup docs or wiki when encountering setup hurdles.
