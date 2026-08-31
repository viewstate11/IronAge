import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile =
  fileURLToPath(import.meta.url);

const currentDirectory =
  path.dirname(currentFile);

const CERTIFICATES_DIRECTORY =
  path.resolve(
    currentDirectory,
    "../../certs/apple"
  );

const CERTIFICATE_FILES = [
  "AppleIncRootCertificate.cer",
  "AppleRootCA-G2.cer",
  "AppleRootCA-G3.cer",
] as const;

let cachedCertificates:
  Buffer[] | null = null;

export function getAppleRootCertificates():
  Buffer[] {
  if (cachedCertificates) {
    return cachedCertificates;
  }

  const certificates =
    CERTIFICATE_FILES.map(
      (fileName) => {
        const certificatePath =
          path.join(
            CERTIFICATES_DIRECTORY,
            fileName
          );

        if (
          !fs.existsSync(
            certificatePath
          )
        ) {
          throw new Error(
            `Apple root certificate missing: ${fileName}`
          );
        }

        const certificate =
          fs.readFileSync(
            certificatePath
          );

        if (
          certificate.length === 0
        ) {
          throw new Error(
            `Apple root certificate empty: ${fileName}`
          );
        }

        return certificate;
      }
    );

  cachedCertificates =
    certificates;

  return certificates;
}
