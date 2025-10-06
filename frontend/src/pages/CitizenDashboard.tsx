import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Bell, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  User,
  LogOut,
  Star,
  Eye,
  MessageSquare
} from "lucide-react";

const CitizenDashboard = () => {
  const [activeComplaints] = useState([
    {
      id: "CGR001234",
      subject: "Broken Street Light on MG Road",
      category: "Street Lighting",
      status: "In Progress",
      priority: "Medium",
      dateSubmitted: "2024-01-15",
      expectedResolution: "2024-01-22",
      progress: 60
    },
    {
      id: "CGR001235", 
      subject: "Water Supply Disruption",
      category: "Water Supply",
      status: "Assigned",
      priority: "High", 
      dateSubmitted: "2024-01-18",
      expectedResolution: "2024-01-25",
      progress: 25
    }
  ]);

  const [recentComplaints] = useState([
    {
      id: "CGR001233",
      subject: "Pothole on Main Street",
      category: "Road Maintenance", 
      status: "Completed",
      resolution: "Road repaired successfully",
      rating: 5,
      dateCompleted: "2024-01-10"
    },
    {
      id: "CGR001232",
      subject: "Garbage Collection Delay",
      category: "Garbage Collection",
      status: "Completed", 
      resolution: "Collection schedule updated",
      rating: 4,
      dateCompleted: "2024-01-08"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "success";
      case "In Progress": return "warning";
      case "Assigned": return "secondary";
      default: return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "destructive";
      case "Medium": return "warning";
      case "Low": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-bold text-primary">
                Eazz Grievance
              </Link>
              <Badge variant="secondary">Citizen Portal</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <User className="w-6 h-6 text-muted-foreground" />
                <span className="font-medium">John Doe</span>
              </div>
              <Button variant="ghost" size="sm">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="government-gradient text-white">
            <CardContent className="p-6 text-center">
              <Plus className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">New Complaint</h3>
              <p className="text-white/80 mb-4">Submit a new grievance with evidence</p>
              <Link to="/complaint/new">
                <Button variant="secondary" size="lg">
                  Submit Complaint
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Track Status</h3>
              <p className="text-muted-foreground mb-4">Check the status of your complaints</p>
              <Link to="/track">
                <Button variant="outline" size="lg">
                  Track Complaint
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">My History</h3>
              <p className="text-muted-foreground mb-4">View all past complaints and resolutions</p>
              <Button variant="outline" size="lg">
                View History
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="active">Active Complaints</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Active Complaints</h2>
                <Badge variant="secondary">{activeComplaints.length} Active</Badge>
              </div>

              {activeComplaints.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No Active Complaints</h3>
                    <p className="text-muted-foreground mb-6">You don't have any active complaints at the moment.</p>
                    <Link to="/complaint/new">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Submit New Complaint
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {activeComplaints.map((complaint) => (
                    <Card key={complaint.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-semibold">{complaint.subject}</h3>
                              <Badge variant={getStatusColor(complaint.status) as any}>
                                {complaint.status}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>ID: {complaint.id}</span>
                              <span>Category: {complaint.category}</span>
                              <Badge variant={getPriorityColor(complaint.priority) as any} className="text-xs">
                                {complaint.priority} Priority
                              </Badge>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{complaint.progress}% Complete</span>
                          </div>
                          <Progress value={complaint.progress} className="h-2" />
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>Submitted: {complaint.dateSubmitted}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                              <span>Expected: {complaint.expectedResolution}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Completed Complaints</h2>
                <Badge variant="default" className="bg-success text-success-foreground">{recentComplaints.length} Completed</Badge>
              </div>

              <div className="grid gap-6">
                {recentComplaints.map((complaint) => (
                  <Card key={complaint.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold">{complaint.subject}</h3>
                            <Badge variant="default" className="bg-success text-success-foreground">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>ID: {complaint.id}</span>
                            <span>Category: {complaint.category}</span>
                            <span>Completed: {complaint.dateCompleted}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < complaint.rating ? 'text-warning fill-warning' : 'text-muted-foreground'}`} 
                              />
                            ))}
                          </div>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Feedback
                          </Button>
                        </div>
                      </div>

                      <div className="bg-success/10 p-3 rounded-lg border border-success/20">
                        <p className="text-success font-medium">Resolution:</p>
                        <p className="text-sm text-muted-foreground mt-1">{complaint.resolution}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CitizenDashboard;