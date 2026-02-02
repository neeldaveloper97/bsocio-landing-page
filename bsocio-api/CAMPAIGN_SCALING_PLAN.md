# Campaign Module Scaling Plan: High-Volume Email Delivery

## 1. Problem Statement
The current implementation handles email sending synchronously (or fire-and-forget in-memory) within the API server. This has critical limitations for high-volume (100k+) campaigns:
*   **Memory Exhaustion:** Loading 100k user objects into memory will crash the Node.js process.
*   **Process Blocking:** Long-running loops block the event loop, making the API unresponsive.
*   **Data Loss:** If the server crashes mid-process, the progress is lost, and we don't know who received the email.
*   **Rate Limiting:** Sending emails without flow control will trigger spam blocks from SMTP providers (Gmail, SES, etc.).

## 2. Solution Options

### Option A: Chunked Database Processing (The "Cron" Approach)
*   **How:** A cron job runs every minute, fetches the next 100 users for a "PROCESSING" campaign, sends emails, and updates a cursor.
*   **Pros:** Simple, no extra infrastructure (Redis) needed.
*   **Cons:** Hard to meaningful scale; "sleep" based rate limiting is imprecise; single point of failure.

### Option B: Dedicated Job Queue (Redis + BullMQ) **(Recommended)**
*   **How:** The API adds a "Campaign Job" to a Redis queue. A separate "Worker" process picks up the job, fetches users in batches (cursors), and processes them.
*   **Pros:**
    *   **Resiliency:** Jobs persist in Redis if the server crashes.
    *   **Scalability:** You can spin up 10 workers to process 10x faster.
    *   **Rate Limiting:** Built-in tools to limit "X emails per second".
    *   **Separation of Concerns:** API handles requests; Workers handle heavy lifting.

---

## 3. Implementation Plan (Option B)

### Phase 1: Infrastructure Setup
1.  **Redis:** Provision a Redis instance (local for dev, managed for prod).
2.  **Dependencies:**
    ```bash
    npm install @nestjs/bullmq bullmq ioredis
    ```

### Phase 2: Architecture Changes

#### 1. The Producer (API Side)
Modify `CampaignService.create()` to stop sending emails directly. Instead:
```typescript
// campaign.service.ts
async create(dto) {
  // 1. Save Campaign to DB (Status: PENDING)
  const campaign = await this.prisma.emailCampaign.create(...);
  
  // 2. Add Job to Queue
  await this.campaignQueue.add('process-campaign', { 
    campaignId: campaign.id 
  });
  
  return campaign;
}
```

#### 2. The Consumer (Worker Side)
Create a `CampaignProcessor` that handles the heavy lifting using **Cursor-based Pagination** to avoid memory crashes.

```typescript
// campaign.processor.ts
@Processor('campaign')
export class CampaignProcessor extends WorkerHost {
  async process(job: Job) {
    const { campaignId } = job.data;
    let cursor = null;
    
    do {
      // Fetch only 100 users at a time
      const users = await this.prisma.user.findMany({
        take: 100,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
      });

      if (users.length === 0) break;

      // Send batch
      await Promise.all(users.map(user => this.mailService.send(user)));

      // Update cursor
      cursor = users[users.length - 1].id;
      
      // Update progress
      await job.progress(percentage);
      
    } while (cursor);
  }
}
```

### Phase 3: Flow Control & Rate Limiting (Crucial for 100k users)
BullMQ allows defining rate limits per queue.
```typescript
BullModule.registerQueue({
  name: 'campaign',
  limiter: {
    max: 10,      // Max 10 jobs
    duration: 1000, // Per 1 second
  },
});
```
*Note: Since our "Job" is the whole campaign, we probably want to split the campaign into smaller "Batch Jobs" (e.g., "Send to Batch 1", "Send to Batch 2") to utilize this limiter effectively.*

**Refined Strategy for 100k Users:**
1.  **Main Job:** "Split Campaign" -> Reads count of users, divides them into 1000 chunks of 100 users.
2.  **Child Jobs:** "Process Batch 1 (Users 1-100)", "Process Batch 2 (Users 101-200)".
3.  **Queue:** The queue processes these small batch jobs one by one, respecting the rate limit.

## 4. Why This Choice?
We chose **Option B (BullMQ)** because:
1.  It is the industry standard for Node.js background jobs.
2.  It solves the **Memory Issue** (by processing in chunks).
3.  It solves the **Reliability Issue** (automatic retries on failure).
4.  It prepares the system for **Horizontal Scaling** (just add more worker servers).

## 5. Next Steps
1.  Approve this plan.
2.  I will install packages.
3.  I will setup `CampaignQueueModule`.
4.  I will refactor `CampaignService`.
