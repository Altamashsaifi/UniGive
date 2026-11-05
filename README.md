# UniGive: Verified Campus Peer-to-Peer Redistribution System

> **Intra-University Academic Exchange Network**  
> *Redistributing textbooks, engineering drafting tools, lab coats, components, and hostel gear within verified institutional domains (`@college.ac.in`).*

---

## Core Features

1. **Item Banner Contact Button:**  
   Every giveaway item and seeker request provides direct contact options on the card, enabling communication via WhatsApp, Phone, Instagram, and campus institutional email.
2. **Post-Owner Availability Control:**  
   Item availability statuses (`AVAILABLE`, `RESERVED`, `CLAIMED`) are restricted to the author who created the post. Other campus members view read-only badges.
3. **Campus Activity Dashboard:**  
   A dedicated view for students to manage their listings:
   * **Offers:** Manage active items, update availability statuses, or take down completed offers.
   * **Seeker Requests:** Active wishlist requests with options to mark as fulfilled or remove.
4. **Flexible Offering Models:**  
   Givers can choose how items are distributed:
   * **Free Giveaway:** Pure donation to fellow students.
   * **Exchange / Barter:** Request specific academic items in exchange.
   * **Campus Price:** Set a modest price for higher-value equipment.
5. **Image Upload:**  
   Direct photo uploads with client-side preview, alongside optional direct image URLs.
6. **Student Profiles:**  
   Profile management including department, semester, campus location/hostel, contact handles, and academic focus.
7. **Institutional Verification:**  
   Restricted access ensuring only verified campus domain accounts (`@college.ac.in`) can sign up and trade.

---

## System Architecture

```
+-------------------------------------------------------------------+
|                     CLIENT LAYER (Frontend)                       |
|           React / Vite / Tailwind Web App / Mobile UI             |
|   Giveaways Feed | Seeker Wishlist | My Activity | Edit Profile   |
+-------------------------------------------------------------------+
                                  |
                                  | HTTPS / REST / Supabase SDK
                                  v
+-------------------------------------------------------------------+
|                     SERVICES & DATA LAYER                         |
|   Supabase (PostgreSQL, Row Level Security, Auth, Storage)        |
|   Optional Node.js/Express API Service                            |
+-------------------------------------------------------------------+
```

---

## Repository Structure

```
unigive/
├── docs/
│   ├── UniGive_Technical_Specification.pdf   # Technical Specification
│   └── PRD.md                                # Product Requirements
├── database/
│   ├── schema.sql                            # PostgreSQL DDL
│   ├── seed.sql                              # Initial seed data
│   └── supabase_schema.sql                   # Supabase RLS policies and triggers
├── backend/
│   ├── config/                               # Pool configuration
│   ├── controllers/                          # Resource controllers
│   ├── middleware/                           # Auth verification
│   ├── routes/                               # REST route definitions
│   └── server.js                             # Express application entry
└── frontend/
    ├── src/
    │   ├── components/                       # UI components and modals
    │   ├── context/                          # Campus auth state
    │   ├── services/                         # API and storage client
    │   ├── App.jsx                           # Application routing
    │   └── main.jsx                          # Client entry point
    └── package.json
```

---

## Quickstart Guide

### 1. Frontend Development

To run the interactive UI dashboard:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

### 2. Backend Service (Optional)

If running the local Node/Express backend:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5000` in your browser to view the API status and endpoints.
