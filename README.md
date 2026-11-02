# UniGive: Verified Campus Peer-to-Peer Redistribution System

> **Intra-University Academic Exchange Network**  
> *Redistributing textbooks, engineering drafting tools, lab coats, components, and hostel gear within verified institutional domains (`@college.ac.in`).*

---

## 👥 Project Team & Work Distribution

| Team Member | Role Title | Core Development Scope |
|---|---|---|
| **Altamash** | **Frontend & UI Lead** | Figma Wireframing, Feed Views, Filter UI, Request Forms, Campus Badges, Profile Personalization. |
| **Abhishek** | **Backend & Database Lead** | PostgreSQL Database Schema, REST APIs, Email Auth Middleware, Post/Request Takedown endpoints. |
| **Afifa** | **Full-Stack & Cloud Lead** | Cloudinary Image Storage, Filter Logic, Direct WhatsApp/Telegram/Call Social Links. |
| **Abhinav** | **QA, Security & Product Lead** | Postman API Testing, Moderation Engine, Project Documentation. |

---

## ✨ Features Added

1. **Item Banner Contact Button:**  
   Every giveaway item and seeker request has a prominent, one-click contact button on the item card/banner. Revealing direct WhatsApp, Call, Telegram (`@handle`), and campus institutional email details.
2. **Post-Owner Availability Control:**  
   The item availability status (`AVAILABLE`, `RESERVED`, `CLAIMED`) is strictly restricted to the **giver who posted it**. Other campus members view a read-only badge and cannot modify someone else's listing.
3. **"My Campus Activity" Dashboard:**  
   A dedicated section for every student where they can view:
   * **My Offers:** Filtered list of items they offered, with availability dropdowns and a red **"Take Down"** button to permanently remove completed offers.
   * **My Seeker Requests:** Active wishlist requests with an option to mark as fulfilled or **"Take Down"**.
4. **Flexible Offering Types (Free, Barter, Amount):**  
   Givers can choose how they offer an item:
   * 🎁 **100% Free Giveaway** (Gift / Donation)
   * 🔄 **Exchange / Barter** (Specify what textbook or equipment they want in return)
   * 🏷️ **Campus Discount Amount** (Set a custom ₹ price)
5. **Real Image Upload Button:**  
   In the "Offer Item" modal, givers can directly upload a real photo from their computer or phone camera with instant live preview and remove option, alongside optional image URL support.
6. **Student Profile Personalization:**  
   Students can edit their profile details:
   * Full Name, Department & Semester
   * Campus Hostel Block & Room Number (e.g. *Hostel B, Room 214*)
   * Phone / WhatsApp Number for arranging fast campus meetups
   * Telegram / Social Handle
   * Bio / Academic Interests

---

## 🏛️ System Architecture

```
+-------------------------------------------------------------------+
|                     CLIENT LAYER (Frontend)                       |
|           React / Vite / Tailwind Web App / Mobile UI             |
|   Giveaways Feed | Seeker Wishlist | My Activity | Edit Profile   |
+-------------------------------------------------------------------+
                                  |
                                  | HTTPS / REST APIs (JSON)
                                  v
+-------------------------------------------------------------------+
|                 BACKEND LAYER (Node.js/Express)                   |
|   Authentication | Item Controller | Request Engine | Takedown    |
+-------------------------------------------------------------------+
          |                       |                       |
          v                       v                       v
  +---------------+       +---------------+       +---------------+
  |  PostgreSQL   |       |   Cloudinary  |       |   Nodemailer  |
  |   Database    |       | (Image Store) |       | (SMTP Mailer) |
  +---------------+       +---------------+       +---------------+
```

---

## 📁 Repository Structure

```
D:\unigive\
├── docs\
│   ├── UniGive_Technical_Specification.pdf   # Original PRD Document
│   └── PRD.md                                # Markdown transcription
├── database\
│   ├── schema.sql                            # PostgreSQL DDL (UUID, ENUMs, users, listings, requests)
│   └── seed.sql                              # Seed data with demo students, gear, and wishlists
├── backend\
│   ├── config\                               # PostgreSQL pool & Cloudinary client
│   ├── controllers\                          # Auth, Listing, Request controllers
│   ├── middleware\                           # JWT Auth verification
│   ├── routes\                               # REST route definitions
│   ├── server.js                             # Express app entry & status root
│   └── .env.example                          # Environment configuration template
└── frontend\
    ├── src\
    │   ├── components\
    │   │   ├── Navbar.jsx                    # Top nav with tabs & profile editor
    │   │   ├── HeroBanner.jsx                # Circular economy & zero-shipping mission banner
    │   │   ├── CategoryFilters.jsx           # Books, Lab Gear, Electronics, Stationery pills
    │   │   ├── SearchAndFilterBar.jsx        # Keyword search, condition & status filter
    │   │   ├── ListingCard.jsx               # Giveaway card with banner contact button & owner controls
    │   │   ├── MyActivity.jsx                # User posts dashboard with take-down options
    │   │   ├── EditProfileModal.jsx          # Student personalization modal
    │   │   ├── CreateListingModal.jsx        # Offer modal with Free/Barter/Amount & Real image upload
    │   │   ├── CreateRequestModal.jsx        # Seeker wishlist request form
    │   │   ├── SeekerFeed.jsx                # Seeker wishlist request board
    │   │   ├── AuthModal.jsx                 # Live institutional domain verification
    │   │   └── Footer.jsx
    │   ├── context\
    │   │   └── AuthContext.jsx               # Campus auth state
    │   ├── services\api.js                   # API client with seamless local fallback
    │   ├── App.jsx                           # Main dashboard & tab routing
    │   └── main.jsx
    └── package.json
```

---

## ⚡ Quickstart Guide

### 1. Frontend Development (Altamash's Scope)
To run the interactive UI dashboard:
```bash
cd D:\unigive\frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 2. Backend API Setup
```bash
cd D:\unigive\backend
npm install
cp .env.example .env
npm run dev
```
Open **`http://localhost:5000`** in your browser to view the API welcome screen and directory of endpoints.
