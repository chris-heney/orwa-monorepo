import React, { ComponentProps, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import HighchartsReact, {
  HighchartsReactRefObject,
} from 'highcharts-react-official';

/** Same (deliberately loose) props `HighchartsReact` accepts at a call site. */
type ResponsiveHighchartProps = Omit<
  ComponentProps<typeof HighchartsReact>,
  'ref'
>;

/**
 * `HighchartsReact` that shrinks with its column.
 *
 * Highcharts only reflows on *window* resize. When a `RightDrawer` opens, the
 * content column narrows without a window resize, so the chart keeps its old
 * pixel width; react-admin's layout root is `min-width: fit-content`, so that
 * stale SVG then widens the whole page and pushes the heading actions under
 * the drawer (Grant summary, 2026-09-09).
 *
 * Two things fix it, and every summary chart should render through here:
 * - the host is `width: 0; min-width: 100%`, so the chart's intrinsic width
 *   never contributes to the page's fit-content;
 * - a ResizeObserver on the host calls `chart.reflow()` whenever the column
 *   changes, so the chart redraws at the new width.
 */
const ResponsiveHighchart = (props: ResponsiveHighchartProps) => {
  const chartRef = useRef<HighchartsReactRefObject>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof ResizeObserver === 'undefined') return;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => chartRef.current?.chart?.reflow());
    });
    observer.observe(host);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <Box
      ref={hostRef}
      sx={{ width: 0, minWidth: '100%', maxWidth: '100%', overflow: 'hidden' }}
    >
      <HighchartsReact ref={chartRef} {...props} />
    </Box>
  );
};

export default ResponsiveHighchart;
