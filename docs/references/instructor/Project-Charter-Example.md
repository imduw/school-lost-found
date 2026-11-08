# [WORKED EXAMPLE] SOFTWARE PROJECT CHARTER

**Course:** Software Project Management  
**Academic Supervisor / Instructor:** Dr. Nguyen Thanh Tuan  
**Submission Date:** 25/08/2026  
**Document Version:** Version 1.0 (Approved)  
**Project Key:** `VKU-SPM-ROOM03`

---

## 1. PROJECT GENERAL INFORMATION

| Item | Details |
| :--- | :--- |
| **Project Name** | VKU Smart Study Space Reservation System (*VKU StudySpace*) |
| **Project Acronym / Key** | `VKU-SPM-ROOM03` |
| **Course Cohort** | `Software Project Management (4)` |
| **Team Name** | Team 03 - CloudDev |
| **Creation Date** | 25/08/2026 |
| **Document Version** | Version 1.0 (Approved) |
| **Primary GitHub Repository** | `https://github.com/vku-clouddev-2026/vku-study-space` |
| **GitHub Project Board URL** | `https://github.com/orgs/vku-clouddev-2026/projects/1` |

---

## 2. PROJECT SOURCING & REAL-WORLD CONTEXT

- [x] **Pathway 3: Real Campus / Department / Student Organization Need at VKU**  
  *Operational need verified and sponsored by the VKU Computer Lab Management & Library Administration.*

---

## 3. EXECUTIVE SUMMARY & BUSINESS CASE

- **Operational Background:** VKU students, capstone teams, and academic research clubs frequently require self-study rooms and specialized computer laboratories outside scheduled lecture hours.
- **Core Problem Statement:** Room booking is currently managed manually through paper logbooks at security desks or informal Zalo messaging groups. This causes severe friction: double-booking conflicts, lack of real-time visibility into available slots, and a high no-show rate (over 35% of reserved slots remain unused while other students are turned away).
- **Proposed Software Solution:** A responsive Web Application and Progressive Web App (PWA) enabling VKU students to inspect real-time room availability, reserve slots using VKU Google SSO credentials, receive dynamic QR check-in codes, and enable laboratory administrators to manage space allocations with automated cancellation for no-shows.

---

## 4. SMART PROJECT OBJECTIVES

1. **Objective 1 (Core Functional Capability):**  
   Implement and deploy the real-time space booking engine with PostgreSQL row-level transaction locking to guarantee zero double-booking conflicts and API response times $< 600\text{ms}$ before Week 8.
2. **Objective 2 (Operational & User Validation):**  
   Onboard at least 40 active VKU students across two cohort classes and successfully process a minimum of 60 authentic bookings during the Week 12 pilot deployment.
3. **Objective 3 (Engineering Rigor & Quality Gate):**  
   Maintain 100% Conventional Commits compliance, enforce automated GitHub Actions CI builds on all Pull Requests, and maintain zero unreviewed code merged into `main`.
4. **Objective 4 (Production Deployment & Client Handover):**  
   Deploy the production system on Cloudflare Pages and Supabase, securing formal written acceptance sign-off from the Computer Lab Administrator by Week 13.

---

## 5. PROJECT SCOPE & BOUNDARIES

### 5.1. In-Scope (Committed Deliverables)
- **Student Space Booking Module:**
  - Google SSO authentication restricted to `@vku.udn.vn` email domains.
  - Real-time room search filtered by capacity, available equipment (projector, whiteboard, GPU workstations), and time slots.
  - Slot reservation engine with automated check-in QR code generation and 1-hour prior cancellation policy.
- **Administrator Management Module:**
  - Room inventory dashboard (add/edit room status, adjust operating hours, emergency blockouts).
  - Check-in validation scanner (Webcam / QR scanner interface).
  - Space utilization reports (peak hours, room occupancy rates, no-show trends).
- **Engineering Deliverables:**
  - Monorepo repository on GitHub with clean branch protections (`main`, `staging`).
  - Active GitHub Project board tracking all tasks through Kanban columns.
  - Automated CI/CD pipeline via GitHub Actions deploying to Cloudflare Pages.
  - OpenAPI 3.0 documentation and deployment runbooks.

### 5.2. Explicitly Out-of-Scope (Boundaries to Prevent Scope Creep)
- Integration with physical IoT smart door magnetic locks (interaction is bounded to screen-based QR check-in).
- Native iOS distribution via Apple App Store (deliverables are bounded to Responsive Web & Android PWA).
- Commercial payment gateway processing (room reservations are free academic campus amenities).

