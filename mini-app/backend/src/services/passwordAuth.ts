import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";

import { promisify } from "node:util";

const scrypt = promisify(
  scryptCallback
);

const KEY_LENGTH = 64;

const DUMMY_PASSWORD_HASH =
  "scrypt$00000000000000000000000000000000$" +
  "0000000000000000000000000000000000000000000000000000000000000000" +
  "0000000000000000000000000000000000000000000000000000000000000000";

export async function hashPassword(
  password: string
): Promise<string> {
  const salt =
    randomBytes(16).toString("hex");

  const derivedKey =
    (await scrypt(
      password,
      salt,
      KEY_LENGTH
    )) as Buffer;

  return [
    "scrypt",
    salt,
    derivedKey.toString("hex"),
  ].join("$");
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [
    algorithm,
    salt,
    hashHex,
  ] = storedHash.split("$");

  if (
    algorithm !== "scrypt" ||
    !salt ||
    !hashHex
  ) {
    return false;
  }

  let storedKey: Buffer;

  try {
    storedKey =
      Buffer.from(
        hashHex,
        "hex"
      );
  } catch {
    return false;
  }

  if (
    storedKey.length !== KEY_LENGTH
  ) {
    return false;
  }

  const derivedKey =
    (await scrypt(
      password,
      salt,
      KEY_LENGTH
    )) as Buffer;

  return timingSafeEqual(
    storedKey,
    derivedKey
  );
}

export async function verifyPasswordOrDummy(
  password: string,
  storedHash?: string | null
): Promise<boolean> {
  return verifyPassword(
    password,
    storedHash ||
      DUMMY_PASSWORD_HASH
  );
}
