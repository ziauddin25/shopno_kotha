/**
 * Typed failures for the data layer.
 *
 * Services never swallow these: a failed database request must surface as an
 * error (rendered by the segment error boundary) instead of quietly serving
 * fixture data to production readers.
 */

export type RepositoryErrorKind = "database" | "validation" | "configuration";

export class RepositoryError extends Error {
  readonly scope: string;
  readonly kind: RepositoryErrorKind;

  constructor(scope: string, kind: RepositoryErrorKind, message: string, cause?: unknown) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = "RepositoryError";
    this.scope = scope;
    this.kind = kind;
  }
}

export function databaseError(scope: string, detail?: string | null, cause?: unknown): RepositoryError {
  return new RepositoryError(
    scope,
    "database",
    `Database query failed in "${scope}"${detail ? `: ${detail}` : "."}`,
    cause,
  );
}

export function configurationError(scope: string, detail: string, cause?: unknown): RepositoryError {
  return new RepositoryError(scope, "configuration", detail, cause);
}

export function validationError(scope: string, detail: string): RepositoryError {
  return new RepositoryError(scope, "validation", `Invalid input in "${scope}": ${detail}`);
}
