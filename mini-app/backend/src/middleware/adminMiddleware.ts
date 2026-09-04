import type {
  NextFunction,
  Request,
  Response,
} from "express";

import type {
  AppAuthenticatedRequest,
} from "./appAuthMiddleware.js";

/* =========================================================
   ADMIN USER IDS

   Example:
   IRONAGE_ADMIN_USER_IDS=1,25,84
========================================================= */

function getAdminUserIds(): Set<number> {
  const raw =
    process.env
      .IRONAGE_ADMIN_USER_IDS
      ?.trim() ?? "";

  if (!raw) {
    return new Set();
  }

  return new Set(
    raw
      .split(",")
      .map(value =>
        Number(
          value.trim()
        )
      )
      .filter(value =>
        Number.isInteger(value) &&
        value > 0
      )
  );
}

/* =========================================================
   REQUIRE ADMIN

   requireAppAuth MUST run before this middleware.
========================================================= */

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authenticatedRequest =
    req as AppAuthenticatedRequest;

  const userId =
    authenticatedRequest.appUserId;

  if (
    !Number.isInteger(userId) ||
    userId <= 0
  ) {
    res.status(401).json({
      success: false,
      message:
        "IRONAGE authentication required",
    });

    return;
  }

  const adminUserIds =
    getAdminUserIds();

  if (
    adminUserIds.size === 0
  ) {
    res.status(503).json({
      success: false,
      message:
        "IRONAGE admin access is not configured",
    });

    return;
  }

  if (
    !adminUserIds.has(
      userId
    )
  ) {
    res.status(403).json({
      success: false,
      message:
        "IRONAGE admin access denied",
    });

    return;
  }

  next();
}
