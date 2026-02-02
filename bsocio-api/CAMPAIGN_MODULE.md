# Campaign Module Architecture Documentation

## Overview

The Campaign Module is designed to handle the creation, management, and execution of email campaigns. Currently, the implementation is split into two distinct parts:
1.  **Campaign Management:** Handles the metadata and storage of campaigns.
2.  **Email Delivery:** A shared service for sending emails via SMTP.

> **Note:** As of the current version, the connection between creating a campaign and actually sending the emails is **not yet implemented**. The code contains placeholders for future integration with job queues.

---

## 1. Campaign Management (The "Brain")
**Location:** `src/admin-dashboard/Email Campaign/campaign.service.ts`

This service is responsible for the business logic of campaigns. It uses Prisma to interact with the database.

### Data Model (`Prisma Schema`)
The `EmailCampaign` model stores:
-   **Metadata:** `name`, `subject`, `content`
-   **Configuration:** `audience` (e.g., ALL_USERS), `sendType` (NOW vs. SCHEDULED)
-   **State:** `status` (DRAFT, SENT, SCHEDULED)
-   **Stats:** `totalSent`, `delivered`, `openRate`, `clickRate`

### Workflow
1.  **Creation:** When `create()` is called:
    -   It validates the inputs (e.g., `scheduledAt` is required for scheduled campaigns).
    -   It saves the campaign to the database with an initial status (`SENT` or `SCHEDULED`).
    -   *Current Limitation:* It simply returns the created record. No email sending is triggered.
    -   *Future Plan:* A job should be enqueued here (e.g., using BullMQ) to process the campaign asynchronously.

---

## 2. Email Delivery (The "Muscle")
**Location:** `src/lib/mail/mail.service.ts`

This is a generic, reusable service wrapping `nodemailer`. It is not specific to campaigns but is the engine that will eventually power them.

### Capabilities
-   **Transport:**
    -   **Production:** Uses SMTP credentials (`SMTP_HOST`, `SMTP_USER`, etc.) from environment variables.
    -   **Development:** Automatically creates an **Ethereal Email** test account if no SMTP config is provided, allowing you to preview emails via a URL without actual delivery.
-   **Templating:** Supports `EJS` templates via `sendTemplateMail`.
-   **Formats:** Supports both plain text and HTML.

### Key Methods
-   `sendMail(opts)`: Basic wrapper around `nodemailer.sendMail`.
-   `sendTemplateMail(opts)`: Renders an `.ejs` file and then calls `sendMail`.

---

## 3. The "Missing Link" (Architecture Gap)

Currently, the system is a **CRUD application** for campaigns. To make it functional, an asynchronous job processing system is needed.

### Recommended "To-Be" Architecture

To implement the actual sending, the flow should be updated to:

1.  **Producer (CampaignService):**
    -   Instead of just saving to DB, inject a **Job Queue** (e.g., BullMQ).
    -   `queue.add('send-campaign', { campaignId: ... })`

2.  **Consumer (CampaignProcessor):**
    -   A new background worker that listens for `send-campaign` jobs.
    -   **Step 1:** Fetch the campaign details from DB.
    -   **Step 2:** Fetch the target users (based on `audience`).
    -   **Step 3:** Loop through users and call `MailService.sendMail()` for each.
    -   **Step 4:** Update campaign stats (`totalSent`, `status` -> `SENT`).

### Why this design?
-   **Non-blocking:** Sending 1,000 emails takes time. The HTTP request to create a campaign should return immediately.
-   **Reliability:** If the server crashes, the job remains in the queue.
-   **Rate Limiting:** You can control how many emails are sent per second to avoid hitting SMTP limits.

---

## Technical Summary

| Component | Status | Implementation Details |
| :--- | :--- | :--- |
| **Database** | ✅ Ready | `EmailCampaign` model in `schema.prisma` |
| **API** | ✅ Ready | `CampaignController` & `CampaignService` (CRUD only) |
| **Mailer** | ✅ Ready | `MailService` with Nodemailer & Ethereal/SMTP |
| **Queue** | ❌ Missing | No producer/consumer logic implemented |
