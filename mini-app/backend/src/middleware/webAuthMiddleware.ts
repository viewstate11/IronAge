import type {
  NextFunction,
  Request,
  Response,
} from "express";

export type WebAuthenticatedRequest =
  Request & {
    webId: string;
  };

export function requireWebAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const webId =
    req.header(
      "x-ironage-web-id"
    )?.trim();

  if (!webId) {
    res.status(401).json({
      success: false,
      message:
        "IRONAGE web authentication required",
    });

    return;
  }

  /*
   * UUID validation.
   */
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(webId)) {
    res.status(401).json({
      success: false,
      message:
        "Invalid IRONAGE web identity",
    });

    return;
  }

  const authenticatedRequest =
    req as WebAuthenticatedRequest;

  authenticatedRequest.webId =
    webId;

  next();
}