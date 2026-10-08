/**
 * Contract boundary for services that already exist outside this frontend workspace.
 * Endpoint URLs, request/response schemas, authentication and model output handling
 * must be provided by the owning backend integration before connecting UI actions.
 * Do not create local clinical scoring, diagnostic, identity or PDF substitutes here.
 */
export type ClinicalServiceState = 'not-configured' | 'connected' | 'error';

export const clinicalServiceRequirements = {
  risk: 'Existing FastAPI risk engine — request/response contract required',
  vision: 'Existing Gemini Vision service — upload protocol and accepted response required',
  assistant: 'Existing Groq RAG service — chat protocol and clinical guardrails required',
  identity: 'Organization authentication provider — identity and OTP workflow required',
  gltf: 'Existing Three.js / React Three Fiber GLTF heart model — asset path or component required',
  reporting: 'Clinical PDF exporter — report schema and rendering/export contract required',
} as const;
