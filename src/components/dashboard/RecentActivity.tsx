import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, XCircle, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "completed",
    description: "Cleaning completed at Johnson Residence",
    time: "2 hours ago",
    status: "Completed",
    icon: CheckCircle,
    color: "text-success",
  },
  {
    id: 2,
    type: "scheduled",
    description: "New appointment scheduled for Smith Office",
    time: "3 hours ago",
    status: "Scheduled",
    icon: Calendar,
    color: "text-primary",
  },
  {
    id: 3,
    type: "pending",
    description: "Payment pending for Miller Apartment",
    time: "5 hours ago",
    status: "Pending",
    icon: Clock,
    color: "text-warning",
  },
  {
    id: 4,
    type: "cancelled",
    description: "Appointment cancelled by Davis Home",
    time: "1 day ago",
    status: "Cancelled",
    icon: XCircle,
    color: "text-destructive",
  },
  {
    id: 5,
    type: "completed",
    description: "Deep clean finished at Thompson House",
    time: "1 day ago",
    status: "Completed",
    icon: CheckCircle,
    color: "text-success",
  },
  {
    id: 6,
    type: "scheduled",
    description: "Weekly service booked for Anderson Corp",
    time: "2 days ago",
    status: "Scheduled",
    icon: Calendar,
    color: "text-primary",
  },
  {
    id: 7,
    type: "completed",
    description: "Move-out cleaning at Wilson Apartment",
    time: "2 days ago",
    status: "Completed",
    icon: CheckCircle,
    color: "text-success",
  },
  {
    id: 8,
    type: "pending",
    description: "Invoice pending for Garcia Office",
    time: "3 days ago",
    status: "Pending",
    icon: Clock,
    color: "text-warning",
  },
];

const ITEMS_PER_PAGE = 4;

export function RecentActivity() {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(activities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedActivities = activities.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {paginatedActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg bg-surface-muted ${activity.color}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {activity.time}
              </p>
            </div>
            <Badge
              variant={
                activity.status === "Completed"
                  ? "default"
                  : activity.status === "Cancelled"
                  ? "destructive"
                  : "secondary"
              }
              className="text-xs"
            >
              {activity.status}
            </Badge>
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
  );
}
