/**
 * Módulo Criptográfico Seguro de Ponta a Ponta do Gabinete Real
 * Padrão Web Crypto API (PBKDF2-SHA256 e HMAC-SHA256) nativo de Cloudflare Workers.
 */

const ROYAL_SALT = "mayte_royal_salt_2026_secure";
const HMAC_SECRET = "mayte_hmac_secret_key_session_2026";
const AUTHORIZED_EMAIL = "rickmateus2021@gmail.com";
// Hash PBKDF2-SHA256 (100.000 iterações) da senha autorizada dos pais
const EXPECTED_HASH_HEX = "d81d6ff3575a65e66eb9120ee968d4172764f815fa29a9b77d3434387c239cb9";

/**
 * Deriva um hash criptográfico seguro a partir da senha e do salt real via PBKDF2
 */
export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode(ROYAL_SALT),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  const exported = (await crypto.subtle.exportKey("raw", derivedKey)) as ArrayBuffer;
  const bytes = new Uint8Array(exported);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Valida com segurança de ponta a ponta as credenciais fornecidas pelos pais
 */
export async function verifyParentCredentials(
  email: string,
  password: string
): Promise<boolean> {
  if (!email || !password) return false;
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail !== AUTHORIZED_EMAIL) {
    return false;
  }

  const computedHash = await hashPassword(password);
  // Constant-time string comparison to prevent timing attacks
  if (computedHash.length !== EXPECTED_HASH_HEX.length) return false;
  let mismatch = 0;
  for (let i = 0; i < computedHash.length; i++) {
    mismatch |= computedHash.charCodeAt(i) ^ EXPECTED_HASH_HEX.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Cria um token de sessão criptográfico assinado via HMAC-SHA256 (validade de 7 dias)
 */
export async function createSignedAdminToken(email: string): Promise<string> {
  const enc = new TextEncoder();
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 dias
  const payload = `${email.trim().toLowerCase()}:${expiresAt}`;

  const hmacKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(HMAC_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", hmacKey, enc.encode(payload));
  const signatureHex = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const payloadBase64 = btoa(payload);
  return `mayte_sec_${payloadBase64}.${signatureHex}`;
}

/**
 * Valida a integridade criptográfica e expiração do token assinado
 */
export async function verifySignedAdminToken(
  token: string
): Promise<{ valid: boolean; email?: string }> {
  try {
    if (!token || !token.startsWith("mayte_sec_")) {
      return { valid: false };
    }

    const raw = token.replace("mayte_sec_", "");
    const [payloadBase64, providedSigHex] = raw.split(".");
    if (!payloadBase64 || !providedSigHex) return { valid: false };

    const payload = atob(payloadBase64);
    const [email, expiresStr] = payload.split(":");
    const expiresAt = parseInt(expiresStr || "0", 10);

    if (Date.now() > expiresAt) {
      return { valid: false }; // Token expirado
    }

    const enc = new TextEncoder();
    const hmacKey = await crypto.subtle.importKey(
      "raw",
      enc.encode(HMAC_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const expectedSigBuffer = await crypto.subtle.sign("HMAC", hmacKey, enc.encode(payload));
    const expectedSigHex = Array.from(new Uint8Array(expectedSigBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (providedSigHex.length !== expectedSigHex.length) return { valid: false };
    let mismatch = 0;
    for (let i = 0; i < providedSigHex.length; i++) {
      mismatch |= providedSigHex.charCodeAt(i) ^ expectedSigHex.charCodeAt(i);
    }

    if (mismatch !== 0) return { valid: false };

    return { valid: true, email };
  } catch {
    return { valid: false };
  }
}
