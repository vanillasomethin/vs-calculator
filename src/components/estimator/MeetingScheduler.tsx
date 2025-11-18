import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Mail, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import CalEmbed from "./CalEmbed";

interface MeetingSchedulerProps {
  autoExpand?: boolean;
  estimate?: any; // ProjectEstimate
}

const MeetingScheduler = ({ autoExpand = false, estimate }: MeetingSchedulerProps) => {
  const [shouldPulse, setShouldPulse] = useState(false);

  // Auto-expand when triggered from parent
  useEffect(() => {
    if (autoExpand) {
      setShouldPulse(true);
      // Auto-dismiss pulse after 3 seconds
      const timer = setTimeout(() => setShouldPulse(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [autoExpand]);

  const whatsappNumber = "917411349844";
  const email = "hello@vanillasometh.in";

  const handleWhatsAppClick = () => {
    const message = `Hi! I'd like to schedule a consultation to discuss my project. Please let me know your availability.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${email}?subject=${encodeURIComponent("Project Consultation Request")}&body=${encodeURIComponent("Hi! I'd like to schedule a consultation to discuss my project. Please let me know your availability.")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: shouldPulse ? [1, 1.02, 1] : 1,
      }}
      transition={{
        duration: 0.5,
        delay: 0.2,
        scale: {
          repeat: shouldPulse ? 2 : 0,
          duration: 0.6,
        }
      }}
      className={cn(
        "bg-white p-6 rounded-xl border shadow-sm transition-all duration-300",
        shouldPulse
          ? "border-vs shadow-lg ring-2 ring-vs/20"
          : "border-vs/10"
      )}
    >
      <div className="text-center mb-6">
        <div className={cn(
          "inline-flex items-center justify-center size-12 rounded-full transition-all duration-300 mb-3",
          shouldPulse
            ? "bg-vs text-white animate-pulse"
            : "bg-vs/10 text-vs"
        )}>
          <Calendar className="size-6" />
        </div>
        <h3 className="text-xl font-bold text-vs-dark mb-2">
          {shouldPulse ? "👋 Ready to get started?" : "Let's Connect"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {shouldPulse
            ? "Schedule a consultation to discuss your project in detail"
            : "Choose your preferred way to connect with our team"
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cal.com Calendar - First Option */}
        <div className="lg:col-span-2">
          <div className="bg-vs/5 border-2 border-vs/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="size-6 text-vs" />
              <div>
                <h4 className="font-semibold text-vs-dark">Schedule a Meeting</h4>
                <p className="text-sm text-muted-foreground">Pick your preferred time slot</p>
              </div>
            </div>

            {/* Embedded Cal.com calendar */}
            <CalEmbed
              calLink="vanilla-somethin-nezld5/30min"
              config={{ layout: "month_view" }}
              namespace="meeting-scheduler"
            />
          </div>
        </div>

        {/* WhatsApp and Email Options */}
        <div className="space-y-4">
          <button
            onClick={handleWhatsAppClick}
            className="w-full group relative flex flex-col items-center p-6 border-2 rounded-lg transition-all duration-300 text-center hover:shadow-md border-gray-200 hover:border-vs/50"
          >
            <div className="flex items-center justify-center size-14 rounded-lg transition-colors mb-4 bg-gray-100 text-gray-600 group-hover:bg-vs/10 group-hover:text-vs">
              <MessageCircle className="size-6" />
            </div>
            <h4 className="font-semibold text-vs-dark mb-2 text-base">Request via WhatsApp</h4>
            <p className="text-sm text-muted-foreground">On-site or Office visit</p>
          </button>

          <button
            onClick={handleEmailClick}
            className="w-full group relative flex flex-col items-center p-6 border-2 rounded-lg transition-all duration-300 text-center hover:shadow-md border-gray-200 hover:border-vs/50"
          >
            <div className="flex items-center justify-center size-14 rounded-lg transition-colors mb-4 bg-gray-100 text-gray-600 group-hover:bg-vs/10 group-hover:text-vs">
              <Mail className="size-6" />
            </div>
            <h4 className="font-semibold text-vs-dark mb-2 text-base">Contact via Email</h4>
            <p className="text-sm text-muted-foreground">Send detailed requirements</p>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MeetingScheduler;
