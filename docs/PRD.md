# UniGive Technical Specification & PRD
**Verified Campus Peer-to-Peer Redistribution System**

* **Project Team:** Altamash, Abhishek, Afifa, Abhinav
* **Document Purpose:** Baseline specification for requirements, data architecture, database schema, API endpoints, and development plan.

---

## 1. Executive Overview & Objectives

UniGive is an intra-university exchange network designed to facilitate the redistribution of physical goods—such as semester textbooks, engineering drafting tools, lab coats, components, and hostel gear—between students. By restricting access to verified institutional email domains (`@college.ac.in`), the system establishes a trusted, closed-loop community.

* **Sustainability:** Minimizes solid campus waste by extending the lifecycle of functional academic materials.
* **Financial Accessibility:** Eliminates recurring equipment costs for incoming juniors and budget-conscious students.
* **Zero Shipping Overhead:** All handoffs occur physically within campus premises (e.g., library, hostel blocks).

---

## 2. User Roles & Terminology

| Term / Role | Definition & Description |
|---|---|
| **Donor / Provider** | A student who has completed a course or semester and offers functional items for free or temporary loan. |
| **The Seeker / Requester** | A student in need of specific academic or hostel supplies who browses listings or posts wishlist requests. |
| **Domain Verification** | System check ensuring only email addresses matching official university suffixes can register. |

---

## 3. System Architecture

```
+-------------------------------------------------------------------+
|                     CLIENT LAYER (Frontend)                       |
|           React / Next.js Web App / Mobile Interface              |
+-------------------------------------------------------------------+
                                  |
                                  | HTTPS / REST APIs (JSON)
                                  v
+-------------------------------------------------------------------+
|                 BACKEND LAYER (Node.js/Express)                   |
|   Authentication | Item Controller | Request Engine | Redirects   |
+-------------------------------------------------------------------+
          |                       |                       |
          v                       v                       v
  +---------------+       +---------------+       +---------------+
  |  PostgreSQL   |       |   Cloudinary  |       |   Nodemailer  |
  |   Database    |       | (Image Store) |       | (SMTP Mailer) |
  +---------------+       +---------------+       +---------------+
```

---

## 4. Database Schema (PostgreSQL DDL)

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('STUDENT', 'ADMIN');
CREATE TYPE item_condition AS ENUM ('NEW', 'LIKE_NEW', 'GOOD', 'FAIR');
CREATE TYPE listing_status AS ENUM ('AVAILABLE', 'RESERVED', 'CLAIMED');
CREATE TYPE item_category AS ENUM ('BOOKS', 'LAB_EQUIPMENT', 'ELECTRONICS', 'STATIONERY', 'OTHER');

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL CHECK (email LIKE '%@%.ac.in' OR email LIKE '%@%.edu%'),
    password_hash VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    semester INT,
    social_handle VARCHAR(100),
    role user_role DEFAULT 'STUDENT',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Giveaways Table
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    category item_category NOT NULL,
    condition item_condition NOT NULL,
    image_url TEXT,
    pickup_location VARCHAR(150),
    status listing_status DEFAULT 'AVAILABLE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Seeker Requests Table
CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seeker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    category item_category NOT NULL,
    is_fulfilled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 5. REST API Specifications

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Creates user account with `@college.ac.in` domain validation. | Public |
| `POST` | `/api/auth/login` | Authenticates credentials and returns JWT token. | Public |
| `GET` | `/api/listings` | Fetches active giveaway items with category and search filters. | JWT Token |
| `POST` | `/api/listings` | Creates a new giveaway item with uploaded image URL. | JWT Token |
| `PATCH` | `/api/listings/:id` | Updates listing status (`AVAILABLE`, `RESERVED`, `CLAIMED`). | JWT Token |
| `GET` | `/api/requests` | Retrieves active requests posted by Seekers. | JWT Token |

---

## 6. Work Distribution Matrix

| Team Member | Role Title | Core Development Scope |
|---|---|---|
| **Altamash** | Frontend & UI Lead | Figma Wireframing, Feed Views, Filter UI, Request Forms. |
| **Abhishek** | Backend & Database Lead | PostgreSQL Database Schema, REST APIs, Email Auth Middleware. |
| **Afifa** | Full-Stack & Cloud Lead | Cloudinary Image Storage, Filter Logic, Direct Social Links. |
| **Abhinav** | QA, Security & Product Lead | Postman API Testing, Moderation Engine, Project Documentation. |
