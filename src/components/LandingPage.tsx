import { motion } from "motion/react";
import { ShieldCheck, Zap, Lock, Search, Target, Cpu } from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: Target,
      title: "Real-time Scanning",
      desc: "Analyze URLs and local files instantly with deep search capabilities.",
      color: "bg-blue-500"
    },
    {
      icon: Cpu,
      title: "AI Analysis",
      desc: "Powered by Gemini 3.0 to understand logic errors and security flaws.",
      color: "bg-red-500"
    },
    {
      icon: Lock,
      title: "Secure & Private",
      desc: "Your data stays in your browser's local storage. We don't store your code.",
      color: "bg-green-500"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <span className="px-4 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-6 inline-block">
          Advanced Cyber Security
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-zinc-100 mb-6 tracking-tight">
          BRC7 <span className="text-red-600">Vulnerability</span> <br /> Scanner
        </h1>
        <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Find vulnerabilities in your site, and find errors/weaknesses in your site files 
          equipped with artificial intelligence (AI) in real time.
        </p>
      </motion.div>

      <div className="grid md:grid-grid-cols-3 gap-8 mb-20">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-shadow duration-300"
          >
            <div className={`p-3 ${f.color} rounded-2xl w-fit mb-6 shadow-lg shadow-${f.color.split('-')[1]}-500/20`}>
              <f.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100">{f.title}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-10 bg-zinc-900 rounded-[2.5rem] relative overflow-hidden text-center"
      >
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">Start Securing Your Future</h2>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto">
            Choose a scan mode from the sidebar to begin your professional security assessment.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 rounded-2xl text-zinc-300 border border-zinc-700">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Enterprise Grade</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 rounded-2xl text-zinc-300 border border-zinc-700">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Real-time Analysis</span>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Circles */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
      </motion.div>
    </div>
  );
}
