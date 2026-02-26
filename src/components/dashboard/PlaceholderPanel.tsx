import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface PlaceholderPanelProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function PlaceholderPanel({ title, description, icon: Icon }: PlaceholderPanelProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full py-20">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
        <Icon className="w-9 h-9 text-primary/50" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground text-sm max-w-sm text-center">{description}</p>
    </motion.div>
  );
}