---

## 6. STAKEHOLDER REGISTER & ENGAGEMENT MATRIX

### 6.1. Stakeholder Register

| Stakeholder / Entity | Role in Project | Power | Interest | Engagement Strategy |
| :--- | :--- | :---: | :---: | :--- |
| **Mr. Tran Van Quan Ly (Lab Admin)** | Client Stakeholder & Acceptance Authority | High | High | **Manage Closely**: Bi-weekly demo reviews and formal sign-offs. |
| **Dr. Nguyen Thanh Tuan** | Academic Supervisor & Course Instructor | High | High | **Manage Closely**: Audit course checkpoints (M1–M10) and rubric criteria. |
| **Team CloudDev (5 Members)** | Engineering, Design, & QA Execution | High | High | **Collaborate Daily**: Async GitHub coordination, PR peer reviews, weekly sync. |
| **VKU Network & IT Center** | Domain & Campus Infrastructure | High | Low | **Keep Satisfied**: Adhere strictly to institutional data privacy & cloud policies. |
| **VKU Student Community** | Primary End Users | Low | High | **Keep Informed**: Usability surveys, feedback forms, pilot release updates. |

### 6.2. Power-Interest Matrix

```text
High Power  │  MANAGE CLOSELY                         │  KEEP SATISFIED
            │  - Mr. Tran Van Quan Ly (Lab Admin)     │  - VKU IT & Infrastructure Center
            │  - Dr. Nguyen Thanh Tuan (Instructor)   │
────────────┼─────────────────────────────────────────┼──────────────────────────────
Low Power   │  KEEP INFORMED                          │  MONITOR
            │  - VKU Student Users                    │  - Peer Project Cohort Teams
            │  - Lab Student Assistants               │  - General Academic Community
            └─────────────────────────────────────────┴──────────────────────────────
                           High Interest                           Low Interest
```

---

## 7. PROJECT MANAGEMENT STACK & GITHUB ECOSYSTEM

| Project Domain | Tool / Feature | Implementation Standard |
| :--- | :--- | :--- |
| **Source Code** | **GitHub Repository** | Protected `main` branch; Conventional Commits enforced (`feat:`, `fix:`, `docs:`, `chore:`). |
| **Project Tracking** | **GitHub Projects** | Kanban board: `Backlog` $\rightarrow$ `Ready` $\rightarrow$ `In Progress` $\rightarrow$ `In Review` $\rightarrow$ `Done`. |
| **Work Packages** | **GitHub Issues** | Every task has an issue containing BDD acceptance criteria, estimate label, and milestone. |
| **Code Review** | **GitHub Pull Requests** | Peer review required for every PR; self-review checklist and automated CI checks must pass. |
| **Milestone Auditing**| **GitHub Milestones** | Tracked across `M1: Charter`, `M2: WBS`, `M3: Iteration 1`, `M5: Midterm`, `M8: Release`. |
| **CI/CD Automation** | **GitHub Actions** | Automated workflow executing ESLint, TypeScript check, Vitest unit tests, and Cloudflare deploy. |

---

## 8. HIGH-LEVEL MILESTONES & TIMELINE

| Milestone | Target Week | Major Deliverable | Responsible Role |
| :---: | :---: | :--- | :--- |
| **M1** | Week 2 | Approved Project Charter & Initialized GitHub Project Board | Project Lead & Team |
| **M2** | Week 4 | Complete WBS Dictionary, Database Schema, and Wireframes | Technical Lead |
| **M3** | Week 6 | Iteration 1 Delivery: Room Search & Basic Reservation Workflows | Entire Team |
| **M4** | Week 7 | Risk Register Update #1 & Iteration 1 Retrospective Report | QA / Test Engineer |
| **M5** | Week 9 | Midterm Milestone: Working Product Demo & AI Tool Usage Evidence | Entire Team |
| **M6** | Week 11 | Iteration 2 Delivery: QR Check-in Engine & Admin Utilization Dashboard | Entire Team |
| **M7** | Week 12 | Risk Register Update #2 & Scope Change Control Log | Project Lead |
| **M8** | Week 13 | Final Client Acceptance Sign-Off & Project Retrospective | Entire Team |
| **M9** | Week 14 | Complete Evidence Package Submission (Audit Checklist Verification) | Entire Team |
| **M10**| Week 15 | Final Defense & Live Demonstration before the Committee | Entire Team |

---

## 9. DEVELOPMENT METHODOLOGY & CADENCE

