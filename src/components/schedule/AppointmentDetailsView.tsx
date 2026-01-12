import { useMemo, useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  FileText,
  MapPin,
  Navigation,
  Pencil,
  Play,
  Plus,
  Repeat,
  Send,
  Square,
  Star,
  Timer,
  Trash2,
  Users,
  X,
} from "lucide-react";

type Appointment = {
  id: number;
  time: string;
  customer: string;
  address: string;
  service: string;
  staff: string;
  status: string;
  duration: string;
};

type JobNote = {
  id: string;
  text: string;
  author: string;
};

const initialNotes: JobNote[] = [
  {
    id: "n1",
    text: "Usar Bona no piso q fica laundry, bags pequenas num quartinho ao lado da laundry, usar vacuum de carpete da cliente.",
    author: "Username that wrote the note",
  },
  {
    id: "n2",
    text: "Usar Bona no piso q fica laundry, bags pequenas num quartinho ao lado da laundry, usar vacuum de carpete da cliente.",
    author: "Username that wrote the note",
  },
  {
    id: "n3",
    text: "Usar Bona no piso q fica laundry, bags pequenas num quartinho ao lado da laundry, usar vacuum de carpete da cliente.",
    author: "Username that wrote the note",
  },
];

function IconBubble({ children }: { children: ReactNode }) {
  return (
    <div className="h-7 w-7 shrink-0 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
      {children}
    </div>
  );
}

function InfoCell({
  icon,
  label,
  value,
  value2,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  value2?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 min-w-0">
      <IconBubble>{icon}</IconBubble>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground break-words">{value}</p>
        {value2 ? (
          <p className="text-sm font-semibold text-foreground break-words">{value2}</p>
        ) : null}
      </div>
    </div>
  );
}

function Dot({ className }: { className: string }) {
  return <div className={`h-2.5 w-2.5 rounded-full ${className}`} />;
}

