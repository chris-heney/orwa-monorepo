import { useMemo } from "react";
import {
  useGetMany,
  useListContext,
  useRecordContext,
  RaRecord,
} from "react-admin";
import { Box, Typography } from "@mui/material";
import { CurrencyOptions } from "../../../config/Settings";
import {
  freeVendorAllowance,
  isVendorTicket,
} from "../helpers/freeVendorAllowance";

const money = (value: number) =>
  new Intl.NumberFormat("en-US", CurrencyOptions).format(value);

type Props = {
  boothCount: number;
};

/**
 * Shows catalog ticket price, with strike-through + $0.00 when the attendee
 * is within the booth-bundled complimentary Vendor allowance.
 */
const AttendeeTicketPriceField = ({ boothCount }: Props) => {
  const attendee = useRecordContext<RaRecord>();
  const { data, ids } = useListContext();
  const freeSlots = freeVendorAllowance(boothCount);

  const ticketIds = useMemo(() => {
    const unique = new Set<string | number>();
    for (const id of ids ?? []) {
      const row = data?.[id];
      const ticketId = row?.conference_ticket;
      if (ticketId != null) unique.add(ticketId);
    }
    return Array.from(unique);
  }, [ids, data]);

  const { data: tickets, isLoading } = useGetMany(
    "conference-tickets",
    { ids: ticketIds },
    { enabled: ticketIds.length > 0 }
  );

  const ticketById = useMemo(() => {
    const map = new Map<string | number, RaRecord>();
    for (const ticket of tickets ?? []) {
      if (ticket?.id != null) map.set(ticket.id, ticket);
    }
    return map;
  }, [tickets]);

  if (!attendee) return null;

  const thisTicket = ticketById.get(attendee.conference_ticket);
  const listPrice = Number(thisTicket?.price_online) || 0;

  if (isLoading && !thisTicket) {
    return <Typography component="span">…</Typography>;
  }

  let vendorOrdinal = -1;
  if (isVendorTicket(thisTicket) && freeSlots > 0) {
    let cursor = 0;
    for (const id of ids ?? []) {
      const row = data?.[id];
      if (!row) continue;
      const rowTicket = ticketById.get(row.conference_ticket);
      if (!isVendorTicket(rowTicket)) continue;
      if (String(id) === String(attendee.id)) {
        vendorOrdinal = cursor;
        break;
      }
      cursor += 1;
    }
  }

  const compensated = vendorOrdinal >= 0 && vendorOrdinal < freeSlots;

  if (compensated) {
    return (
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "baseline",
          gap: 1,
          whiteSpace: "nowrap",
        }}
        title="Included with booth registration"
      >
        <Typography
          component="span"
          variant="body2"
          sx={{
            textDecoration: "line-through",
            color: "text.secondary",
          }}
        >
          {money(listPrice)}
        </Typography>
        <Typography component="span" variant="body2" fontWeight={600}>
          {money(0)}
        </Typography>
      </Box>
    );
  }

  return (
    <Typography component="span" variant="body2">
      {money(listPrice)}
    </Typography>
  );
};

export default AttendeeTicketPriceField;
