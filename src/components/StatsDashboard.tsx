import { useState, useEffect } from "react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from "recharts";
import { 
  Activity, 
  Zap, 
  Clock, 
  Layers, 
  Database, 
  Cpu, 
  TrendingUp, 
  Sparkles, 
  Terminal 
} from "lucide-react";

interface RequestLog {
  timestamp: string;
  endpoint: string;
  model: string;
  status: number;
  latency: number;
  tokens: number;
}

export const StatsDashboard = () => {
  const [logs, setLogs] = useState<RequestLog[]>([]);

  // Sample data for Token Speed Chart
  const tokenSpeedData = [
    { time: "10:00", speed: 32 },
    { time: "10:05", speed: 40 },
    { time: "10:10", speed: 38 },
    { time: "10:15", speed: 45 },
    { time: "10:20", speed: 52 },
    { time: "10:25", speed: 48 },
    { time: "10:30", speed: 55 },
  ];

  // Sample data for Daily API Volume
  const apiVolumeData = [
    { name: "Mon", requests: 120, tokens: 42000 },
    { name: "Tue", requests: 210, tokens: 73000 },
    { name: "Wed", requests: 180, tokens: 61000 },
    { name: "Thu", requests: 280, tokens: 98000 },
    { name: "Fri", requests: 340, tokens: 124000 },
    { name: "Sat", requests: 220, tokens: 81000 },
    { name: "Sun", requests: 190, tokens: 68000 },
  ];

  // Model distribution data
  const modelDistributionData = [
    { name: "Fusion-X 3.5", value: 65, color: "#6366f1" },
    { name: "Vision-Multimodal", value: 20, color: "#a855f7" },
    { name: "Ollama (Local)", value: 15, color: "#10b981" },
  ];

  // Generate scrolling live log events
  useEffect(() => {
    const initialLogs: RequestLog[] = [
      { timestamp: "00:12:15", endpoint: "POST /v1/chat", model: "fusion-3.5", status: 200, latency: 142, tokens: 245 },
      { timestamp: "00:12:30", endpoint: "POST /v1/chat", model: "fusion-vision", status: 200, latency: 280, tokens: 512 },
      { timestamp: "00:12:45", endpoint: "POST /v1/chat", model: "ollama (llama3)", status: 200, latency: 89, tokens: 120 },
      { timestamp: "00:13:00", endpoint: "POST /v1/chat", model: "fusion-3.5", status: 200, latency: 155, tokens: 380 },
    ];
    setLogs(initialLogs);

    const endpoints = ["POST /v1/chat", "POST /v1/chat", "POST /v1/image/generate"];
    const models = ["fusion-3.5", "fusion-vision", "ollama (llama3.2)"];

    const interval = setInterval(() => {
      const date = new Date();
      const timeStr = date.toTimeString().split(" ")[0];
      const model = models[Math.floor(Math.random() * models.length)];
      const isImage = model === "fusion-vision" && Math.random() > 0.6;
      
      const newLog: RequestLog = {
        timestamp: timeStr,
        endpoint: isImage ? "POST /v1/image/generate" : endpoints[Math.floor(Math.random() * endpoints.length)],
        model: model,
        status: 200,
        latency: isImage ? 1450 + Math.floor(Math.random() * 800) : 80 + Math.floor(Math.random() * 200),
        tokens: isImage ? 0 : 50 + Math.floor(Math.random() * 600)
      };

      setLogs(prev => [newLog, ...prev.slice(0, 7)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <header className="border-b border-border/80 px-6 py-4 bg-card/40 backdrop-blur-sm">
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Real-Time AI Analytics Hub
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Visualize latency logs, token generation benchmarks, and backend infrastructure status.
        </p>
      </header>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
        
        {/* Core Stat Grid (Glow Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 bg-card border border-border/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-primary group-hover:scale-110 transition-transform">
              <Zap className="w-12 h-12" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">Token Gen Speed</span>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-2xl font-bold tracking-tight text-foreground">48.5</h3>
              <span className="text-xs text-emerald-500 font-semibold font-mono flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                +4.2 t/s
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Average generation speed in last 1hr</p>
          </div>

          <div className="p-5 bg-card border border-border/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-purple-500 group-hover:scale-110 transition-transform">
              <Clock className="w-12 h-12" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">Mean Latency</span>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-2xl font-bold tracking-tight text-foreground">148 ms</h3>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded font-mono">OPTIMAL</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Total time-to-first-token delay</p>
          </div>

          <div className="p-5 bg-card border border-border/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-500 group-hover:scale-110 transition-transform">
              <Database className="w-12 h-12" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">Supabase Edge Hits</span>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-2xl font-bold tracking-tight text-foreground">94.2%</h3>
              <span className="text-xs text-muted-foreground">Cache hit</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Function optimization rate</p>
          </div>

          <div className="p-5 bg-card border border-border/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-pink-500 group-hover:scale-110 transition-transform">
              <Cpu className="w-12 h-12" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">GPU Cluster Load</span>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-2xl font-bold tracking-tight text-foreground">18.4%</h3>
              <span className="text-xs text-emerald-500 font-semibold">Healthy</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Active edge instance node compute usage</p>
          </div>

        </div>

        {/* Analytics Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart 1: Token Speed Area Chart */}
          <div className="p-5 bg-card border border-border rounded-2xl shadow-sm flex flex-col h-80 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                Real-Time Generation Speed (Tokens/sec)
              </h3>
            </div>
            <div className="flex-1 w-full text-xs font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tokenSpeedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#888888" fontSize={10} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="speed" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorSpeed)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Model Distribution Pie Chart */}
          <div className="p-5 bg-card border border-border rounded-2xl shadow-sm flex flex-col h-80">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 mb-4">
              <Layers className="w-4 h-4 text-purple-500" />
              Traffic Distribution by Model
            </h3>
            <div className="flex-1 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={modelDistributionData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {modelDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>

              {/* Pie Legends */}
              <div className="absolute bottom-0 inset-x-0 flex justify-center gap-3.5 flex-wrap">
                {modelDistributionData.map((model, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: model.color }}></span>
                    <span>{model.name} ({model.value}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Lower Row: Volume History Bar Chart & Live Stream logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart 3: Weekly Token usage Bar Chart */}
          <div className="p-5 bg-card border border-border rounded-2xl shadow-sm flex flex-col h-80">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Daily Volume and Token Load
            </h3>
            <div className="flex-1 w-full text-xs font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={apiVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="requests" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Live Request Logger Console (Extremely satisfying UI element) */}
          <div className="p-5 bg-card border border-border rounded-2xl shadow-sm flex flex-col h-80 lg:col-span-2">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-primary" />
                Live Request Stream Console
              </h3>
              <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/25 rounded-md text-[9px] font-bold text-emerald-500">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                STREAMING LIVE
              </span>
            </div>
            
            {/* Logs Window */}
            <div className="flex-1 bg-zinc-950 dark:bg-zinc-950 border border-zinc-800 rounded-xl p-3 font-mono text-[11px] overflow-y-auto space-y-2 select-text text-zinc-300">
              {logs.map((log, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:justify-between border-b border-zinc-900 pb-1.5 last:border-b-0 animate-in slide-in-from-top-1.5 duration-200">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-zinc-500">[{log.timestamp}]</span>
                    <span className="text-sky-400 font-semibold">{log.endpoint}</span>
                    <span className="text-zinc-400 text-[10px] bg-zinc-900 px-1.5 py-0.2 rounded border border-zinc-800">
                      {log.model}
                    </span>
                  </div>
                  <div className="flex gap-3 mt-1 sm:mt-0 font-semibold">
                    <span className="text-emerald-500">{log.status} OK</span>
                    <span className="text-purple-400">{log.latency}ms</span>
                    {log.tokens > 0 && <span className="text-amber-500">{log.tokens} tokens</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
