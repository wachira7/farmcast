export type ApiErrorCode = "rate_limited" | "unauthorized" | "not_found" | "server_error" | "unavailable" | "unknown"

export interface ApiError {
  code: ApiErrorCode
  message: string
  retryAfter?: number // seconds
}

export function parseApiError(status: number, body: Record<string, unknown>, headers?: Headers): ApiError {
  switch (status) {
    case 429: {
      const reset = headers?.get("X-RateLimit-Reset") ?? headers?.get("Retry-After")
      const retryAfter = reset ? Math.ceil((parseInt(reset) * 1000 - Date.now()) / 1000) : 60
      return {
        code: "rate_limited",
        message: "You've hit the monthly request limit.",
        retryAfter: Math.max(retryAfter, 0),
      }
    }
    case 401:
    case 403:
      return { code: "unauthorized", message: "Invalid API key. Check your configuration." }
    case 404:
      return { code: "not_found", message: (body.error as string) ?? "Location not found." }
    case 502:
      return { code: "unavailable", message: "Weather service gateway error. Try again in a moment." }
    case 503:
      return { code: "unavailable", message: "Weather service is temporarily unavailable. Try again shortly." }
    case 500:
      return { code: "server_error", message: "Something went wrong on the weather service. Try again." }
    default:
      return { code: "unknown", message: (body.error as string) ?? `Unexpected error (${status}).` }
  }
}

export function userFacingMessage(error: ApiError): string {
  if (error.code === "rate_limited" && error.retryAfter) {
    const mins = Math.ceil(error.retryAfter / 60)
    return `${error.message} Quota resets in ~${mins} minute${mins === 1 ? "" : "s"}.`
  }
  return error.message
}
