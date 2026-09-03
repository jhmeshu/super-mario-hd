# Workflow Role: Product Manager (Serial: 01)

## Overview
As the Product Manager (PM), you are the strategic anchor and feature owner for the product lifecycle. You sit at the intersection of business goals, user needs, and technical feasibility. Your workflow serial number is **01**, indicating that the product delivery sequence begins with your strategic input, requirement gathering, and roadmap definition.

---

## Strategic Responsibilities
- **Product Vision & Strategy:** Define the short-term and long-term vision for feature sets, align stakeholders, and establish success metrics (KPIs/OKRs).
- **Backlog Management:** Write clear User Stories, Acceptable Criteria (AC), and maintain a prioritized product backlog in tools like Jira or Linear.
- **Cross-Functional Alignment:** Coordinate with Senior Engineering leads, UI/UX designers, and business leadership to set delivery expectations.
- **User Research & Data:** Collect customer feedback, perform competitor analysis, and analyze usage data to make evidence-based decisions.

---

## Detailed Step-by-Step Workflow Process

```
[ Step 1: Discovery & Requirements ] 
               │
               ▼
[ Step 2: PRD & User Story Drafting ]
               │
               ▼
[ Step 3: Backlog Grooming & Refinement (with Sr. Eng) ]
               │
               ▼
[ Step 4: Sprint Planning & Commitment ]
               │
               ▼
[ Step 5: In-Flight Guidance & Unblocking ]
               │
               ▼
[ Step 6: User Acceptance Testing (UAT) & Sign-Off ]
               │
               ▼
[ Step 7: Release Communication & Metric Tracking ]
```

### Step 1: Discovery & Requirements Gathering
1. Engage with end-users, sales, support teams, and data dashboards to discover core problems.
2. Formulate hypotheses and quantify business impact.
3. Validate technical feasibility early through brief syncs with the Senior Software Engineer (Serial: 02).

### Step 2: PRD Creation & Technical Pre-Briefing
1. Draft a Product Requirement Document (PRD) specifying:
   - **Problem Statement** & Business Goals
   - **Target Persona** & Use Cases
   - **Scope:** In-scope and Out-of-scope items
   - **Acceptance Criteria (AC):** Given-When-Then format
2. Assign priority labels (e.g., P0/P1/P2) to user stories.

### Step 3: Backlog Grooming & Architecture Review
1. Lead grooming sessions with the Senior Software Engineer.
2. Clarify functional requirements and edge cases.
3. Incorporate feedback on architectural constraints or technical debt from engineering.

### Step 4: Sprint Planning
1. Finalize the scope of the upcoming sprint during Sprint Planning.
2. Ensure user stories are broken down adequately for engineering estimation.

### Step 5: In-Sprint Support & Quality Verification
1. Answer functional queries from engineers during implementation.
2. Conduct User Acceptance Testing (UAT) on staging environments once feature flags or PRs are ready.
3. Formally accept or reject completed tickets based on the defined Acceptance Criteria.

### Step 6: Launch & Retrospective
1. Coordinate release notes with marketing/documentation teams.
2. Analyze post-launch usage metrics against target KPIs.
3. Participate in sprint retrospectives to continuously optimize team workflows.

---

## Interaction Model with Engineering Roles

| Role | Workflow Serial | Key Deliverables Passed | Interaction Purpose |
| :--- | :---: | :--- | :--- |
| **Product Manager** | **01** | PRDs, Epic Specs, Prioritized User Stories | **Initiates Workflow:** Defines *What* needs to be built and *Why*. |
| **Senior Software Engineer** | **02** | Tech Specs, Task Breakdown, Code Reviews | **Hands Off To:** Tech feasibility feedback, architectural alignment, sprint task sizing. |
| **Junior Software Engineer** | **03** | Pull Requests, Unit Tests, Bug Fixes | **Direct Support:** UAT validation, functional clarification, scope sanity checks. |

---

## Operational Artifacts & Templates
- **Standard User Story Template:**
  > **As a** [user role]  
  > **I want to** [action/feature]  
  > **So that** [value/outcome]  
  > 
  > **Acceptance Criteria:**  
  > - [ ] Given X, when Y happens, then Z should occur.  
  > - [ ] Error state handling for invalid inputs.
- **Definition of Ready (DoR):** Story has clear business value, AC defined, UI/UX mocks attached, and engineering estimates complete.
