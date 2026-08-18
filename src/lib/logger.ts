type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  ts: number;
  level: LogLevel;
  msg: string;
  ctx?: Record<string, unknown>;
}

const buffer: LogEntry[] = [];
let timer: ReturnType<typeof setInterval> | null = null;

function flush(): void {
  if (buffer.length === 0) return;
  const batch = buffer.splice(0);
  for (const e of batch) {
    const prefix = `[QUIZ ${e.level.toUpperCase()}]`;
    const payload = e.ctx
      ? { ...e.ctx, _ts: new Date(e.ts).toISOString() }
      : { _ts: new Date(e.ts).toISOString() };
    if (e.level === 'error') console.error(prefix, e.msg, payload);
    else if (e.level === 'warn') console.warn(prefix, e.msg, payload);
    else console.log(prefix, e.msg, payload);
  }
}

export const logger = {
  info(msg: string, ctx?: Record<string, unknown>): void {
    buffer.push({ ts: Date.now(), level: 'info', msg, ctx });
  },
  warn(msg: string, ctx?: Record<string, unknown>): void {
    buffer.push({ ts: Date.now(), level: 'warn', msg, ctx });
  },
  error(msg: string, ctx?: Record<string, unknown>): void {
    buffer.push({ ts: Date.now(), level: 'error', msg, ctx });
    flush();
  },
  start(intervalMs = 5000): void {
    if (timer) return;
    timer = setInterval(flush, intervalMs);
  },
  stop(): void {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    flush();
  },
};
