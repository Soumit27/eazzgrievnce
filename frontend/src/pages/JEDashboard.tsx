import { Bell, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminRoleBadge } from "@/components/dashboard/AdminRoleBadge";

const JEDashboard = () => {
  const notifications = [
    { id: 1, message: "New complaint assigned: Water leak at Block A", time: "2 minutes ago", type: "new" },
    { id: 2, message: "Reminder: Complaint #1234 deadline approaching", time: "1 hour ago", type: "reminder" },
    { id: 3, message: "Complaint #1200 approved by SDO", time: "3 hours ago", type: "approved" }
  ];

  const assignedComplaints = [
    { 
      id: "C001", 
      subject: "Street Light Not Working", 
      location: "Sector 15, Block A", 
      priority: "high",
      status: "in_progress",
      deadline: "2024-01-25",
      assignedDate: "2024-01-20"
    },
    { 
      id: "C002", 
      subject: "Water Supply Issue", 
      location: "Sector 12, Block C", 
      priority: "medium",
      status: "pending",
      deadline: "2024-01-28", 
      assignedDate: "2024-01-21"
    },
    { 
      id: "C003", 
      subject: "Road Repair Required", 
      location: "Main Street", 
      priority: "low",
      status: "completed",
      deadline: "2024-01-30",
      assignedDate: "2024-01-18"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge variant="default">Completed</Badge>;
      case "in_progress": return <Badge variant="secondary">In Progress</Badge>;
      case "pending": return <Badge variant="outline">Pending</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high": return <Badge className="bg-red-500 text-white">High</Badge>;
      case "medium": return <Badge className="bg-yellow-500 text-white">Medium</Badge>;
      case "low": return <Badge className="bg-green-500 text-white">Low</Badge>;
      default: return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Junior Engineer Dashboard</h1>
            <p className="text-muted-foreground">Manage your assigned complaints and work status</p>
          </div>
          <AdminRoleBadge role="JE" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Active work</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Assigned Complaints */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Assigned Complaints</CardTitle>
              <CardDescription>Manage your current workload</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignedComplaints.map((complaint) => (
                  <div key={complaint.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">#{complaint.id}</span>
                          {getStatusBadge(complaint.status)}
                          {getPriorityBadge(complaint.priority)}
                        </div>
                        <h4 className="font-semibold">{complaint.subject}</h4>
                        <p className="text-sm text-muted-foreground">{complaint.location}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Assigned: {complaint.assignedDate}</span>
                          <span>Deadline: {complaint.deadline}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        {complaint.status === "completed" ? (
                          <Button size="sm">Submit to SDO</Button>
                        ) : (
                          <Button size="sm" variant="secondary">Update Status</Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JEDashboard;