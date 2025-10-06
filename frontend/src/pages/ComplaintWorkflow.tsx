import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Image,
  MessageSquare,
  User,
  Shield,
  Users,
  Eye,
  Upload
} from "lucide-react";
import { Link } from "react-router-dom";
import { AdminRoleBadge, AdminRole } from "@/components/dashboard/AdminRoleBadge";

interface WorkflowStep {
  role: AdminRole;
  status: "completed" | "current" | "pending";
  timestamp?: string;
  remarks?: string;
  officer?: string;
}

interface ComplaintDetails {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  citizen: string;
  location: string;
  dateSubmitted: string;
  currentStage: AdminRole;
  workflow: WorkflowStep[];
  evidence: string[];
}

const ComplaintWorkflow = () => {
  const [userRole] = useState<AdminRole>("JE"); // This would come from auth context
  const [actionRemarks, setActionRemarks] = useState("");

  const [complaint] = useState<ComplaintDetails>({
    id: "CGR001240",
    subject: "Street Light Not Working on MG Road",
    description: "The street light near MG Road bus stop has been non-functional for the past 3 days. This is causing visibility issues during evening hours and poses a safety risk for pedestrians and vehicles.",
    category: "Street Lighting",
    priority: "Medium",
    citizen: "Rahul Kumar",
    location: "MG Road, Sector 15, Near Bus Stop",
    dateSubmitted: "2024-01-20 09:30 AM",
    currentStage: "JE",
    workflow: [
      {
        role: "CM",
        status: "completed",
        timestamp: "2024-01-20 09:45 AM",
        remarks: "Complaint validated and assigned to JE team",
        officer: "Complaint Manager - Suresh Patel"
      },
      {
        role: "JE",
        status: "current",
        officer: "Junior Engineer - Amit Singh"
      },
      {
        role: "SDO",
        status: "pending",
        officer: "SDO - Priya Sharma"
      },
      {
        role: "GM",
        status: "pending",
        officer: "General Manager - Rajesh Kumar"
      }
    ],
    evidence: ["street_light_photo1.jpg", "location_map.jpg"]
  });

  const canTakeAction = (step: WorkflowStep) => {
    return step.role === userRole && step.status === "current";
  };

  const handleApprove = () => {
    console.log("Approving and forwarding to next stage:", { actionRemarks });
    setActionRemarks("");
  };

  const handleReject = () => {
    console.log("Rejecting complaint:", { actionRemarks });
    setActionRemarks("");
  };

  const getStageColor = (status: string) => {
    switch (status) {
      case "completed": return "success";
      case "current": return "warning";
      case "pending": return "secondary";
      default: return "secondary";
    }
  };

  const getStageIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "current": return Clock;
      case "pending": return Clock;
      default: return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-3">
                <div className="government-gradient p-2 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Complaint Workflow</h1>
                  <p className="text-sm text-muted-foreground">ID: {complaint.id}</p>
                </div>
              </div>
            </div>
            <AdminRoleBadge role={userRole} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Complaint Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{complaint.subject}</span>
                  <Badge variant={complaint.priority === "High" ? "destructive" : complaint.priority === "Medium" ? "secondary" : "outline"}>
                    {complaint.priority} Priority
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Citizen:</span> {complaint.citizen}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span> {complaint.category}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span> {complaint.location}
                  </div>
                  <div>
                    <span className="font-medium">Submitted:</span> {complaint.dateSubmitted}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">{complaint.description}</p>
                </div>

                {complaint.evidence.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Evidence Attached</h4>
                    <div className="flex flex-wrap gap-2">
                      {complaint.evidence.map((file, index) => (
                        <Badge key={index} variant="outline" className="flex items-center space-x-1">
                          <Image className="w-3 h-3" />
                          <span>{file}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Panel */}
            {complaint.workflow.some(step => canTakeAction(step)) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Action Required
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="remarks">Remarks/Comments</Label>
                    <Textarea
                      id="remarks"
                      placeholder="Enter your remarks or additional instructions..."
                      value={actionRemarks}
                      onChange={(e) => setActionRemarks(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Attach Work Evidence (Optional)</Label>
                    <Button variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photos/Documents
                    </Button>
                  </div>

                  <div className="flex space-x-3">
                    <Button 
                      onClick={handleApprove} 
                      className="flex-1"
                      disabled={!actionRemarks.trim()}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve & Forward
                    </Button>
                    <Button 
                      onClick={handleReject} 
                      variant="destructive"
                      className="flex-1"
                      disabled={!actionRemarks.trim()}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject & Return
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Workflow Status */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complaint.workflow.map((step, index) => {
                    const StageIcon = getStageIcon(step.status);
                    const isLast = index === complaint.workflow.length - 1;
                    
                    return (
                      <div key={step.role} className="relative">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full ${step.status === 'completed' ? 'bg-success text-success-foreground' : step.status === 'current' ? 'bg-warning text-warning-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                            <StageIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <AdminRoleBadge role={step.role} />
                              <Badge variant={getStageColor(step.status) as any}>
                                {step.status === 'completed' ? 'Completed' : step.status === 'current' ? 'In Progress' : 'Pending'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{step.officer}</p>
                            {step.timestamp && (
                              <p className="text-xs text-muted-foreground">{step.timestamp}</p>
                            )}
                            {step.remarks && (
                              <div className="mt-2 p-2 bg-secondary/20 rounded text-sm">
                                <MessageSquare className="w-3 h-3 inline mr-1" />
                                {step.remarks}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {!isLast && (
                          <div className="absolute left-5 top-12 w-px h-8 bg-border"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SLA Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Target Resolution</span>
                    <Badge variant="outline">48 hours</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Time Elapsed</span>
                    <Badge variant="secondary">18 hours</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Time Remaining</span>
                    <Badge variant="default">30 hours</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Citizen
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Assign Team
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  Site Inspection
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintWorkflow;