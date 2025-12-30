import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, User, ChevronLeft, ChevronRight } from "lucide-react";
import { JobDetailsModal } from "./JobDetailsModal";

const upcomingJobs = [
  {
    id: 1,
    customer: "Sarah Johnson",
    address: "123 Oak Street, Springfield",
    time: "9:00 AM",
    date: "Today",
    cleaner: "Maria Rodriguez",
    type: "Deep Clean",
    priority: "high",
  },
  {
    id: 2,
    customer: "Tech Startup Inc.",
    address: "456 Business Park Dr",
    time: "2:00 PM",
    date: "Today",
    cleaner: "John Smith",
    type: "Office Clean",
    priority: "normal",
  },
  {
    id: 3,
    customer: "Miller Family",
    address: "789 Maple Ave, Downtown",
    time: "10:00 AM",
    date: "Tomorrow",
    cleaner: "Lisa Chen",
    type: "Regular Clean",
    priority: "normal",
  },
  {
    id: 4,
    customer: "Anderson Corp",
    address: "321 Corporate Blvd",
    time: "8:00 AM",
    date: "Tomorrow",
    cleaner: "Carlos Mendez",
    type: "Office Clean",
    priority: "high",
  },
  {
    id: 5,
    customer: "Williams Home",
    address: "555 Pine Street",
    time: "1:00 PM",
    date: "Tomorrow",
    cleaner: "Maria Rodriguez",
    type: "Regular Clean",
    priority: "normal",
  },
  {
    id: 6,
    customer: "Green Leaf Cafe",
    address: "888 Main Street",
    time: "6:00 AM",
    date: "Wednesday",
    cleaner: "John Smith",
    type: "Deep Clean",
    priority: "normal",
  },
];

const ITEMS_PER_PAGE = 3;

export function UpcomingJobs() {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<typeof upcomingJobs[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(upcomingJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedJobs = upcomingJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleViewDetails = (job: typeof upcomingJobs[0]) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  const handleViewAll = () => {
    navigate("/schedule");
  };

  return (
    <>
      <Card className="transition-all duration-200 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Upcoming Jobs</CardTitle>
          <Button variant="outline" size="sm" onClick={handleViewAll}>
            View All
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {paginatedJobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between p-4 bg-surface-muted rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">{job.customer}</h4>
                  <Badge
                    variant={job.priority === "high" ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {job.type}
                  </Badge>
                </div>
                
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3 h-3" />
                    <span>{job.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3" />
                    <span>{job.date} at {job.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-3 h-3" />
                    <span>{job.cleaner}</span>
                  </div>
                </div>
              </div>
              
              <div className="ml-4">
                <Button variant="outline" size="sm" onClick={() => handleViewDetails(job)}>
                  View Details
                </Button>
              </div>
            </div>
          ))}
          
          {/* Pagination at bottom */}
          <div className="flex items-center justify-center gap-1 pt-4 border-t border-border">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              {currentPage}/{totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <JobDetailsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        job={selectedJob}
      />
    </>
  );
}
