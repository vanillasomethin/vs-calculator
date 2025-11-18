import { useEffect, useRef } from "react";
import { getCalApi } from "@calcom/embed-react";

interface CalEmbedProps {
  calLink?: string;
  config?: {
    layout?: string;
    theme?: string;
  };
  namespace?: string;
}

/**
 * Cal.com Embed Component
 * Embeds the Cal.com booking interface directly inline in the app
 */
const CalEmbed = ({
  calLink = "vanilla-somethin-nezld5/30min",
  config = { layout: "month_view" },
  namespace = "meeting"
}: CalEmbedProps) => {
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace });

      // Configure Cal.com UI to be inline
      cal("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#44080b" } // VS brand color
        },
        hideEventTypeDetails: false,
        layout: config.layout || "month_view",
        theme: config.theme || "light",
        styles: {
          body: {
            background: "transparent"
          }
        }
      });

      // Initialize the inline embed
      cal("inline", {
        elementOrSelector: embedRef.current,
        calLink: calLink,
        config: config
      });

      // Cleanup on modal close
      cal("on", {
        action: "bookingSuccessful",
        callback: () => {
          // Handle successful booking
          console.log("Booking successful!");
        }
      });
    })();

    // Cleanup on unmount
    return () => {
      const overlays = document.querySelectorAll('[class*="cal-"][class*="overlay"], [id*="cal-"][id*="backdrop"]');
      overlays.forEach(el => el.remove());
      document.body.style.overflow = '';
      document.body.style.pointerEvents = '';
    };
  }, [namespace, config, calLink]);

  return (
    <div
      ref={embedRef}
      className="w-full min-h-[500px] cal-inline-embed"
      style={{ minHeight: '500px' }}
    />
  );
};

export default CalEmbed;
