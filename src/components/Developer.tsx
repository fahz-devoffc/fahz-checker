import { motion } from "motion/react";
import { Github, Twitter, Linkedin, ExternalLink, ShieldCheck, Mail } from "lucide-react";

export default function Developer() {
  const developers = [
    {
      name: "Fahz",
      role: "Founder",
      bio: "Visionary behind BRC7, specializing in cyber security architecture and AI integration.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fahz",
      color: "from-red-500 to-orange-500"
    },
    {
      name: "Ais",
      role: "Lead Developer",
      bio: "Expert in full-stack security tools and implementing advanced AI-driven analysis engines.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ais",
      color: "from-blue-500 to-indigo-500"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">The BRC7 Team</h2>
        <p className="text-zinc-500 max-w-lg mx-auto">
          Meeting the minds behind the most advanced real-time AI vulnerability scanner.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {developers.map((dev, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${dev.color} blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity rounded-full`} />
            <div className="relative p-10 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 text-center">
              <div className={`w-32 h-32 mx-auto mb-8 p-1.5 bg-gradient-to-br ${dev.color} rounded-full`}>
                <div className="w-full h-full bg-white dark:bg-zinc-950 rounded-full overflow-hidden p-2">
                  <img src={dev.avatar} alt={dev.name} className="w-full h-full object-cover" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">{dev.name}</h3>
              <p className={`text-sm font-black uppercase tracking-widest mb-6 bg-gradient-to-r ${dev.color} bg-clip-text text-transparent`}>
                {dev.role}
              </p>
              
              <p className="text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed">
                {dev.bio}
              </p>

              <div className="flex justify-center gap-4">
                {[Mail, Github, Twitter, Linkedin].map((Icon, idx) => (
                  <button key={idx} className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-32 p-12 bg-zinc-900 rounded-[3rem] relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Join the Security Revolution</h2>
            <p className="text-zinc-400 max-w-md">
              Help us make the internet safer, one line of code at a time. We're always looking for contributors.
            </p>
          </div>
          <button className="flex items-center gap-2 px-8 py-4 bg-white text-zinc-900 rounded-2xl font-bold hover:bg-zinc-200 transition-all shadow-xl shadow-white/10">
            <ShieldCheck className="w-5 h-5 text-red-600" />
            Learn More
            <ExternalLink className="w-4 h-4 ml-2" />
          </button>
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </motion.div>
    </div>
  );
}
