import { useQuery } from 'react-query';
import authProvider from '../../../authProvider';

export type MembershipYearRow = {
  year: number;
  systems: number;
  associates: number;
};

/**
 * Year-over-year membership counts, derived server-side from the invoice
 * ledger (see api::membership-year-report). The chart previously carried
 * hardcoded 2021–2023 figures with the current year bolted on from expired
 * counts, so it could neither gain new years nor be trusted.
 */
export const useMembershipYearReport = () => {
  const { data, isLoading, error } = useQuery<MembershipYearRow[], Error>(
    ['membership-year-report'],
    async () => {
      const identity = await authProvider.getIdentity?.();
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/membership-year-report`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(identity as any)?.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Year report request failed (${response.status})`);
      }

      return response.json();
    }
  );

  return {
    rows: data ?? [],
    isLoading,
    error: error ?? undefined,
  };
};
