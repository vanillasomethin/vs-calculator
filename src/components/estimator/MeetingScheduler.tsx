import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Video, Building, MessageCircle, Mail, Calendar, CheckCircle2, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type MainOptionType = "schedule" | "whatsapp" | "email";
type ScheduleSubOption = "on-site" | "in-office" | "virtual";

interface MainOption {
  id: MainOptionType;
  title: string;
  description: string;
  icon: React.ReactNode;
  hasSubOptions?: boolean;
  action?: () => void;
}

interface ScheduleOption {
  id: ScheduleSubOption;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

interface MeetingSchedulerProps {
  autoExpand?: boolean;
}

const MeetingScheduler = ({ autoExpand = false }: MeetingSchedulerProps) => {
  const [selectedMainOption, setSelectedMainOption] = useState<MainOptionType | null>(null);
  const [selectedSubOption, setSelectedSubOption] = useState<ScheduleSubOption | null>(null);
  const [shouldPulse, setShouldPulse] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Auto-expand when triggered from parent
  useEffect(() => {
    if (autoExpand && !selectedMainOption) {
      setShouldPulse(true);
      // Auto-dismiss pulse after 3 seconds
      const timer = setTimeout(() => setShouldPulse(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [autoExpand, selectedMainOption]);

  const whatsappNumber = "917411349844";
  const email = "hello@vanillasometh.in";

  const mainOptions: MainOption[] = [
    {
      id: "schedule",
      title: "Schedule Meeting",
      description: "Book a consultation session with our team",
      icon: <Calendar className="size-6" />,
      hasSubOptions: true,
    },
    {
      id: "whatsapp",
      title: "Quick Message (WhatsApp)",
      description: "Get instant response via WhatsApp",
      icon: <MessageCircle className="size-6" />,
      action: () => {
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I received my project estimate and would like to discuss further.")}`, '_blank');
      }
    },
    {
      id: "email",
      title: "Email Inquiry",
      description: "Send us detailed requirements via email",
      icon: <Mail className="size-6" />,
      action: () => {
        window.location.href = `mailto:${email}?subject=${encodeURIComponent("Project Estimate Follow-up")}&body=${encodeURIComponent("Hi! I've received my project estimate and would like to discuss the next steps.")}`;
      }
    }
  ];

  const scheduleOptions: ScheduleOption[] = [
    {
      id: "on-site",
      title: "On-site Visit",
      description: "We'll visit your project location",
      icon: <MapPin className="size-5" />,
      action: () => {
        const message = `Hi! I'd like to schedule an on-site visit to discuss my project.${selectedDate ? `\n\nPreferred Date: ${selectedDate}` : ''}${selectedTime ? `\nPreferred Time: ${selectedTime}` : ''}`;
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
      }
    },
    {
      id: "in-office",
      title: "In-Office Meeting",
      description: "Visit our office for consultation",
      icon: <Building className="size-5" />,
      action: () => {
        const message = `Hi! I'd like to schedule an office visit to discuss my project.${selectedDate ? `\n\nPreferred Date: ${selectedDate}` : ''}${selectedTime ? `\nPreferred Time: ${selectedTime}` : ''}`;
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
      }
    },
    {
      id: "virtual",
      title: "Virtual Meeting",
      description: "Online meeting via Google Meet/Zoom",
      icon: <Video className="size-5" />,
      action: () => {
        const body = `Hi! I'd like to schedule a virtual meeting to discuss my project.${selectedDate ? `\n\nPreferred Date: ${selectedDate}` : ''}${selectedTime ? `\nPreferred Time: ${selectedTime}` : ''}`;
        window.location.href = `mailto:${email}?subject=${encodeURIComponent("Schedule Virtual Meeting - Project Discussion")}&body=${encodeURIComponent(body)}`;
      }
    }
  ];

  const handleMainOptionClick = (option: MainOption) => {
    if (option.hasSubOptions) {
      setSelectedMainOption(option.id);
    } else {
      setSelectedMainOption(option.id);
      setTimeout(() => {
        option.action?.();
      }, 300);
    }
  };

  const handleSubOptionClick = (option: ScheduleOption) => {
    setSelectedSubOption(option.id);
    setTimeout(() => {
      option.action();
    }, 300);
  };

  const handleBack = () => {
    setSelectedMainOption(null);
    setSelectedSubOption(null);
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
          {selectedMainOption === "schedule"
            ? "Choose your preferred meeting type"
            : shouldPulse
              ? "Schedule a consultation to discuss your project in detail"
              : "Choose your preferred way to connect with our team"
          }
        </p>
      </div>

      <AnimatePresence mode="wait">
        {selectedMainOption === "schedule" ? (
          <motion.div
            key="schedule-options"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Back button */}
            <button
              onClick={handleBack}
              className="mb-4 text-sm text-vs hover:text-vs/80 flex items-center gap-1 transition-colors"
            >
              ← Back to main options
            </button>

            {/* Date & Time Selection */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-vs-dark mb-3 flex items-center gap-2">
                <Calendar className="size-4" />
                Select Preferred Date & Time
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-vs/20 focus:border-vs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Time</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-vs/20 focus:border-vs"
                  >
                    <option value="">Select time</option>
                    <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                    <option value="12:00 PM - 01:00 PM">12:00 PM - 01:00 PM</option>
                    <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                    <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
                    <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                    <option value="05:00 PM - 06:00 PM">05:00 PM - 06:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Schedule Sub-options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {scheduleOptions.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <button
                    onClick={() => handleSubOptionClick(option)}
                    className={cn(
                      "w-full group relative flex flex-col items-center p-5 border rounded-lg transition-all duration-300 text-center hover:shadow-md",
                      selectedSubOption === option.id
                        ? "border-vs bg-vs/5 shadow-sm"
                        : "border-gray-200 hover:border-vs/50"
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center size-12 rounded-lg transition-colors mb-3",
                      selectedSubOption === option.id
                        ? "bg-vs text-white"
                        : "bg-gray-100 text-gray-600 group-hover:bg-vs/10 group-hover:text-vs"
                    )}>
                      {selectedSubOption === option.id ? (
                        <CheckCircle2 className="size-6" />
                      ) : (
                        option.icon
                      )}
                    </div>

                    <h4 className="font-semibold text-vs-dark mb-2">{option.title}</h4>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="main-options"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {mainOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <button
                  onClick={() => handleMainOptionClick(option)}
                  className={cn(
                    "w-full group relative flex flex-col items-center p-6 border rounded-lg transition-all duration-300 text-center hover:shadow-md",
                    selectedMainOption === option.id && !option.hasSubOptions
                      ? "border-vs bg-vs/5 shadow-sm"
                      : "border-gray-200 hover:border-vs/50"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center size-14 rounded-lg transition-colors mb-4",
                    selectedMainOption === option.id && !option.hasSubOptions
                      ? "bg-vs text-white"
                      : "bg-gray-100 text-gray-600 group-hover:bg-vs/10 group-hover:text-vs"
                  )}>
                    {selectedMainOption === option.id && !option.hasSubOptions ? (
                      <CheckCircle2 className="size-7" />
                    ) : (
                      option.icon
                    )}
                  </div>

                  <h4 className="font-semibold text-vs-dark mb-2 text-base">{option.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{option.description}</p>

                  {option.hasSubOptions && (
                    <div className="flex items-center gap-1 text-xs font-medium text-vs group-hover:gap-2 transition-all">
                      View Options <ChevronRight className="size-4" />
                    </div>
                  )}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 size-5 rounded-full bg-vs text-white flex items-center justify-center text-xs font-bold mt-0.5">
            i
          </div>
          <div className="text-sm text-red-900">
            <p className="font-medium mb-1">Quick Contact:</p>
            <p>WhatsApp: <a href={`https://wa.me/${whatsappNumber}`} className="underline font-medium hover:text-vs">+{whatsappNumber}</a></p>
            <p>Email: <a href={`mailto:${email}`} className="underline font-medium hover:text-vs">{email}</a></p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MeetingScheduler;
