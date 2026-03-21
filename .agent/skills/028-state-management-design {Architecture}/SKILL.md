---
name: state-management-design
description: Client-side state architecture. Redux/NgRx/Zustand/Context patterns adapted for Firebase real-time listeners and offline persistence.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [architecture, state, redux, ngrx, firebase-realtime]
---
# state-management-design {Architecture} (v1.0)
> **"Firebase is real-time. Your state management must be too."**
## Purpose
Designs client-side state architecture that integrates with Firebase real-time listeners (onSnapshot). Covers React (Redux/Zustand/Context) and Angular (NgRx/Signals) patterns.
**When to use:** Designing state management for React or Angular apps with Firebase.
## 1. The Physics
1. **Law of Real-Time:** Firestore onSnapshot listeners push state. Don't poll.
2. **Law of Offline:** Enable Firestore offline persistence. State must handle offline/online transitions.
3. **Law of Minimal Store:** Only store in global state what multiple components need. Local state for component-specific data.
## 2. The Protocol
### Phase 1: Identify global vs local state needs.
### Phase 2: Select state library (React: Zustand/Redux Toolkit, Angular: NgRx/Signals).
### Phase 3: Design Firestore listener → store sync pattern. Handle loading/error/success states.
## 3. Quality Gates
- [ ] Real-time listeners integrated with state store
- [ ] Offline persistence handled
- [ ] Loading/error states managed
- [ ] No unnecessary global state
