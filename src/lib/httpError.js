export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
  }
}

export const badRequest = (message, details) => new HttpError(400, message, details);
export const notFound = (resource = 'Resource') => new HttpError(404, `${resource} not found`);

/**
 * Keep only whitelisted keys that are present on the body.
 */
export function pick(body, allowed) {
  return Object.fromEntries(
    Object.entries(body ?? {}).filter(([key]) => allowed.includes(key)),
  );
}
