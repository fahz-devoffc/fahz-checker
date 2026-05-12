import { motion, AnimatePresence } from "motion/react";
import { Home, Globe, FileCode, Users, Menu, X, ShieldAlert } from "lucide-react";
import { Tab } from "@/src/types";

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: SidebarProps) {
  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "main", label: "Main", icon: Home },
    { id: "web", label: "Scanner Web", icon: Globe },
    { id: "file", label: "Scanner File", icon: FileCode },
    { id: "developer", label: "Developer", icon: Users },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Hamburger Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg lg:hidden"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Content */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isOpen ? 0 : -300,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 z-50 p-6 lg:translate-x-0 lg:opacity-100"
      >
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="p-2 bg-red-500 rounded-xl">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight">BRC7 Scanner</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Vulnerability Expert</p>
          </div>
        </div>

        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => {
                setActiveTab(tab.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === tab.id
                  ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-medium"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-red-500" : "group-hover:text-red-400"}`} />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="active-indicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-10 left-6 right-6">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
            <p className="text-xs text-zinc-500 mb-2">Powered by</p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Gemini 3.0 AI</p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
