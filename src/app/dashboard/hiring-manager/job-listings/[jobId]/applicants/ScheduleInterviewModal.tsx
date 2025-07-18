
"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";
import { CalendarIcon, Bot, Loader2, Save, Users as UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from '@/components/ui/badge';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
}

const MOCK_AI_AGENTS_HM = [
  { id: "EVQJtCNSo0L6uHQnImQu", name: "Mira - Persona AI Interviewer" },
  { id: "agent2-hm", name: "Tech Screener Bot (HM)" },
  { id: "agent3-hm", name: "Behavioral Assessor AI (HM)" },
];

const MOCK_COMMON_INTERVIEWERS_HM = [
    "Charles Brown (Hiring Manager)", // Self
    "Brenda Smith (Recruiter)",
    "John Smith - Sr. Engineer",
    "Alice Brown - Team Lead",
];

const TIME_SLOTS_HM = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];
const DURATIONS_HM = ["15", "30", "45", "60"]; // In minutes

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onClose,
  candidateId,
  candidateName,
  candidateEmail,
  jobTitle
}) => {
  const { toast } = useToast();
  const [interviewType, setInterviewType] = useState<"face-to-face" | "ai">("face-to-face");

  // Face-to-face state
  const [interviewDate, setInterviewDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState("10:00");
  const [interviewers, setInterviewers] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [faceToFaceDuration, setFaceToFaceDuration] = useState("30");
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // AI Interview state
  const [selectedAgentId, setSelectedAgentId] = useState<string>(MOCK_AI_AGENTS_HM[0]?.id || "");
  const [aiDuration, setAiDuration] = useState("15");

  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (interviewType === "ai") {
      setInterviewDate(undefined);
      setTimeSlot("10:00");
      setInterviewers("");
      setMeetingLink("");
    } else {
      setInterviewDate(new Date());
    }
  }, [interviewType]);

  const handleSchedule = async () => {
    setIsSubmitting(true);
    console.log("Scheduling Interview (HM View) with data:", {
      candidateId,
      candidateName,
      candidateEmail,
      jobTitle,
      interviewType,
      interviewDate: interviewType === "face-to-face" ? (interviewDate ? format(interviewDate, "PPP") : "N/A") : "N/A (AI Interview)",
      timeSlot: interviewType === "face-to-face" ? timeSlot : "N/A",
      duration: interviewType === "face-to-face" ? faceToFaceDuration : aiDuration,
      interviewers: interviewType === "face-to-face" ? interviewers : "N/A",
      meetingLink: interviewType === "face-to-face" ? meetingLink : "N/A",
      selectedAIAgent: interviewType === "ai" ? MOCK_AI_AGENTS_HM.find(a => a.id === selectedAgentId)?.name : "N/A",
      timeZone: interviewType === "face-to-face" ? timeZone : "N/A",
      notes,
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Interview Scheduled (Placeholder)",
      description: `${interviewType === "ai" ? "AI" : "Face-to-face"} interview for ${candidateName} has been requested.`,
    });
    setIsSubmitting(false);
    onClose();
  };

  const addCommonInterviewer = (name: string) => {
    setInterviewers(prev => {
        if (!prev.trim()) return name;
        if (prev.toLowerCase().includes(name.toLowerCase())) return prev;
        return `${prev}, ${name}`;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Schedule Interview: {candidateName}</DialogTitle>
          <DialogDescription>
            For job: <span className="font-semibold text-primary">{jobTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 pr-2">
          <div>
            <Label className="text-sm font-medium">Interview Type *</Label>
            <RadioGroup
              defaultValue="face-to-face"
              onValueChange={(value: "face-to-face" | "ai") => setInterviewType(value)}
              className="mt-2 grid grid-cols-2 gap-4"
            >
              <Label htmlFor="type-ftf-hm" className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", interviewType === "face-to-face" && "border-primary ring-2 ring-primary")}>
                <RadioGroupItem value="face-to-face" id="type-ftf-hm" className="sr-only" />
                <UsersIcon className="mb-3 h-6 w-6" />
                Face-to-Face
              </Label>
              <Label htmlFor="type-ai-hm" className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", interviewType === "ai" && "border-primary ring-2 ring-primary")}>
                <RadioGroupItem value="ai" id="type-ai-hm" className="sr-only" />
                <Bot className="mb-3 h-6 w-6" />
                AI Interview
              </Label>
            </RadioGroup>
          </div>

          <Separator />

          {interviewType === "face-to-face" && (
            <div className="space-y-4 animate-in fade-in-0 duration-300">
              <h3 className="text-md font-semibold text-foreground">Face-to-Face Interview Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="interviewDate-hm">Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="interviewDate-hm"
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !interviewDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {interviewDate ? format(interviewDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={interviewDate} onSelect={setInterviewDate} initialFocus disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="timeSlot-hm">Time Slot *</Label>
                  <Select value={timeSlot} onValueChange={setTimeSlot}>
                    <SelectTrigger id="timeSlot-hm"><SelectValue placeholder="Select time" /></SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS_HM.map(slot => <SelectItem key={slot} value={slot}>{slot}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="faceToFaceDuration-hm">Duration (minutes) *</Label>
                  <Select value={faceToFaceDuration} onValueChange={setFaceToFaceDuration}>
                    <SelectTrigger id="faceToFaceDuration-hm"><SelectValue placeholder="Select duration" /></SelectTrigger>
                    <SelectContent>
                      {DURATIONS_HM.map(d => <SelectItem key={d} value={d}>{d} mins</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-1">
                  <Label htmlFor="timeZone-hm">Time Zone</Label>
                  <Input id="timeZone-hm" value={timeZone} onChange={(e) => setTimeZone(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="interviewers-hm">Interviewer(s) *</Label>
                <Input id="interviewers-hm" placeholder="e.g., John Doe, Jane Smith" value={interviewers} onChange={(e) => setInterviewers(e.target.value)} />
                <p className="text-xs text-muted-foreground">Manually type names, or click a common interviewer below to add them.</p>
                <div className="mt-2 flex flex-wrap gap-2">
                    {MOCK_COMMON_INTERVIEWERS_HM.map(name => (
                        <Badge
                            key={name}
                            variant="secondary"
                            onClick={() => addCommonInterviewer(name)}
                            className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                        >
                            {name}
                        </Badge>
                    ))}
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="meetingLink-hm">Meeting Link (Optional)</Label>
                <Input id="meetingLink-hm" placeholder="https://zoom.us/j/..." value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} />
              </div>
            </div>
          )}

          {interviewType === "ai" && (
            <div className="space-y-4 animate-in fade-in-0 duration-300">
              <h3 className="text-md font-semibold text-foreground">AI Interview Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="aiAgent-hm">AI Interview Agent *</Label>
                  <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                    <SelectTrigger id="aiAgent-hm"><SelectValue placeholder="Select AI Agent" /></SelectTrigger>
                    <SelectContent>
                      {MOCK_AI_AGENTS_HM.map(agent => <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="aiDuration-hm">Duration (minutes) *</Label>
                   <Select value={aiDuration} onValueChange={setAiDuration}>
                    <SelectTrigger id="aiDuration-hm"><SelectValue placeholder="Select duration" /></SelectTrigger>
                    <SelectContent>
                      {DURATIONS_HM.map(d => <SelectItem key={d} value={d}>{d} mins</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">The AI interview link will be sent to the candidate. They can take it anytime within the next 3 days.</p>
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="notes-hm">Additional Notes (Optional)</Label>
            <Textarea id="notes-hm" placeholder="Any specific instructions or notes for this interview..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button
            onClick={handleSchedule}
            disabled={isSubmitting || (interviewType === "face-to-face" && (!interviewDate || !interviewers.trim())) || (interviewType === "ai" && !selectedAgentId)}
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
            {isSubmitting ? "Scheduling..." : "Confirm & Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