export function AppointmentDetailsView({
  appointment,
  onClose,
  onOpenInvoice,
  onEdit,
}: {
  appointment: Appointment;
  onClose: () => void;
  onOpenInvoice: () => void;
  onEdit?: () => void;
}) {
  const [notesPage, setNotesPage] = useState(1);
  const [additionalNotesPage, setAdditionalNotesPage] = useState(1);
  const [notes, setNotes] = useState<JobNote[]>(initialNotes);
  const [additionalNotes, setAdditionalNotes] = useState<JobNote[]>([]);
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [addAdditionalNoteOpen, setAddAdditionalNoteOpen] = useState(false);
  const [addFeedbackOpen, setAddFeedbackOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const [jobNotesExpanded, setJobNotesExpanded] = useState(true);
  const [additionalNotesExpanded, setAdditionalNotesExpanded] = useState(true);
  const [feedbackExpanded, setFeedbackExpanded] = useState(true);
  const [feedbackList, setFeedbackList] = useState<{ id: string; text: string; author: string; date: string }[]>([
    { id: "f1", text: "Excellent cleaning service! Very thorough and professional.", author: "Sarah Johnson", date: "Dec 20, 2024" },
  ]);

  // Time editing states
  const [editingTime, setEditingTime] = useState<string | null>(null);
  const [timeValues, setTimeValues] = useState({
    onOurWay: "7:06 AM",
    jobStarted: "7:00 AM",
    jobFinished: "7:00 AM",
  });
  const [tempTimeValue, setTempTimeValue] = useState("");

  const notesTotalPages = Math.ceil(notes.length / 3) || 1;
  const displayedNotes = notes.slice((notesPage - 1) * 3, notesPage * 3);

  const additionalNotesTotalPages = Math.ceil(additionalNotes.length / 3) || 1;
  const displayedAdditionalNotes = additionalNotes.slice((additionalNotesPage - 1) * 3, additionalNotesPage * 3);

  // Calculate cleaning time total based on jobStarted and jobFinished
  const cleaningTimeTotal = useMemo(() => {
    const parseTime = (timeStr: string): Date | null => {
      const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (!match) return null;
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const period = match[3].toUpperCase();
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    };

    const start = parseTime(timeValues.jobStarted);
    const end = parseTime(timeValues.jobFinished);

    if (!start || !end) return "—";

    let diffMs = end.getTime() - start.getTime();
    if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000; // handle overnight

    const totalMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) return `${minutes}min`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}min`;
  }, [timeValues.jobStarted, timeValues.jobFinished]);

  const headerAddress = useMemo(() => {
    return appointment.address;
  }, [appointment.address]);

  const handleAddNote = () => {
    if (!newNoteText.trim()) {
      toast.error("Please enter a note");
      return;
    }
    const newNote: JobNote = {
      id: `n${Date.now()}`,
      text: newNoteText.trim(),
      author: "Current User",
    };
    setNotes((prev) => [...prev, newNote]);
    setNewNoteText("");
    setAddNoteOpen(false);
    toast.success("Note added successfully");
  };

  const handleAddAdditionalNote = () => {
    if (!newNoteText.trim()) {
      toast.error("Please enter a note");
      return;
    }
    const newNote: JobNote = {
      id: `an${Date.now()}`,
      text: newNoteText.trim(),
      author: "Current User",
    };
    setAdditionalNotes((prev) => [...prev, newNote]);
    setNewNoteText("");
    setAddAdditionalNoteOpen(false);
    toast.success("Additional note added");
  };

  const handleDeleteAdditionalNote = (id: string) => {
    setAdditionalNotes((prev) => prev.filter((n) => n.id !== id));
    toast.success("Additional note deleted");
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    toast.success("Note deleted");
  };

  const handleAddFeedback = () => {
    if (!newNoteText.trim()) {
      toast.error("Please enter feedback");
      return;
    }
    const newFeedback = {
      id: `f${Date.now()}`,
      text: newNoteText.trim(),
      author: "Current User",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setFeedbackList((prev) => [...prev, newFeedback]);
    setNewNoteText("");
    setAddFeedbackOpen(false);
    toast.success("Feedback added successfully");
  };

  const handleDeleteFeedback = (id: string) => {
    setFeedbackList((prev) => prev.filter((f) => f.id !== id));
    toast.success("Feedback deleted");
  };

  const handleRequestReview = () => {
    // Open Google Review link (placeholder - should be configured with actual business Google Place ID)
    const googleReviewUrl = "https://search.google.com/local/writereview?placeid=YOUR_GOOGLE_PLACE_ID";
    
    // Copy message to clipboard with review link
    const reviewMessage = `Hi ${appointment.customer}! Thank you for choosing our cleaning service. We'd love to hear your feedback! Please leave us a review here: ${googleReviewUrl}`;
    
    navigator.clipboard.writeText(reviewMessage).then(() => {
      toast.success("Review request message copied to clipboard! You can now send it via SMS or email.");
    }).catch(() => {
      toast.info("Review link ready to share");
    });
    
    // Also open in new tab
    window.open(googleReviewUrl, '_blank');
  };

  const handleSendInvoice = () => {
    onOpenInvoice();
  };

  const handleEditTime = (key: string, currentValue: string) => {
    setEditingTime(key);
    setTempTimeValue(currentValue);
  };

  const parseTimeToMinutes = (timeStr: string): number | null => {
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return null;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3].toUpperCase();
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const handleSaveTime = () => {
    if (!editingTime || !tempTimeValue.trim()) {
      setEditingTime(null);
      setTempTimeValue("");
      return;
    }

    const newValue = tempTimeValue.trim();
    const parsedNew = parseTimeToMinutes(newValue);

    if (parsedNew === null) {
      toast.error("Invalid time format. Use format like 7:30 AM");
      return;
    }

    // Validate Job Finished is after Job Started
    if (editingTime === "jobFinished") {
      const startMinutes = parseTimeToMinutes(timeValues.jobStarted);
      if (startMinutes !== null && parsedNew <= startMinutes) {
        toast.error("Job Finished must be after Job Started");
        return;
      }
    }

    // Validate Job Started is before Job Finished
    if (editingTime === "jobStarted") {
      const endMinutes = parseTimeToMinutes(timeValues.jobFinished);
      if (endMinutes !== null && parsedNew >= endMinutes) {
        toast.error("Job Started must be before Job Finished");
        return;
      }
    }

    setTimeValues((prev) => ({
      ...prev,
      [editingTime]: newValue,
    }));
    toast.success("Time updated");
    setEditingTime(null);
    setTempTimeValue("");
  };

  const handleCancelEditTime = () => {
    setEditingTime(null);
    setTempTimeValue("");
  };

  return (
    <>
      <div className="bg-surface">
        <header className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">{appointment.customer}</h2>
          <Button
            variant="outline"
            size="sm"
            className="h-7 rounded-full px-4 text-xs shadow-none"
            onClick={onClose}
          >
            Close
          </Button>
        </header>

        <main className="px-5 py-4 space-y-4">
          {/* Top info (3 rows x 2 cols) */}
          <section aria-label="Appointment summary" className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <InfoCell icon={<MapPin className="h-4 w-4" />} label="Address Type" value={headerAddress} />
              <InfoCell
                icon={<DollarSign className="h-4 w-4" />}
                label="Payment Type"
                value={
                  <span className="text-sm font-semibold text-foreground">Zelle</span>
                }
              />

              <InfoCell
                icon={<FileText className="h-4 w-4" />}
                label="Cleaning Type"
                value={appointment.service}
              />
              <InfoCell
                icon={<Repeat className="h-4 w-4" />}
                label="Cleaning frequency"
                value="Every 2 Weeks"
              />

              <InfoCell
                icon={<CalendarIcon className="h-4 w-4" />}
                label="Cleaning Day and Time"
                value="Tuesday, December 23"
                value2={appointment.time}
              />

              <div className="flex items-start gap-3 min-w-0">
                <IconBubble>
                  <Users className="h-4 w-4" />
                </IconBubble>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Cleaners</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge className="border-transparent bg-secondary text-secondary-foreground text-[11px] font-semibold px-3 py-1 shadow-none">
                      Marie Stone
                    </Badge>
                    <Badge className="border-transparent bg-secondary text-secondary-foreground text-[11px] font-semibold px-3 py-1 shadow-none">
                      Maria Silva
                    </Badge>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 h-8 rounded-full px-3 text-xs gap-1.5 shadow-none"
                    onClick={handleRequestReview}
                  >
                    <Star className="h-4 w-4" />
                    Request Review
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* Job Notes */}
          <section aria-label="Job notes" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shadow-none"
                  onClick={() => setJobNotesExpanded((v) => !v)}
                  aria-label={jobNotesExpanded ? "Collapse job notes" : "Expand job notes"}
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${jobNotesExpanded ? "" : "-rotate-90"}`} />
                </Button>
                <span className="text-sm font-semibold text-foreground">Job Notes</span>
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 shadow-none"
                aria-label="Add job note"
                onClick={() => setAddNoteOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {jobNotesExpanded && (
              <div className="space-y-3">
                {notes.map((n) => (
                  <article key={n.id} className="flex items-start gap-3 group">
                    <span className="text-sm shrink-0">⚠️</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-foreground leading-relaxed">{n.text}</p>
                      <p className="text-[10px] text-muted-foreground italic">&quot;{n.author}&quot;</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteNote(n.id)}
                      aria-label="Delete note"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </article>
                ))}
              </div>
            )}
          </section>

          <Separator />

          {/* Additional Notes */}
          <section aria-label="Additional notes" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shadow-none"
                  onClick={() => setAdditionalNotesExpanded((v) => !v)}
                  aria-label={additionalNotesExpanded ? "Collapse additional notes" : "Expand additional notes"}
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${additionalNotesExpanded ? "" : "-rotate-90"}`} />
                </Button>
                <span className="text-sm font-semibold text-foreground">Additional Notes</span>
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 shadow-none"
                aria-label="Add additional note"
                onClick={() => setAddAdditionalNoteOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {additionalNotesExpanded && (
              <div className="space-y-3">
                {additionalNotes.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic pl-5">No additional notes yet.</p>
                ) : (
                  additionalNotes.map((n) => (
                    <article key={n.id} className="flex items-start gap-3 group">
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-muted-foreground/50 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-foreground leading-relaxed">{n.text}</p>
                        <p className="text-[10px] text-muted-foreground italic">&quot;{n.author}&quot;</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteAdditionalNote(n.id)}
                        aria-label="Delete note"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </article>
                  ))
                )}
              </div>
            )}
          </section>

          <Separator />

          {/* Feedback */}
          <section aria-label="Feedback" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shadow-none"
                  onClick={() => setFeedbackExpanded((v) => !v)}
                  aria-label={feedbackExpanded ? "Collapse feedback" : "Expand feedback"}
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${feedbackExpanded ? "" : "-rotate-90"}`} />
                </Button>
                <span className="text-sm font-semibold text-foreground">Feedback</span>
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 shadow-none"
                aria-label="Add feedback"
                onClick={() => setAddFeedbackOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {feedbackExpanded && (
              <div className="space-y-3">
                {feedbackList.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic pl-5">No feedback yet.</p>
                ) : (
                  feedbackList.map((f) => (
                    <article key={f.id} className="flex items-start gap-3 group">
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-muted-foreground/50 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-foreground leading-relaxed">{f.text}</p>
                        <p className="text-[10px] text-muted-foreground italic">&quot;{f.author}&quot; - {f.date}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteFeedback(f.id)}
                        aria-label="Delete feedback"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </article>
                  ))
                )}
              </div>
            )}
          </section>

          <Separator />

          {/* Timeline */}
          <section aria-label="Job timeline" className="space-y-3">
            {(
              [
                { key: "onOurWay", icon: <span className="text-sm">🚗</span>, label: "On Our Way", editable: true },
                { key: "jobStarted", icon: <span className="text-sm">🏠</span>, label: "Job Started", editable: true },
                { key: "jobFinished", icon: <span className="text-sm">✓</span>, label: "Job Finished", editable: true },
                { key: "total", icon: <span className="text-sm">🕐</span>, label: "Cleaning Time Total", editable: false },
              ] as const
            ).map((row) => {
              const timeValue = row.key === "total" ? cleaningTimeTotal : timeValues[row.key as keyof typeof timeValues];
              const isEditing = editingTime === row.key;

              return (
                <div key={row.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <IconBubble>{row.icon}</IconBubble>
                    <span className="text-sm text-muted-foreground italic truncate">{row.label}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <Input
                          value={tempTimeValue}
                          onChange={(e) => setTempTimeValue(e.target.value)}
                          className="h-7 w-24 text-sm"
                          placeholder="e.g. 7:30 AM"
                          autoFocus
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 shadow-none text-success"
                          onClick={handleSaveTime}
                        >
                          ✓
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 shadow-none text-destructive"
                          onClick={handleCancelEditTime}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="text-sm text-foreground">{timeValue}</span>
                        {row.editable ? (
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 shadow-none"
                            aria-label={`Edit ${row.label}`}
                            onClick={() => handleEditTime(row.key, timeValue)}
                          >
                            <Pencil className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </section>

          <Separator />

          {/* Pricing + statuses */}
          <section aria-label="Billing summary" className="relative">
            <div className="pointer-events-none absolute -left-8 -top-10 h-24 w-24 rounded-full bg-success/12" />
            <div className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-warning/14" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cleaning Rate</span>
                  <span className="text-sm font-semibold text-foreground">$170.00</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Total</span>
                  <span className="text-sm font-semibold text-foreground">$170.00</span>
                </div>

                <div className="pt-1">
                  <span className="text-sm text-muted-foreground">Invoice status</span>
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-full px-3 text-xs gap-1.5 shadow-none"
                      onClick={handleSendInvoice}
                    >
                      <Send className="h-4 w-4" />
                      Send Invoice
                    </Button>
                    <Badge className="border-transparent bg-secondary text-secondary-foreground text-[10px] px-2.5 py-1 font-semibold shadow-none">
                      Sent
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payment status</span>
                  <Badge className="border-transparent bg-secondary text-secondary-foreground text-[10px] px-3 py-1 font-semibold shadow-none">
                    Pending
                  </Badge>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="flex justify-between px-5 py-3 bg-surface-muted border-t border-border">
          <div>
            {onEdit && (
              <Button
                variant="hero"
                size="sm"
                className="h-8 rounded-full px-4 text-xs shadow-none gap-1.5"
                onClick={onEdit}
              >
                <Pencil className="h-4 w-4" />
                Editar
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-full px-4 text-xs shadow-none"
            onClick={onClose}
          >
            Close
          </Button>
        </footer>
      </div>

      {/* Add Job Note Modal */}
      <Dialog open={addNoteOpen} onOpenChange={setAddNoteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add Job Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter your note here..."
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddNoteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNote}>Add Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Additional Note Modal */}
      <Dialog open={addAdditionalNoteOpen} onOpenChange={setAddAdditionalNoteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add Additional Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter additional note here..."
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddAdditionalNoteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAdditionalNote}>Add Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Feedback Modal */}
      <Dialog open={addFeedbackOpen} onOpenChange={setAddFeedbackOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add Feedback</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter customer feedback here..."
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddFeedbackOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFeedback}>Add Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
