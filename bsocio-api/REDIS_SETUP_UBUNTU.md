# Manage Redis on AWS EC2 (Ubuntu)

This guide details how to install, secure, and manage Redis for your BullMQ queue system on an Ubuntu EC2 instance.

## 1. Installation

Update your package list and install the Redis server:

```bash
sudo apt update
sudo apt install redis-server -y
```

## 2. Configuration (`redis.conf`)

Open the Redis configuration file:

```bash
sudo nano /etc/redis/redis.conf
```

**Key Settings to Check/Change:**

1.  **Supervision:** Find the `supervised` directive. By default, it is `no`. Change it to `systemd` to let Ubuntu manage the process better.
    ```conf
    supervised systemd
    ```

2.  **Binding (Security):**
    *   **Same Server:** If your NestJS API is running on the **same EC2 instance**, ensure Redis listens *only* on localhost. This is the default and is secure.
        ```conf
        bind 127.0.0.1 ::1
        ```
    *   **Separate Server:** If Redis is on a *different* server, you need to bind to `0.0.0.0` or the private IP, **BUT** you must set a password (see below) and restrict access via AWS Security Groups.

3.  **Password (Optional but Recommended):**
    Uncomment the `requirepass` line and set a strong password.
    ```conf
    requirepass your_strong_password_here
    ```
    *If you do this, update your `.env` file in NestJS: `REDIS_PASSWORD=your_strong_password_here`.*

4.  **Persistence (AOF):**
    To ensure job data isn't lost on restart, enable Append Only File (AOF).
    Find `appendonly` and change it to `yes`.
    ```conf
    appendonly yes
    ```

**Save and Exit:** Press `Ctrl+O`, `Enter`, then `Ctrl+X`.

## 3. Restart and Enable Service

Restart Redis to apply changes:

```bash
sudo systemctl restart redis.service
```

Enable Redis to start automatically when the server reboots:

```bash
sudo systemctl enable redis.service
```

Check the status to ensure it's running:

```bash
sudo systemctl status redis
```

## 4. Testing the Connection

You can interact with Redis using the CLI:

```bash
redis-cli
```

*   If you set a password, type: `auth your_password`
*   Type `ping`. It should reply `PONG`.

## 5. Maintenance & Monitoring

### View Logs
If Redis acts up, check the logs:
```bash
sudo tail -f /var/log/redis/redis-server.log
```

### Monitor Performance
To see real-time commands being processed (useful for debugging queues):
```bash
redis-cli monitor
```
*Note: This reduces performance, user only for debugging.*

### Purge Data (Emergency Only)
If your queues get stuck with bad data and you want to wipe EVERYTHING:
```bash
redis-cli FLUSHALL
```

## 6. AWS Security Groups (Firewall)

**Scenario A: NestJS & Redis on SAME Instance**
*   **Action:** No AWS Security Group changes needed. Redis talks to localhost.
*   **Verification:** Ensure Port 6379 is **NOT** open in your Security Group inbound rules to the public (0.0.0.0/0). It should be closed to the outside world.

**Scenario B: NestJS & Redis on DIFFERENT Instances**
*   **Action:**
    1.  Go to the EC2 Console > Security Groups.
    2.  Select the **Redis Server's** Security Group.
    3.  Add an **Inbound Rule**:
        *   **Type:** Custom TCP
        *   **Port:** 6379
        *   **Source:** Select the Security Group ID of your **NestJS Server** (e.g., `sg-01234abcd...`).
    *   *Do NOT allow 0.0.0.0/0 unless you want hackers.*

---

## 7. Connecting Your App

Ensure your `.env` file on the EC2 instance matches your setup:

```env
# If on same server
REDIS_HOST=localhost
REDIS_PORT=6379
# REDIS_PASSWORD=  <-- Add this if you set 'requirepass'
```
