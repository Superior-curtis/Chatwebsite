import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Trophy, Award, FileText, Shield, Search, Download, Plus, Edit, Trash, RefreshCw } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { collection, getDocs } from "firebase/firestore";
import { db, functions } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Participant {
  id: string;
  devpostUsername: string;
  email?: string;
  projectName?: string;
  projectUrl?: string;
  award?: string;
  token: string;
  tokenUsed: boolean;
  createdAt: any;
}

const AdminPage = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [search, setSearch] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    winners: 0,
    finalists: 0,
    tokensUsed: 0
  });

  // Create/Edit Dialog
  const [showDialog, setShowDialog] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [formData, setFormData] = useState({
    devpostUsername: "",
    email: "",
    projectName: "",
    projectUrl: "",
    award: ""
  });

  useEffect(() => {
    if (authenticated) {
      loadParticipants();
    }
  }, [authenticated]);

  const loadParticipants = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "participants"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      } as Participant));

      setParticipants(data);
      
      setStats({
        total: data.length,
        winners: data.filter(p => p.award === "Winner").length,
        finalists: data.filter(p => p.award === "Finalist").length,
        tokensUsed: data.filter(p => p.tokenUsed).length
      });
    } catch (error: any) {
      console.error("Error loading participants:", error);
      toast({
        title: "Error",
        description: "Failed to load participants",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateParticipant = async () => {
    try {
      const createParticipant = httpsCallable(functions, "createParticipant");
      await createParticipant({
        devpostUsername: formData.devpostUsername,
        email: formData.email || undefined,
        projectName: formData.projectName || undefined,
        projectUrl: formData.projectUrl || undefined,
        award: formData.award || "Participant"
      });

      toast({
        title: "Success",
        description: "Participant created successfully"
      });

      setShowDialog(false);
      resetForm();
      loadParticipants();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create participant",
        variant: "destructive"
      });
    }
  };

  const handleUpdateParticipant = async () => {
    if (!editingParticipant) return;

    try {
      const updateParticipant = httpsCallable(functions, "updateParticipant");
      await updateParticipant({
        participantId: editingParticipant.id,
        ...formData
      });

      toast({
        title: "Success",
        description: "Participant updated successfully"
      });

      setShowDialog(false);
      setEditingParticipant(null);
      resetForm();
      loadParticipants();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update participant",
        variant: "destructive"
      });
    }
  };

  const handleAssignAward = async (participantId: string, award: string) => {
    try {
      const assignAward = httpsCallable(functions, "assignAward");
      await assignAward({ participantId, award });

      toast({
        title: "Success",
        description: `Award "${award}" assigned successfully`
      });

      loadParticipants();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign award",
        variant: "destructive"
      });
    }
  };

  const handleRegenerateToken = async (participantId: string) => {
    try {
      const regenerateToken = httpsCallable(functions, "regenerateToken");
      const result = await regenerateToken({ participantId });
      const data = result.data as { success: boolean; token: string };

      toast({
        title: "Success",
        description: `New token: ${data.token}`
      });

      loadParticipants();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to regenerate token",
        variant: "destructive"
      });
    }
  };

  const handleDeleteParticipant = async (participantId: string) => {
    if (!confirm("Are you sure you want to delete this participant?")) return;

    try {
      const deleteParticipant = httpsCallable(functions, "deleteParticipant");
      await deleteParticipant({ participantId });

      toast({
        title: "Success",
        description: "Participant deleted successfully"
      });

      loadParticipants();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete participant",
        variant: "destructive"
      });
    }
  };

  const handleExport = async (format: "csv" | "json") => {
    try {
      const getParticipants = httpsCallable(functions, "getParticipants");
      const result = await getParticipants({ format });
      const data = result.data as { success: boolean; data: string };

      const blob = new Blob([data.data], {
        type: format === "csv" ? "text/csv" : "application/json"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `participants_${new Date().toISOString().split("T")[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: `Exported ${participants.length} participants as ${format.toUpperCase()}`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to export data",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      devpostUsername: "",
      email: "",
      projectName: "",
      projectUrl: "",
      award: ""
    });
  };

  const openEditDialog = (participant: Participant) => {
    setEditingParticipant(participant);
    setFormData({
      devpostUsername: participant.devpostUsername,
      email: participant.email || "",
      projectName: participant.projectName || "",
      projectUrl: participant.projectUrl || "",
      award: participant.award || "Participant"
    });
    setShowDialog(true);
  };

  const openCreateDialog = () => {
    setEditingParticipant(null);
    resetForm();
    setShowDialog(true);
  };

  if (!isAdmin && !authenticated) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-4 pt-20">
        <ParticleBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 glass-strong p-8 max-w-sm w-full text-center neon-glow-purple"
        >
          <Shield className="mx-auto text-secondary mb-4" size={40} />
          <h2 className="font-display text-xl font-bold text-foreground mb-4">Admin Access</h2>
          <input
            type="password"
            value={adminPass}
            onChange={(e) => setAdminPass(e.target.value)}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 transition-all duration-300 mb-4 text-center"
          />
          <button
            onClick={() => {
              if (adminPass === "admin2026") setAuthenticated(true);
            }}
            className="w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-display text-sm tracking-wider uppercase font-semibold neon-glow-purple hover:brightness-110 transition-all"
          >
            Enter
          </button>
          <p className="text-xs text-muted-foreground mt-3">Demo password: <span className="text-secondary font-mono">admin2026</span></p>
        </motion.div>
      </div>
    );
  }

  const filtered = participants.filter(
    (p) =>
      p.devpostUsername.toLowerCase().includes(search.toLowerCase()) ||
      (p.projectName && p.projectName.toLowerCase().includes(search.toLowerCase())) ||
      (p.email && p.email.toLowerCase().includes(search.toLowerCase())) ||
      p.token.toLowerCase().includes(search.toLowerCase())
  );

  const adminStats = [
    { icon: Users, label: "Participants", value: stats.total, color: "text-primary" },
    { icon: Trophy, label: "Winners", value: stats.winners, color: "text-gold" },
    { icon: Award, label: "Finalists", value: stats.finalists, color: "text-secondary" },
    { icon: FileText, label: "Tokens Used", value: stats.tokensUsed, color: "text-neon-pink" },
  ];

  return (
    <div className="min-h-screen relative pt-24 pb-12 px-4">
      <ParticleBackground />

      <div className="relative z-10 container mx-auto max-w-6xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-bold text-foreground mb-8 text-center"
        >
          Admin <span className="text-secondary neon-text-purple">Dashboard</span>
        </motion.h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {adminStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-5 text-center"
            >
              <s.icon className={`mx-auto mb-2 ${s.color}`} size={24} />
              <div className="font-display text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-6 justify-between items-center">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search participants..."
              className="w-full pl-11 pr-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => loadParticipants()} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => handleExport("csv")} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button onClick={() => handleExport("json")} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              JSON
            </Button>
            <Button onClick={openCreateDialog} className="bg-secondary" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Participant
            </Button>
          </div>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs font-display text-muted-foreground uppercase tracking-wider">Username</th>
                    <th className="text-left px-4 py-3 text-xs font-display text-muted-foreground uppercase tracking-wider hidden md:table-cell">Project</th>
                    <th className="text-left px-4 py-3 text-xs font-display text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-display text-muted-foreground uppercase tracking-wider">Award</th>
                    <th className="text-left px-4 py-3 text-xs font-display text-muted-foreground uppercase tracking-wider">Token</th>
                    <th className="text-left px-4 py-3 text-xs font-display text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-display text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{p.devpostUsername}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{p.projectName || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell text-xs">{p.email || "—"}</td>
                      <td className="px-4 py-3">
                        <Select
                          value={p.award || "Participant"}
                          onValueChange={(value) => handleAssignAward(p.id, value)}
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Participant">Participant</SelectItem>
                            <SelectItem value="Finalist">Finalist</SelectItem>
                            <SelectItem value="Winner">Winner</SelectItem>
                            <SelectItem value="Grand Prize">Grand Prize</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-primary">{p.token}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${p.tokenUsed ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {p.tokenUsed ? "Used" : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button onClick={() => openEditDialog(p)} variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button onClick={() => handleRegenerateToken(p.id)} variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                          <Button onClick={() => handleDeleteParticipant(p.id)} variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                            <Trash className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingParticipant ? "Edit Participant" : "Add Participant"}</DialogTitle>
            <DialogDescription>
              {editingParticipant ? "Update participant information" : "Create a new participant with a unique token"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="devpostUsername">Devpost Username *</Label>
              <Input
                id="devpostUsername"
                value={formData.devpostUsername}
                onChange={(e) => setFormData({ ...formData, devpostUsername: e.target.value })}
                placeholder="john_doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                placeholder="My Awesome Project"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectUrl">Project URL</Label>
              <Input
                id="projectUrl"
                value={formData.projectUrl}
                onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                placeholder="https://devpost.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="award">Award</Label>
              <Select value={formData.award} onValueChange={(value) => setFormData({ ...formData, award: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select award" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Participant">Participant</SelectItem>
                  <SelectItem value="Finalist">Finalist</SelectItem>
                  <SelectItem value="Winner">Winner</SelectItem>
                  <SelectItem value="Grand Prize">Grand Prize</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button
              onClick={editingParticipant ? handleUpdateParticipant : handleCreateParticipant}
              className="flex-1"
              disabled={!formData.devpostUsername}
            >
              {editingParticipant ? "Update" : "Create"}
            </Button>
            <Button onClick={() => setShowDialog(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
