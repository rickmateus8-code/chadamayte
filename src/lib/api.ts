import type { HealthResponse } from "../types";

export async function fetchHealth(): Promise<HealthResponse> {
  try {
    const response = await fetch("/api/health");
    if (!response.ok) {
      return { ok: false, service: "mayte-baby-shower" };
    }
    return await response.json();
  } catch (_error) {
    return { ok: false, service: "mayte-baby-shower" };
  }
}