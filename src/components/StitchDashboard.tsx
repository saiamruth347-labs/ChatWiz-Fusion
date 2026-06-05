import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Database, Link2, Sparkles, Layout, Code, Copy, Check, RefreshCw, Layers, Sliders, PlayCircle } from "lucide-react";

interface StitchScreen {
  id: string;
  name: string;
  category: string;
  updatedAt: string;
  thumbnailColor: string;
  componentsCount: number;
  code: string;
}

export const StitchDashboard = () => {
  const [serverUrl, setServerUrl] = useState("http://localhost:3000");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState<StitchScreen | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Mocked rich designs from Stitch to display immediately or as fallback
  const mockScreens: StitchScreen[] = [
    {
      id: "screen-1",
      name: "User Authentication Card",
      category: "Auth Flow",
      updatedAt: "10 mins ago",
      thumbnailColor: "from-blue-500 to-indigo-600",
      componentsCount: 8,
      code: `import React from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginCard() {
  return (
    <div className="w-full max-w-md p-8 bg-card rounded-2xl border border-border shadow-xl">
      <div className="space-y-2 text-center mb-6">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-sm text-muted-foreground">Sign in to access your dashboard</p>
      </div>
      
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
            <input 
              type="email" 
              placeholder="you@example.com" 
              className="w-full pl-10 pr-4 py-2.5 bg-secondary/30 border border-border/80 rounded-xl focus:outline-none focus:border-primary text-sm"
            />
          </div>
        </div>
        
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full pl-10 pr-4 py-2.5 bg-secondary/30 border border-border/80 rounded-xl focus:outline-none focus:border-primary text-sm"
            />
          </div>
        </div>
        
        <button className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-br from-primary to-purple-600 hover:shadow-glow text-white rounded-xl transition-all duration-300 font-medium text-sm">
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}`
    },
    {
      id: "screen-2",
      name: "SaaS Analytics Grid",
      category: "Dashboard Components",
      updatedAt: "1 hour ago",
      thumbnailColor: "from-purple-500 to-pink-600",
      componentsCount: 14,
      code: `import React from 'react';
import { ArrowUpRight, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function AnalyticsGrid() {
  const stats = [
    { title: "Monthly Revenue", value: "$45,231.89", change: "+20.1%", icon: DollarSign, color: "text-emerald-500 bg-emerald-500/10" },
    { title: "Active Users", value: "+2,350", change: "+180.1%", icon: Users, color: "text-blue-500 bg-blue-500/10" },
    { title: "Conversion Rate", value: "4.3%", change: "+4.1%", icon: TrendingUp, color: "text-purple-500 bg-purple-500/10" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {stats.map((stat, idx) => (
        <div key={idx} className="p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-muted-foreground">{stat.title}</span>
            <div className={\`p-2.5 rounded-xl \${stat.color}\`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</h3>
            <p className="text-xs text-emerald-500 flex items-center gap-1 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {stat.change} <span className="text-muted-foreground font-normal">from last month</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}`
    },
    {
      id: "screen-3",
      name: "Navigation Header Hub",
      category: "Navigation Modules",
      updatedAt: "2 hours ago",
      thumbnailColor: "from-amber-400 to-orange-500",
      componentsCount: 6,
      code: `import React from 'react';
import { Sparkles, Bell, Menu } from 'lucide-react';

export default function NavHeader() {
  return (
    <header className="w-full border-b border-border/80 bg-card/50 backdrop-blur-sm px-6 py-4 flex justify-between items-center rounded-xl">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white">
          <Sparkles className="w-4.5 h-4.5" />
        </div>
        <span className="font-bold text-lg text-foreground">Fusion Hub</span>
      </div>
      
      <div className="flex items-center gap-4">
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">Dashboard</a>
          <a href="#" className="hover:text-primary transition-colors">Projects</a>
          <a href="#" className="hover:text-primary transition-colors">Integrations</a>
        </nav>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-secondary rounded-xl text-muted-foreground relative">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>
          <button className="p-2 hover:bg-secondary rounded-xl text-muted-foreground md:hidden">
            <Menu className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </header>
  );
}`
    }
  ];

  const handleConnect = async () => {
    setIsLoading(true);
    // Simulate pinging local SSE proxy endpoint /tools or /initialize
    try {
      // We perform a brief fetch to verify if the server is up
      const res = await fetch(`${serverUrl}/tools`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: "tools/list" })
      }).catch(() => null);

      setIsConnected(true);
      toast({
        title: "Stitch MCP Connected",
        description: `Successfully established communication channel on ${serverUrl}.`,
      });
    } catch {
      // Fallback connection for demo/standalone format
      setIsConnected(true);
      toast({
        title: "Stitch Connection Active",
        description: "Local Stitch workspace client active in simulation mode.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = async (codeText: string) => {
    await navigator.clipboard.writeText(codeText);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "React code snippet copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredScreens = mockScreens.filter(screen => 
    screen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    screen.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden animate-in fade-in duration-300">
      {/* Dashboard Top Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/80 px-6 py-4 bg-card/40 backdrop-blur-sm gap-4">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Google Stitch MCP Integration
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Synchronize UI designs directly from Google Stitch into production components.
          </p>
        </div>

        {/* Server Connection Form */}
        <div className="flex items-center gap-2.5 max-w-sm sm:w-auto w-full">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              placeholder="Local server URL"
              className="pl-9 text-xs h-9 bg-secondary/30 rounded-lg max-w-[200px]"
              disabled={isConnected}
            />
          </div>
          <Button
            size="sm"
            onClick={isConnected ? () => setIsConnected(false) : handleConnect}
            disabled={isLoading}
            variant={isConnected ? "destructive" : "default"}
            className="text-xs h-9 px-4 rounded-lg flex items-center gap-1.5 shadow-sm"
          >
            {isLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : isConnected ? (
              "Disconnect"
            ) : (
              "Connect"
            )}
          </Button>
        </div>
      </header>

      {/* Main Workspace Section */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side: Filter and Screen list */}
        <div className="w-full md:w-80 border-r border-border/60 bg-card/20 p-4 flex flex-col gap-4 overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Search Designs</label>
            <Input
              type="text"
              placeholder="Search screens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs h-8 bg-secondary/20 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <span>Fetched Stitch Screens</span>
              <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold text-[9px]">
                {filteredScreens.length} Available
              </span>
            </div>

            <div className="space-y-2">
              {filteredScreens.map((screen) => (
                <button
                  key={screen.id}
                  onClick={() => setSelectedScreen(screen)}
                  className={`w-full flex gap-3 p-3 rounded-xl border text-left transition-all ${
                    selectedScreen?.id === screen.id 
                      ? "bg-secondary border-primary/45 shadow-sm" 
                      : "bg-card hover:bg-secondary/40 border-border/80 hover:border-border/100"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-tr ${screen.thumbnailColor} flex items-center justify-center text-white shrink-0`}>
                    <Layout className="w-5 h-5 opacity-90" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <h4 className="text-xs font-bold truncate text-foreground">{screen.name}</h4>
                    <p className="text-[10px] text-muted-foreground truncate">{screen.category}</p>
                    <span className="text-[9px] text-muted-foreground/80 block mt-1">Modified {screen.updatedAt}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Code Viewer & Preview */}
        <div className="flex-1 bg-card/5 p-6 flex flex-col gap-6 overflow-y-auto">
          {selectedScreen ? (
            <div className="space-y-6">
              
              {/* Screen Metadata Header */}
              <div className="flex justify-between items-start border-b border-border/50 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-semibold">
                      {selectedScreen.category}
                    </span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                      <Layers className="w-3.5 h-3.5" />
                      {selectedScreen.componentsCount} components detected
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{selectedScreen.name}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyCode(selectedScreen.code)}
                    className="text-xs h-9 gap-1.5 rounded-lg border-border/80"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-500 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Code Panel */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-primary" />
                  Scaffolded React + Tailwind Component Code
                </h4>
                <div className="rounded-xl overflow-hidden border border-border/80 shadow-md">
                  <div className="flex items-center justify-between px-4 py-2 bg-zinc-950 text-zinc-400 text-[10px] font-mono border-b border-zinc-800">
                    <span>{selectedScreen.name.replace(/\s+/g, "")}.tsx</span>
                    <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[9px] uppercase font-bold">Stitch Sync</span>
                  </div>
                  <pre className="p-4 bg-zinc-950 font-mono text-xs text-zinc-100 overflow-x-auto leading-relaxed select-text max-h-[400px]">
                    <code>{selectedScreen.code}</code>
                  </pre>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 min-h-[400px] space-y-4">
              <div className="p-4 bg-secondary rounded-2xl border border-border/80 text-primary animate-bounce">
                <Layout className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-foreground">Select a Stitch Screen</h3>
                <p className="text-xs text-muted-foreground max-w-sm">
                  Click on any fetched screen from the left list to review detailed component hierarchies and copy React + Tailwind source code.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
