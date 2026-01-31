import crypto from 'crypto';

// Deterministically stringify objects by sorting keys to avoid hash jitter
export function stableStringify(obj) {
    const allSeen = new WeakSet();
    const stringify = (value) => {
        if (value && typeof value === 'object') {
            if (allSeen.has(value)) return '"[Circular]"';
            allSeen.add(value);
            if (Array.isArray(value)) {
                return `[${value.map((v) => stringify(v)).join(',')}]`;
            }
            const keys = Object.keys(value).sort();
            return `{${keys.map((k) => `"${k}":${stringify(value[k])}`).join(',')}}`;
        }
        return JSON.stringify(value);
    };
    return stringify(obj);
}

export function hashContext(obj) {
    const canonical = stableStringify(obj);
    return crypto.createHash('sha256').update(canonical).digest('hex');
}

// Returns true if hashes differ
export function hasSignificantChange(prevHash, nextHash) {
    if (!prevHash) return true; // no previous snapshot
    return prevHash !== nextHash;
}

export default { stableStringify, hashContext, hasSignificantChange };
