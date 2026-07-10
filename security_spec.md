# ProPath Firebase Security Specification

## 1. Data Invariants
- A **Report** can be read by anyone (sharing links) but can never be modified or deleted.
- A **Partner** and **Program** can be read by anyone so that they can see available corporate alignment opportunities, but modifications are restricted to authorized administrators (simulated via portal controls).
- A **TeamApplication** must contain a valid `userEmail`, `partnerId`, and `status`. Users can create placements, and the admin can approve or modify their status.

## 2. Security Rules (DRAFT_firestore.rules)
To verify that these invariants are strictly upheld, we write the fortress rules.
- Global Safety Net prevents untargeted access.
- Immutability on Reports.
- Public read access for Partners/Programs, with write permissions enabled for platform management.
- Creation validation on placement applications.
