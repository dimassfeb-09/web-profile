// Sederhana in-memory rate limiter untuk login
// Untuk produksi skala besar, gunakan Redis (Upstash)

const attempts = new Map<string, { count: number; resetAt: number }>();

/**
 * Checks if the given IP address is rate limited.
 * @param ip IP address of the requester
 * @param maxAttempts Maximum number of attempts allowed in the window
 * @param windowMs Time window in milliseconds
 * @returns true if allowed, false if rate limited
 */
export function checkRateLimit(ip: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const record = attempts.get(ip);

  // Jika belum ada record atau window sudah lewat, buat/reset record
  if (!record || now > record.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + windowMs });
    return true; // allowed
  }

  // Jika sudah melebihi batas, kembalikan false
  if (record.count >= maxAttempts) {
    return false; // blocked
  }

  // Tambahkan hit
  record.count++;
  return true; // allowed
}
