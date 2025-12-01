export type CommonErrorCode =
  | 'BAD_REQUEST'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'TIMEOUT'
  | 'SERVICE_UNAVAILABLE'
  | 'INTERNAL_ERROR';

export const ERROR_HTTP_STATUS: Record<CommonErrorCode, number> = {
  BAD_REQUEST: 400,
  VALIDATION_ERROR: 422,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  TIMEOUT: 504,
  SERVICE_UNAVAILABLE: 503,
  INTERNAL_ERROR: 500,
};

export const ERROR_MESSAGES: Record<CommonErrorCode, string> = {
  BAD_REQUEST: 'bad request',
  VALIDATION_ERROR: 'validation failed',
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  NOT_FOUND: 'not found',
  CONFLICT: 'conflict',
  RATE_LIMITED: 'too many requests',
  TIMEOUT: 'timeout',
  SERVICE_UNAVAILABLE: 'service unavailable',
  INTERNAL_ERROR: 'internal error',
};

export interface AppErrorShape<Detail = unknown> {
  code: CommonErrorCode;
  message: string;
  httpStatus: number;
  detail?: Detail;
  help?: string;
  source?: string;
}

export interface AppErrorProps<Detail = unknown> {
  code: CommonErrorCode;
  message?: string;
  httpStatus?: number;
  detail?: Detail;
  help?: string;
  source?: string;
  cause?: unknown;
}

/**
 * Lightweight error that keeps a portable payload for logging or HTTP responses.
 */
export class AppError<Detail = unknown> extends Error implements AppErrorShape<Detail> {
  readonly code: CommonErrorCode;

  readonly httpStatus: number;

  readonly detail?: Detail;

  readonly help?: string;

  readonly source?: string;

  readonly cause?: unknown;

  constructor(props: AppErrorProps<Detail>) {
    const message = props.message ?? ERROR_MESSAGES[props.code] ?? 'unexpected error';
    super(message);
    this.name = 'AppError';
    this.code = props.code;
    this.httpStatus = props.httpStatus ?? ERROR_HTTP_STATUS[props.code] ?? 500;
    this.detail = props.detail;
    this.help = props.help;
    this.source = props.source;
    this.cause = props.cause;
  }

  toJSON(): AppErrorShape<Detail> {
    return {
      code: this.code,
      message: this.message,
      httpStatus: this.httpStatus,
      detail: this.detail,
      help: this.help,
      source: this.source,
    };
  }
}

export function isAppError(value: unknown): value is AppError {
  return value instanceof AppError;
}

export function normalizeError(value: unknown, fallbackCode: CommonErrorCode = 'INTERNAL_ERROR'): AppError {
  if (value instanceof AppError) {
    return value;
  }

  if (value instanceof Error) {
    return new AppError({
      code: fallbackCode,
      message: value.message,
      cause: value,
    });
  }

  const message = typeof value === 'string' ? value : ERROR_MESSAGES[fallbackCode];
  return new AppError({
    code: fallbackCode,
    message,
    detail: value,
  });
}
