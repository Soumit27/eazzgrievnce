import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Download, Star } from "lucide-react";

interface ReportsTableProps {
  type: "complaints" | "workers" | "feedback" | "hotspots";
}

export const ReportsTable = ({ type }: ReportsTableProps) => {
  const complaintsData = [
    {
      id: "CGR001240",
      subject: "Street Light Not Working",
      citizen: "Rahul Kumar", 
      category: "Street Lighting",
      status: "In Progress",
      priority: "Medium",
      assignedTo: "Team A",
      slaStatus: "Within SLA",
      dateSubmitted: "2024-01-20"
    },
    {
      id: "CGR001241",
      subject: "Water Pipeline Burst",
      citizen: "Priya Sharma",
      category: "Water Supply", 
      status: "Assigned",
      priority: "High",
      assignedTo: "Team B",
      slaStatus: "SLA Breach",
      dateSubmitted: "2024-01-19"
    },
    {
      id: "CGR001242",
      subject: "Pothole on Main Road",
      citizen: "Amit Singh",
      category: "Road Maintenance",
      status: "Completed",
      priority: "Low", 
      assignedTo: "Contractor ABC",
      slaStatus: "Within SLA",
      dateSubmitted: "2024-01-18"
    }
  ];

  const workersData = [
    {
      name: "Team A",
      type: "Worker Team",
      assigned: 15,
      completed: 12,
      pending: 3,
      avgResolutionTime: "2.5 days",
      rating: 4.5,
      slaCompliance: "90%"
    },
    {
      name: "Team B", 
      type: "Worker Team",
      assigned: 18,
      completed: 14,
      pending: 4,
      avgResolutionTime: "3.1 days", 
      rating: 4.2,
      slaCompliance: "85%"
    },
    {
      name: "Contractor ABC",
      type: "Contractor",
      assigned: 8,
      completed: 7,
      pending: 1,
      avgResolutionTime: "2.8 days",
      rating: 4.7,
      slaCompliance: "95%"
    }
  ];

  const feedbackData = [
    {
      complaintId: "CGR001233",
      citizen: "John Doe", 
      category: "Road Maintenance",
      rating: 5,
      feedback: "Excellent work! The pothole was fixed quickly and professionally.",
      date: "2024-01-15",
      worker: "Team A"
    },
    {
      complaintId: "CGR001234",
      citizen: "Sarah Wilson",
      category: "Street Lighting",
      rating: 4,
      feedback: "Good work, but took a bit longer than expected.",
      date: "2024-01-14", 
      worker: "Team B"
    },
    {
      complaintId: "CGR001235",
      citizen: "Mike Johnson",
      category: "Water Supply",
      rating: 3,
      feedback: "Issue resolved but communication could be better.",
      date: "2024-01-13",
      worker: "Contractor ABC"
    }
  ];

  const hotspotsData = [
    {
      location: "MG Road, Sector 15",
      ward: "Ward 12",
      complaints: 25,
      category: "Street Lighting",
      urgency: "High",
      trend: "+15%"
    },
    {
      location: "Park Street, Block A", 
      ward: "Ward 8",
      complaints: 18,
      category: "Water Supply",
      urgency: "Medium",
      trend: "+8%"
    },
    {
      location: "Main Market Area",
      ward: "Ward 5",
      complaints: 22,
      category: "Garbage Collection", 
      urgency: "High",
      trend: "+20%"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "success";
      case "In Progress": return "warning";
      case "Assigned": return "secondary";
      case "SLA Breach": return "destructive";
      case "Within SLA": return "success";
      default: return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "destructive";
      case "Medium": return "secondary";
      case "Low": return "secondary";
      default: return "secondary";
    }
  };

  const renderTable = () => {
    switch (type) {
      case "complaints":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Complaint Management Report
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Complaint ID</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Citizen</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>SLA Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaintsData.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-medium">{complaint.id}</TableCell>
                      <TableCell>{complaint.subject}</TableCell>
                      <TableCell>{complaint.citizen}</TableCell>
                      <TableCell>{complaint.category}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(complaint.status) as any}>
                          {complaint.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(complaint.priority) as any}>
                          {complaint.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{complaint.assignedTo}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(complaint.slaStatus) as any}>
                          {complaint.slaStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );

      case "workers":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Worker & Contractor Performance Report
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Pending</TableHead>
                    <TableHead>Avg Resolution Time</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>SLA Compliance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workersData.map((worker, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{worker.name}</TableCell>
                      <TableCell>
                        <Badge variant={worker.type === "Worker Team" ? "secondary" : "outline"}>
                          {worker.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{worker.assigned}</TableCell>
                      <TableCell>{worker.completed}</TableCell>
                      <TableCell>{worker.pending}</TableCell>
                      <TableCell>{worker.avgResolutionTime}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-warning fill-warning" />
                          <span>{worker.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>{worker.slaCompliance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );

      case "feedback":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Citizen Feedback Report
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Complaint ID</TableHead>
                    <TableHead>Citizen</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Feedback</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Worker</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbackData.map((feedback, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{feedback.complaintId}</TableCell>
                      <TableCell>{feedback.citizen}</TableCell>
                      <TableCell>{feedback.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < feedback.rating ? 'text-warning fill-warning' : 'text-muted-foreground'}`} 
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{feedback.feedback}</TableCell>
                      <TableCell>{feedback.date}</TableCell>
                      <TableCell>{feedback.worker}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );

      case "hotspots":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Hotspot Analysis - Ward wise
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Ward</TableHead>
                    <TableHead>Complaints</TableHead>
                    <TableHead>Primary Category</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hotspotsData.map((hotspot, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{hotspot.location}</TableCell>
                      <TableCell>{hotspot.ward}</TableCell>
                      <TableCell>{hotspot.complaints}</TableCell>
                      <TableCell>{hotspot.category}</TableCell>
                      <TableCell>
                        <Badge variant={hotspot.urgency === "High" ? "destructive" : "secondary"}>
                          {hotspot.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-destructive font-medium">{hotspot.trend}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return renderTable();
};