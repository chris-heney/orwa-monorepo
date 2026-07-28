import { useLayoutEffect, useRef, useState } from "react";

/**
 * Embeds the public grant map and stretches it to the viewport bottom:
 * height = window.innerHeight - iframeTop - bottomGap.
 */
const GrantMapEmbed = () => {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(600);

  useLayoutEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      setHeight(Math.max(320, Math.floor(window.innerHeight - top - 8)));
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);

    const ro = new ResizeObserver(update);
    ro.observe(document.body);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      ro.disconnect();
    };
  }, []);

  return (
    <iframe
      ref={ref}
      src="https://orwa.org/gapp-map/"
      title="GAPP Map"
      width="100%"
      height={height}
      allowFullScreen
      style={{ border: 0, display: "block", verticalAlign: "top" }}
    />
  );
};

export default GrantMapEmbed;
