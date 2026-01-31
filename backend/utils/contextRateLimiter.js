/**
 * Context Rate Limiter
 * Simple in-memory per-user throttle: 1 modifying request / 30s per context type.
 * For production horizontal scale, replace with Redis or another centralized store.
 */

const WINDOW_MS = 30 * 1000; // 30 seconds
const lastAccessMap = new Map(); // key: userId:contextType => timestamp

function contextRateLimiter(contextType) {
    return (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ success: false, message: 'Unauthenticated' });
            const key = `${userId}:${contextType}`;
            const now = Date.now();
            const last = lastAccessMap.get(key) || 0;
            if (now - last < WINDOW_MS) {
                const retryAfter = Math.ceil((WINDOW_MS - (now - last)) / 1000);
                return res.status(429).json({ success: false, message: `Rate limit: retry in ${retryAfter}s` });
            }
            lastAccessMap.set(key, now);
            next();
        } catch (err) {
            console.error('[contextRateLimiter] error', err);
            return res.status(500).json({ success: false, message: 'Rate limiter error' });
        }
    };
}

export { contextRateLimiter };
export default contextRateLimiter;
