import { AppError, ERROR_HTTP_STATUS, ERROR_MESSAGES, isAppError, normalizeError } from './errors';

describe('AppError', () => {
  it('fills defaults for a known error code', () => {
    const error = new AppError({ code: 'NOT_FOUND' });

    expect(error.message).toBe(ERROR_MESSAGES.NOT_FOUND);
    expect(error.httpStatus).toBe(ERROR_HTTP_STATUS.NOT_FOUND);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.toJSON()).toEqual(
      expect.objectContaining({
        code: 'NOT_FOUND',
        message: ERROR_MESSAGES.NOT_FOUND,
        httpStatus: ERROR_HTTP_STATUS.NOT_FOUND,
      }),
    );
  });

  it('accepts overrides when provided', () => {
    const error = new AppError({
      code: 'BAD_REQUEST',
      message: 'invalid payload',
      httpStatus: 400,
      detail: { field: 'repoUrl' },
      help: 'send a valid git URL',
      source: 'repos.controller',
    });

    expect(error.message).toBe('invalid payload');
    expect(error.detail).toEqual({ field: 'repoUrl' });
    expect(error.help).toBe('send a valid git URL');
    expect(error.source).toBe('repos.controller');
  });

  it('identifies AppError instances', () => {
    const domainError = new AppError({ code: 'CONFLICT' });
    const runtimeError = new Error('boom');

    expect(isAppError(domainError)).toBe(true);
    expect(isAppError(runtimeError)).toBe(false);
  });

  it('normalizes unknown errors to AppError', () => {
    const fromError = normalizeError(new Error('temporal offline'), 'SERVICE_UNAVAILABLE');
    const fromString = normalizeError('rate limit reached', 'RATE_LIMITED');

    expect(fromError.code).toBe('SERVICE_UNAVAILABLE');
    expect(fromError.message).toBe('temporal offline');

    expect(fromString.code).toBe('RATE_LIMITED');
    expect(fromString.message).toBe('rate limit reached');
    expect(fromString.detail).toBe('rate limit reached');
  });
});
