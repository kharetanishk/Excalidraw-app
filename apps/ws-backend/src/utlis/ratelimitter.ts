const userMessageLog = new Map<string, number[]>();

export function canSendAndRecord(
  userId: string,
  maxMessages = 5,
  windowMs = 10_000
) {
  const now = Date.now();
  const timestamps = userMessageLog.get(userId) ?? [];
  const recent = timestamps.filter((t) => now - t < windowMs);
  recent.push(now);
  userMessageLog.set(userId, recent);
  return recent.length <= maxMessages;
}

export function resetUserRateLimit(userId: string) {
  userMessageLog.delete(userId);
}
