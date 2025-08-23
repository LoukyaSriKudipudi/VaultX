# VaultX App – Secure Personal Data

## Overview

VaultX is a **privacy-first, end-to-end secure web application** that allows users to **store, manage, and retrieve sensitive information** and **attachments** safely.  
Built with **modern authentication**, **AES-256-GCM encryption**, and **short-lived pre-signed URLs**, Vault ensures that **only the rightful owner** can access their secrets and files.

---

## Key Features

### 1. User Authentication & Account Management

- **Sign Up & Login** – Secure user registration and login.
- **Forgot & Reset Password** – Password reset via secure email link.
- **Profile Management**:
  - Change password, name, and email.
  - Delete account (removes all user data permanently).
- **Strict Access Control** – Users can only view, modify, or delete their own data.

---

### 2. Secrets Management

- **Create & Manage Secrets** – Store confidential notes securely.
- **Dashboard Features**:
  - View all secrets in a searchable list.
  - Open/view individual secrets.
  - Delete single or multiple secrets at once.
- **Privacy Enforcement** – Each user can access only their own secrets.

---

### 3. File Attachments

- **Upload Files** – Attach up to **5 files per secret** (supports **images, PDF, TXT, ZIP**).
- **Secure File Storage**:
  - Files stored in **encrypted form**.
  - File download links are **generated on-demand** and **expire in 5 minutes**.
- **Modern Encryption**:
  - Secrets and files encrypted using **AES-256-GCM** (authenticated encryption for confidentiality & integrity).

---

### 4. Security Highlights

- **End-to-End Encryption at Rest** – All user secrets are stored encrypted.
- **Short-Lived Download URLs** – Minimizes risk of unauthorized file access.
- **Strict Authorization** – Users cannot view or manipulate others’ data.
- **Modern Auth Stack** – Secure password hashing and token-based authentication.

---

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla), Fetch API
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Encryption**: AES-256-GCM for data encryption
- **File Storage**: Amazon S3 with pre-signed URLs

---
