import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Video, Building, MessageCircle, Mail, Calendar, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type MeetingType = "on-site" | "gmeet" | "office" | "whatsapp" | "email";

interface MeetingOption {
  id: MeetingType;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  actionLabel: string;
}

const MeetingScheduler = () => {
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingType | null>(null);

  const whatsappNumber = "917411349844";
  const email = "hello@vanillasometh.in";

  const meetingOptions: MeetingOption[] = [
    {
      id: "on-site",
      title: "On-Site Visit",
      description: "We'll visit your project location for detailed discussion",
      icon: <MapPin className="size-5" />,
      action: () => {
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I'd like to schedule an on-site visit to discuss my project.")}`, '_blank');
      },
      actionLabel: "Request Site Visit"
    },
    {
      id: "gmeet",
      title: "Google Meet",
      description: "Virtual meeting via Google Meet",
      icon: <Video className="size-5" />,
      action: () => {
        window.location.href = `mailto:${email}?subject=${encodeURIComponent("Schedule Google Meet - Project Discussion")}&body=${encodeURIComponent("Hi! I'd like to schedule a Google Meet to discuss my project.")}`;
      },
      actionLabel: "Schedule Meet"
    },
    {
      id: "office",
      title: "Office Visit",
      description: "Visit our office for in-person consultation",
      icon: <Building className="size-5" />,
      action: () => {
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I'd like to schedule an office visit to discuss my project.")}`, '_blank');
      },
      actionLabel: "Book Office Visit"
    },
    {
      id: "whatsapp",
      title: "WhatsApp Chat",
      description: "Immediate response via WhatsApp",
      icon: <MessageCircle className="size-5" />,
      action: () => {
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I received my project estimate and would like to discuss further.")}`, '_blank');
      },
      actionLabel: "Chat Now"
    },
    {
      id: "email",
      title: "Email Us",
      description: "Send us detailed requirements via email",
      icon: <Mail className="size-5" />,
      action: () => {
        window.location.href = `mailto:${email}?subject=${encodeURIComponent("Project Estimate Follow-up")}&body=${encodeURIComponent("Hi! I've received my project estimate and would like to discuss the next steps.")}`;
      },
      actionLabel: "Send Email"
    }
  ];

  const handleMeetingSelect = (option: MeetingOption) => {
    setSelectedMeeting(option.id);
    setTimeout(() => {
      option.action();
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white p-6 rounded-xl border border-vs/10 shadow-sm"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center size-12 rounded-full bg-vs/10 text-vs mb-3">
          <Calendar className="size-6" />
        </div>
        <h3 className="text-xl font-bold text-vs-dark mb-2">Schedule a Meeting With Us</h3>
        <p className="text-sm text-muted-foreground">
          Choose your preferred way to connect with our team
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {meetingOptions.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <button
              onClick={() => handleMeetingSelect(option)}
              className={cn(
                "w-full group relative flex flex-col items-start p-4 border rounded-lg transition-all duration-300 text-left hover:shadow-md",
                selectedMeeting === option.id
                  ? "border-vs bg-vs/5 shadow-sm"
                  : "border-gray-200 hover:border-vs/50"
              )}
            >
              <div className={cn(
                "flex items-center justify-center size-10 rounded-lg transition-colors mb-3",
                selectedMeeting === option.id
                  ? "bg-vs text-white"
                  : "bg-gray-100 text-gray-600 group-hover:bg-vs/10 group-hover:text-vs"
              )}>
                {selectedMeeting === option.id ? (
                  <CheckCircle2 className="size-5" />
                ) : (
                  option.icon
                )}
              </div>

              <h4 className="font-semibold text-vs-dark mb-1">{option.title}</h4>
              <p className="text-xs text-muted-foreground mb-3 flex-1">{option.description}</p>

              <span className={cn(
                "text-xs font-medium transition-colors",
                selectedMeeting === option.id
                  ? "text-vs"
                  : "text-gray-600 group-hover:text-vs"
              )}>
                {option.actionLabel} →
              </span>
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 size-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold mt-0.5">
            i
          </div>
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Quick Contact:</p>
            <p>WhatsApp: <a href={`https://wa.me/${whatsappNumber}`} className="underline font-medium">+{whatsappNumber}</a></p>
            <p>Email: <a href={`mailto:${email}`} className="underline font-medium">{email}</a></p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MeetingScheduler;
