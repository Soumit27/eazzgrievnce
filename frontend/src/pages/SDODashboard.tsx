import { FileCheck, Send, Eye, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AdminRoleBadge } from "@/components/dashboard/AdminRoleBadge";
import { useState } from "react";

const SDODashboard = () => {
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [remarks, setRemarks] = useState("");

  const pendingProofs = [
    {
      id: "C001",
      subject: "Street Light Not Working",
      location: "Sector 15, Block A", 
      jeOfficer: "Rahul Kumar",
      submittedDate: "2024-01-23",
      proofImages: ["before.jpg", "after.jpg"],
      jeRemarks: "Street light pole replaced. New LED light installed and tested successfully.",
      priority: "high",
      completionTime: "3 days"
    },
    {
      id: "C003", 
      subject: "Water Supply Issue",
      location: "Sector 12, Block C",
      jeOfficer: "Priya Sharma",
      submittedDate: "2024-01-22",
      proofImages: ["pipe_repair.jpg"],
      jeRemarks: "Leak in main pipeline fixed. Water pressure restored to normal levels.",
      priority: "medium", 
      completionTime: "2 days"
    },
    {
      id: "C005",
      subject: "Road Pothole Repair", 
      location: "Main Street, Sector 8",
      jeOfficer: "Amit Singh",
      submittedDate: "2024-01-21",
      proofImages: ["road_before.jpg", "road_after.jpg", "materials.jpg"],
      jeRemarks: "Pothole filled with proper bitumen mix. Road surface leveled and compacted.",
      priority: "low",
      completionTime: "1 day"
    }
  ];

  const handleApprove = (complaintId: string) => {
    console.log(`Approving complaint ${complaintId} with remarks: ${remarks}`);
    // Here you would send approval to GM
    setSelectedComplaint(null);
    setRemarks("");
  };

  const handleReject = (complaintId: string) => {
    console.log(`Rejecting complaint ${complaintId} with remarks: ${remarks}`);
    // Here you would send back to JE
    setSelectedComplaint(null);
    setRemarks("");
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
            <h1 className="text-3xl font-bold">Sub-Divisional Officer</h1>
            <p className="text-muted-foreground">Review and approve JE submissions</p>
          </div>
          <AdminRoleBadge role="SDO" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingProofs.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting your approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">Sent to GM</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Sent back to JE</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Proofs Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              JE Submissions for Review
            </CardTitle>
            <CardDescription>
              Review work completion proofs submitted by Junior Engineers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {pendingProofs.map((proof) => (
                <div key={proof.id} className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">#{proof.id}</span>
                        {getPriorityBadge(proof.priority)}
                        <Badge variant="outline">Submitted by {proof.jeOfficer}</Badge>
                      </div>
                      <h4 className="text-lg font-semibold">{proof.subject}</h4>
                      <p className="text-muted-foreground">{proof.location}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Submitted: {proof.submittedDate}</span>
                        <span>Completion Time: {proof.completionTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h5 className="font-medium mb-2">JE Remarks:</h5>
                    <p className="text-sm">{proof.jeRemarks}</p>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Proof Images ({proof.proofImages.length}):</h5>
                    <div className="flex gap-2">
                      {proof.proofImages.map((image, index) => (
                        <div key={index} className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-3 py-1 rounded">
                          <Eye className="h-3 w-3" />
                          {image}
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedComplaint === proof.id ? (
                    <div className="space-y-4 border-t pt-4">
                      <div>
                        <label className="text-sm font-medium">Your Remarks:</label>
                        <Textarea
                          placeholder="Add your review comments..."
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleApprove(proof.id)} className="bg-green-600 hover:bg-green-700">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Approve & Send to GM
                        </Button>
                        <Button onClick={() => handleReject(proof.id)} variant="destructive">
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject & Return to JE
                        </Button>
                        <Button onClick={() => {setSelectedComplaint(null); setRemarks("");}} variant="outline">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 pt-2">
                      <Button onClick={() => setSelectedComplaint(proof.id)}>
                        Review & Take Action
                      </Button>
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Details
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SDODashboard;