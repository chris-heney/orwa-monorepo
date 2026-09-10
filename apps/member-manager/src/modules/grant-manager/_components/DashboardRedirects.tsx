import React from "react";
import { Navigate } from "react-router-dom";

/**
 * The grant lists have exactly one renderer — the dashboard tabs. The
 * react-admin resource `list` routes (`/grant-application-finals`,
 * `/grant-payouts`) therefore forward to the matching tab instead of
 * mounting a second, unfiltered `List`.
 */
export const ApplicationsListRedirect = () => (
  <Navigate to="/grant/dashboard?tab=applications" replace />
);

export const PayoutsListRedirect = () => (
  <Navigate to="/grant/dashboard?tab=payouts" replace />
);
