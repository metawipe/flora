import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    beforeSend(event) {
      const extras = event.extra;
      if (extras && typeof extras === "object") {
        for (const key of Object.keys(extras)) {
          if (/phone|password|address/i.test(key)) {
            extras[key] = "[Filtered]";
          }
        }
      }
      return event;
    },
  });
}
