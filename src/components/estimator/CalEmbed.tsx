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
 * Embeds the Cal.com booking interface directly in the app
 */
const CalEmbed = ({
  calLink = "vanilla-somethin-nezld5/15min",
  config = { layout: "month_view" },
  namespace = "15min"
}: CalEmbedProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace });
      cal("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#44080b" } // VS brand color
        },
        hideEventTypeDetails: false,
        layout: config.layout || "month_view",
        theme: config.theme || "light"
      });

      // Auto-click the button to open the embed
      setTimeout(() => {
        buttonRef.current?.click();
      }, 100);
    })();
  }, [namespace, config]);

  return (
    <div className="w-full h-full min-h-[600px]">
      <button
        ref={buttonRef}
        data-cal-namespace={namespace}
        data-cal-link={calLink}
        data-cal-config={JSON.stringify(config)}
        className="w-full py-8 px-4 bg-vs/5 hover:bg-vs/10 border-2 border-vs/20 rounded-lg transition-colors text-vs font-semibold"
      >
        Click to Open Cal.com Booking
      </button>
    </div>
  );
};

export default CalEmbed;