- **Selected Methodology:** **Iterative & Incremental Development** (Two-week delivery cycles).
- **Justification:**  
  1. *Requirement Discovery:* Feedback from the Computer Lab Administrator on slot booking policies (maximum hours per reservation, automated expiration thresholds) will be gathered iteratively through working increments.  
  2. *Risk Reduction:* Database concurrency challenges (preventing simultaneous double-booking) can be validated in Iteration 1 before expanding to administrator analytics in Iteration 2.

---

## 10. TEAM GOVERNANCE & ENGINEERING ROLES

| # | Member Name | Student ID | GitHub Username | Project Role | Primary Responsibilities |
| :-: | :--- | :---: | :---: | :--- | :--- |
| 1 | **Nguyen Van An** | 21IT001 | `@an-nguyen` | **Project Lead / PM** | Coordinates milestone schedules, maintains GitHub Project board, leads stakeholder reviews, manages risk register. |
| 2 | **Tran Thi Binh** | 21IT002 | `@binh-tran` | **Technical Lead / Architect** | System architecture, Supabase schema design, CI/CD pipeline, and core code reviews. |
| 3 | **Le Van Cuong** | 21IT003 | `@cuong-le` | **Backend Engineer** | REST API endpoints, PostgreSQL row-level locks, transaction logic, and authentication middleware. |
| 4 | **Pham Minh Duc** | 21IT004 | `@duc-pham` | **Frontend / Mobile Engineer** | Responsive web UI, PWA configuration, client state management, and QR code scanner integration. |
| 5 | **Hoang My Linh** | 21IT005 | `@linh-hoang` | **QA & Test Engineer** | Automated API testing, manual regression passes, acceptance criteria verification, and Evidence Package assembly. |

---

## 11. CONSTRAINTS, ASSUMPTIONS & INITIAL RISKS

### 11.1. Constraints & Assumptions
- **Constraints:** Strict deployment deadline by Week 14; \$0 infrastructure cost (Cloudflare Pages, Supabase free tier).
- **Assumptions:** Lab Administrator reviews demo builds within 3 days; Supabase free-tier connection limits remain sufficient for pilot load.

### 11.2. Top 3 Initial Project Risks

| Initial Risk | Probability | Impact | Proactive Response & Mitigation Plan |
| :--- | :---: | :---: | :--- |
| **1. Concurrency collision: Simultaneous room booking** | High | High | Implement PostgreSQL Row-Level Locking (`FOR UPDATE`) inside a database transaction function. |
| **2. High no-show rate wasting reserved space** | High | Medium | Implement automated slot forfeiture: if QR check-in does not occur within 15 minutes of slot start, release room. |
| **3. Client delay in validating milestone acceptance** | Medium | Medium | Establish pre-agreed bi-weekly demo schedule; deploy preview links on Cloudflare on every pull request. |

---

## 12. SUCCESS CRITERIA & DEFINITION OF DONE (DoD)

### 12.1. Project Success Criteria
1. 100% of In-Scope booking and administration features operational on production.
2. Formal acceptance sign-off document signed by Mr. Tran Van Quan Ly in Week 13.
3. Complete Evidence Package audit passes with zero red flags (continuous commit trail, verified board).

### 12.2. Engineering Definition of Done (DoD) for Every Work Item
- [ ] Code passes TypeScript compilation and local automated tests.
- [ ] Pull Request opened against `staging` with link to GitHub Issue (`Fixes #14`).
- [ ] At least 1 peer review approval recorded on GitHub PR.
- [ ] Automated GitHub Actions CI workflow passes with green status.
- [ ] Feature tested on preview URL; acceptance criteria verified by QA engineer.
- [ ] PR merged into `staging`; GitHub Issue closed and moved to `Done` on GitHub Project board.

---

## 13. FORMAL APPROVALS & SIGN-OFF

*By signing below, the signatories endorse this Project Charter, granting the project team formal authorization to proceed with Work Breakdown Structure (WBS) decomposition and project execution.*

| Project Lead / Team Representative | Project Sponsor / Client Stakeholder | Academic Supervisor / Course Instructor |
| :---: | :---: | :---: |
| *(Signed)* | *(Signed)* | *(Signed)* |
| <br><br><br> | <br><br><br> | <br><br><br> |
| **Nguyen Van An** | **Mr. Tran Van Quan Ly** | **Dr. Nguyen Thanh Tuan** |
| Date: 25 / 08 / 2026 | Date: 26 / 08 / 2026 | Date: 27 / 08 / 2026 |
