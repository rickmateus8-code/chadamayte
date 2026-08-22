/**
 * Cryptographically Secure Public Token Generator for Invitations
 * Compatible with Cloudflare Workers / Web Crypto standard.
 *
 * Uses base62 alphabet (0-9, a-z, A-Z) to generate URL-safe, non-sequential,
 * high-entropy tokens.
 */

const BASE62_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export interface TokenGeneratorOptions {
  length?: number;
}

/**
 * Generates a cryptographically secure, URL-safe random token.
 * Default length is 24 characters (~143 bits of entropy).
 */
export function generateInvitationToken(options?: TokenGeneratorOptions): string {
  const length = options?.length ?? 24;
  if (length < 16) {
    throw new Error("Token length must be at least 16 characters for security entropy.");
  }

  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);

  let token = "";
  const alphabetLength = BASE62_ALPHABET.length;

  for (let i = 0; i < length; i++) {
    const byte = randomBytes[i];
    token += BASE62_ALPHABET[byte % alphabetLength];
  }

  return token;
}

/**
 * Generates a standard UUID v4 for database entity primary keys.
 */
export function generateId(prefix?: string): string {
  const uuid = crypto.randomUUID();
  return prefix ? `${prefix}_${uuid.replace(/-/g, "")}` : uuid;
}