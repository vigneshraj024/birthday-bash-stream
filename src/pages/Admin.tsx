
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, X, Eye, Loader2, Calendar, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import type { BirthdayTheme } from "@/components/BirthdayCard";

type SubmissionStatus = "pending" | "approved" | "rejected";

interface Submission {
  id: string;
  kid_name: string;
  parent_email: string;
  date_of_birth: string;
  photo_base64: string;
  status: SubmissionStatus;
  created_at: string;
  cartoon_id?: string;
  generated_video_url?: string;
}

const themes: { value: BirthdayTheme; label: string; emoji: string }[] = [
  { value: "rockstar", label: "Rockstar", emoji: "🎸" },
  { value: "princess", label: "Princess", emoji: "👑" },
  { value: "space", label: "Space Explorer", emoji: "🚀" },
  { value: "superhero", label: "Superhero", emoji: "💪" },
  { value: "safari", label: "Safari", emoji: "🦁" },
  { value: "unicorn", label: "Unicorn", emoji: "🦄" },
];

const Admin = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [selectedThemes, setSelectedThemes] = useState<Record<string, BirthdayTheme>>({});
  const [editedNames, setEditedNames] = useState<Record<string, string>>({});
  const [editedDates, setEditedDates] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"all" | SubmissionStatus>("pending");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  // Simple password protection (in production, use proper auth)
  const ADMIN_PASSWORD = "birthday2024";

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
    } else {
      toast.error("Incorrect password");
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchSubmissions = async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching submissions:", error);
        toast.error("Failed to load submissions");
      } else {
        setSubmissions(data as Submission[] || []);
      }
      setIsLoading(false);
    };

    fetchSubmissions();
  }, [isAuthenticated]);

  const handleApprove = async (submission: Submission) => {
    const theme = selectedThemes[submission.id] || "rockstar";
    const kidName = editedNames[submission.id] || submission.kid_name;
    const dateOfBirth = editedDates[submission.id] || submission.date_of_birth;

    setProcessingIds(prev => new Set(prev).add(submission.id));

    try {
      // Insert into approved_kids
      const { error: insertError } = await supabase
        .from("approved_kids")
        .insert({
          submission_id: submission.id,
          kid_name: kidName,
          date_of_birth: dateOfBirth,
          photo_base64: submission.photo_base64,
          theme_id: theme,
          cartoon_id: submission.cartoon_id,
          generated_video_url: submission.generated_video_url
        });

      if (insertError) throw insertError;

      // Update submission status
      const { error: updateError } = await supabase
        .from("submissions")
        .update({ status: "approved" as SubmissionStatus })
        .eq("id", submission.id);

      if (updateError) throw updateError;

      toast.success(`${kidName}'s birthday approved! 🎉`);

      // Update local state
      setSubmissions(prev =>
        prev.map(s => s.id === submission.id ? { ...s, status: "approved" as SubmissionStatus } : s)
      );
    } catch (error) {
      console.error("Approval error:", error);
      toast.error("Failed to approve submission");
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(submission.id);
        return next;
      });
    }
  };

  const handleReject = async (submission: Submission) => {
    setProcessingIds(prev => new Set(prev).add(submission.id));

    try {
      const { error } = await supabase
        .from("submissions")
        .update({ status: "rejected" as SubmissionStatus })
        .eq("id", submission.id);

      if (error) throw error;

      toast.success("Submission rejected");

      setSubmissions(prev =>
        prev.map(s => s.id === submission.id ? { ...s, status: "rejected" as SubmissionStatus } : s)
      );
    } catch (error) {
      console.error("Rejection error:", error);
      toast.error("Failed to reject submission");
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(submission.id);
        return next;
      });
    }
  };

  const filteredSubmissions = submissions.filter(s =>
    filter === "all" ? true : s.status === filter
  );

  const statusCounts = {
    all: submissions.length,
    pending: submissions.filter(s => s.status === "pending").length,
    approved: submissions.filter(s => s.status === "approved").length,
    rejected: submissions.filter(s => s.status === "rejected").length,
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-3xl p-8 shadow-card max-w-sm w-full">
          <h1 className="text-2xl font-display font-bold text-center mb-6">Admin Access</h1>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter admin password"
              />
            </div>
            <Button variant="party" className="w-full" onClick={handleLogin}>
              Login
            </Button>
            <Button variant="ghost" className="w-full" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-6 px-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-display font-bold">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">
                Review and approve birthday submissions
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              localStorage.removeItem("admin_auth");
              setIsAuthenticated(false);
            }}
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="border-b border-border sticky top-[89px] bg-background/95 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
          {(["all", "pending", "approved", "rejected"] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? "tabActive" : "tab"}
              size="sm"
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status} ({statusCounts[status]})
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading submissions...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-5xl mb-4 block">📭</span>
              <p className="text-muted-foreground">No {filter === "all" ? "" : filter} submissions yet</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className={`bg-card rounded-2xl overflow-hidden shadow-card border-2 ${submission.status === "pending"
                    ? "border-accent"
                    : submission.status === "approved"
                      ? "border-party-green"
                      : "border-destructive/30"
                    }`}
                >
                  {/* Photo */}
                  <div className="aspect-square relative">
                    <img
                      src={submission.photo_base64}
                      alt={submission.kid_name}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase ${submission.status === "pending"
                      ? "bg-accent text-accent-foreground"
                      : submission.status === "approved"
                        ? "bg-party-green text-primary-foreground"
                        : "bg-destructive text-destructive-foreground"
                      }`}>
                      {submission.status}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-4">
                    {/* Editable Name */}
                    <div className="space-y-1">
                      <Label className="text-xs flex items-center gap-1 text-muted-foreground">
                        <User className="w-3 h-3" /> Name
                      </Label>
                      <Input
                        value={editedNames[submission.id] ?? submission.kid_name}
                        onChange={(e) => setEditedNames(prev => ({ ...prev, [submission.id]: e.target.value }))}
                        disabled={submission.status !== "pending"}
                        className="h-9"
                      />
                    </div>

                    {/* Editable DOB */}
                    <div className="space-y-1">
                      <Label className="text-xs flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 h-3" /> Birthday
                      </Label>
                      <Input
                        type="date"
                        value={editedDates[submission.id] ?? submission.date_of_birth}
                        onChange={(e) => setEditedDates(prev => ({ ...prev, [submission.id]: e.target.value }))}
                        disabled={submission.status !== "pending"}
                        className="h-9"
                      />
                    </div>

                    {/* Email (read-only) */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{submission.parent_email}</span>
                    </div>

                    {/* Theme Selection */}
                    {submission.status === "pending" && (
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Theme</Label>
                        <Select
                          value={selectedThemes[submission.id] || "rockstar"}
                          onValueChange={(value) => setSelectedThemes(prev => ({
                            ...prev,
                            [submission.id]: value as BirthdayTheme
                          }))}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {themes.map((theme) => (
                              <SelectItem key={theme.value} value={theme.value}>
                                <span className="flex items-center gap-2">
                                  <span>{theme.emoji}</span>
                                  <span>{theme.label}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Actions */}
                    {submission.status === "pending" && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="default"
                          className="flex-1 bg-party-green hover:bg-party-green/90"
                          onClick={() => handleApprove(submission)}
                          disabled={processingIds.has(submission.id)}
                        >
                          {processingIds.has(submission.id) ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handleReject(submission)}
                          disabled={processingIds.has(submission.id)}
                        >
                          {processingIds.has(submission.id) ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <X className="w-4 h-4" />
                              Reject
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    {/* Timestamp */}
                    <p className="text-xs text-muted-foreground text-center">
                      Submitted {format(new Date(submission.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;