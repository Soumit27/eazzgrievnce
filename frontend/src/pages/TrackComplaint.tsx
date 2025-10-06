import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Search, 
  Clock, 
  User, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Phone,
  Mail,
  Calendar
} from "lucide-react";

const TrackComplaint = () => {
  const [complaintId, setComplaintId] = useState("");
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (complaintId.toUpperCase() === "CGR001234") {
        setTrackingResult({
          id: "CGR001234",
          subject: "Broken Street Light on MG Road",
          category: "Street Lighting", 
          status: "In Progress",
          priority: "Medium",
          dateSubmitted: "2024-01-15",
          expectedResolution: "2024-01-22",
          progress: 60,
          assignedTo: "Team A - Electrical Maintenance",
          lastUpdate: "2024-01-19",
          timeline: [
            {
              status: "Complaint Submitted",
              date: "2024-01-15 10:30 AM",
              description: "Complaint received and recorded in the system",
              completed: true
            },
            {
              status: "Validation Complete", 
              date: "2024-01-15 02:15 PM",
              description: "Complaint validated by Complaint Manager",
              completed: true
            },
            {
              status: "Assigned to Team",
              date: "2024-01-16 09:00 AM", 
              description: "Assigned to Team A - Electrical Maintenance",
              completed: true
            },
            {
              status: "Work in Progress",
              date: "2024-01-18 11:30 AM",
              description: "Field team started repair work", 
              completed: true
            },
            {
              status: "Verification Pending",
              date: "Expected: 2024-01-21",
              description: "Work completion verification by Assistant Manager",
              completed: false
            },
            {
              status: "Closure",
              date: "Expected: 2024-01-22", 
              description: "Final closure and OTP confirmation",
              completed: false
            }
          ]
        });
      } else {
        setTrackingResult(null);
      }
      setIsLoading(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "warning";
      case "Completed": return "success"; 
      case "Assigned": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold">Track Complaint</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Enter Complaint ID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="complaint-id">Complaint ID</Label>
                <Input
                  id="complaint-id"
                  placeholder="Enter your complaint ID (e.g., CGR001234)"
                  value={complaintId}
                  onChange={(e) => setComplaintId(e.target.value)}
                  className="text-lg"
                />
              </div>
              <Button 
                onClick={handleTrack} 
                disabled={!complaintId || isLoading}
                className="self-end"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Tracking...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Track Status
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Try searching for: <span className="font-medium text-primary">CGR001234</span>
            </p>
          </CardContent>
        </Card>

        {/* Results */}
        {trackingResult ? (
          <div className="space-y-6">
            {/* Complaint Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Complaint Details
                  </div>
                  <Badge variant={getStatusColor(trackingResult.status) as any}>
                    {trackingResult.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{trackingResult.subject}</h3>
                  <p className="text-muted-foreground">ID: {trackingResult.id}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Submitted: {trackingResult.dateSubmitted}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Expected: {trackingResult.expectedResolution}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>Category: {trackingResult.category}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{trackingResult.progress}% Complete</span>
                  </div>
                  <Progress value={trackingResult.progress} className="h-3" />
                </div>

                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm font-medium">Currently Assigned To:</p>
                  <p className="text-sm text-muted-foreground">{trackingResult.assignedTo}</p>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trackingResult.timeline.map((step: any, index: number) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? 'bg-success text-white' 
                          : 'bg-muted border-2 border-muted-foreground'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.status}
                          </h4>
                          <span className="text-sm text-muted-foreground">{step.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Helpline</p>
                    <p className="text-sm text-muted-foreground">1800-XXX-XXXX</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">support@eazzgrievance.gov.in</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : complaintId && !isLoading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Complaint Not Found</h3>
              <p className="text-muted-foreground mb-6">
                No complaint found with ID "{complaintId}". Please check the ID and try again.
              </p>
              <Button variant="outline" onClick={() => setComplaintId("")}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default TrackComplaint;