import { Users, FileText, UserCheck, AlertTriangle, Share2, Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminRoleBadge } from "@/components/dashboard/AdminRoleBadge";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getComplaints,
  assignComplaint,
  AssignComplaintPayload,
  Worker,
  CreateWorkerPayload,
  getWorkers,
  createWorker,
} from "@/service/complaint";
import { MeResponse } from "@/service/userApi";

// Modal component
const Modal = ({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 relative overflow-y-auto max-h-[80vh]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button size="sm" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
};

const ComplaintManager = () => {
  const queryClient = useQueryClient();

  // Logged-in user
  const storedUser = sessionStorage.getItem("user");
  const loggedInUser: MeResponse | null = storedUser ? JSON.parse(storedUser) : null;

  // State
  const [currentComplaintId, setCurrentComplaintId] = useState<string | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [newWorkerName, setNewWorkerName] = useState("");
  const [newWorkerRole, setNewWorkerRole] = useState("");
  const [viewingComplaint, setViewingComplaint] = useState<any | null>(null);
  const [availableWorkersMap, setAvailableWorkersMap] = useState<Record<string, Worker[]>>({});
  


  // Fetch complaints
  const { data: complaints = [], isLoading, isError } = useQuery({
    queryKey: ["complaints"],
    queryFn: getComplaints,
  });

  // Fetch workers
  const { data: workers = [] } = useQuery({
    queryKey: ["workers"],
    queryFn: getWorkers,
  });


  const assignMutation = useMutation({
    mutationFn: ({ complaintId, payload }: { complaintId: string; payload: AssignComplaintPayload }) =>
      assignComplaint(complaintId, payload),
    onSuccess: (data) => {
      console.log("Assign API Response:", data);
      queryClient.invalidateQueries({ queryKey: ["complaints"] });

      // Store available workers for this complaint
      setAvailableWorkersMap((prev) => ({
        ...prev,
        [data.complaint.id]: data.available_workers,
      }));

      alert("Complaint assigned successfully!");
      setCurrentComplaintId(null);
      setSelectedWorker("");
      setRemarks("");
    },
    onError: (err: any) => {
      console.error("Assign error:", err.response?.data || err);
      alert("Failed to assign complaint.");
    },
  });


  // Mutation: Create worker
  // const createWorkerMutation = useMutation({
  //   mutationFn: (payload: CreateWorkerPayload) => createWorker(payload),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["workers"] });
  //     alert("Worker created successfully!");
  //     setNewWorkerName("");
  //     setNewWorkerRole("");
  //   },
  //   onError: (err: any) => {
  //     console.error("Worker create error:", err);
  //     alert("Failed to create worker.");
  //   },
  // });


  // Mutation: Create worker
  const createWorkerMutation = useMutation({
    mutationFn: (payload: CreateWorkerPayload) => createWorker(payload),
    onSuccess: (data: Worker) => {
      queryClient.invalidateQueries({ queryKey: ["workers"] }); // optional, keeps query in sync
      alert("Worker created successfully!");

      // **Select the newly added worker automatically**
      setSelectedWorker(data.id);

      setNewWorkerName("");
      setNewWorkerRole("");
    },
    onError: (err: any) => {
      console.error("Worker create error:", err);
      alert("Failed to create worker.");
    },
  });


  // Sample notifications
  const [notifications] = useState([
    {
      id: 1,
      type: "escalation",
      message: "Complaint CM001 deadline missed. Escalated to higher authority.",
      time: "10 mins ago",
    },
    {
      id: 2,
      type: "assignment",
      message: "Complaint CM002 reassigned to JE - Ramesh.",
      time: "30 mins ago",
    },
    {
      id: 3,
      type: "new",
      message: "New complaint CM004 received for Sector 20.",
      time: "1 hr ago",
    },
  ]);

  // Handler: Assign selected worker
  const handleAssignWorker = () => {
    if (!currentComplaintId || !selectedWorker) return;

    const complaint = complaints.find(c => c.id === currentComplaintId);
    if (!complaint) return;

    const payload: AssignComplaintPayload = {
      group: complaint?.group || "DefaultGroup",
      worker_user_id: selectedWorker,
      remarks: remarks || "No remarks",
      sla_minutes: 240,
    };

    console.log("Assign payload:", payload);
    assignMutation.mutate({ complaintId: currentComplaintId, payload });
  };

  if (isLoading) return <p className="p-4">Loading complaints...</p>;
  if (isError) return <p className="p-4 text-red-500">Failed to load complaints.</p>;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Complaint Manager Dashboard</h1>
            <p className="text-muted-foreground">Manage and assign complaints</p>
          </div>
          <AdminRoleBadge role="CM" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
              <FileText className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{complaints.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Assigned to Group</CardTitle>
              <Users className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{complaints.filter((c: any) => c.group).length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Reassigned to JE</CardTitle>
              <UserCheck className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{complaints.filter((c: any) => c.assignedTo).length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Escalated</CardTitle>
              <AlertTriangle className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{complaints.filter((c: any) => c.status === "escalated").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getNotificationIcon(n.type)}
                  <div>
                    <p className="text-sm">{n.message}</p>
                    <p className="text-xs text-muted-foreground">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Create Worker (CM only) */}
        {loggedInUser?.role === "CM" && (
          <Card>
            <CardHeader>
              <CardTitle>Create Worker</CardTitle>
              <CardDescription>Add a new worker profile (CM only)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  placeholder="Full Name"
                  value={newWorkerName}
                  onChange={(e) => setNewWorkerName(e.target.value)}
                />
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  placeholder="Role (e.g. Plumber, Electrician)"
                  value={newWorkerRole}
                  onChange={(e) => setNewWorkerRole(e.target.value)}
                />
                <Button
                  onClick={() =>
                    createWorkerMutation.mutate({
                      full_name: newWorkerName,
                      role: newWorkerRole,
                    })
                  }
                  disabled={!newWorkerName || !newWorkerRole}
                >
                  Add Worker
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Complaints Table */}
        <Card>
          <CardHeader>
            <CardTitle>Complaint Assignment</CardTitle>
            <CardDescription>Assign complaints to workers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complaints.map((c: any) => (
                <div key={c.id} className="p-4 border rounded-lg flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">#{c.id}</span>
                      {getStatusBadge(c.status)}
                      {getPriorityBadge(c.priority || "medium")}
                    </div>
                    <h4 className="font-semibold">{c.complaint_subject}</h4>
                    <p className="text-sm text-muted-foreground">{c.complete_address}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created: {new Date(c.created_at).toLocaleDateString()}
                    </p>
                    {c.group && <p className="text-xs">Group: <b>{c.group}</b></p>}
                    {c.assignedTo && <p className="text-xs">JE: <b>{c.assignedTo}</b></p>}

                    {/* Show assign dropdown only for selected complaint */}
                    {currentComplaintId === c.id && (
                      <div className="mt-2 space-y-2">
                        <select
                          className="border p-2 rounded w-full"
                          value={selectedWorker}
                          onChange={(e) => setSelectedWorker(e.target.value)}
                        >
                          <option value="">-- Select Worker --</option>
                          {workers.map((w) => {
                            const isAvailable = w.active_tasks === 0; // available if no active tasks
                            return (
                              <option
                                key={w.id}
                                value={w.id}
                                disabled={!isAvailable} // disable if busy
                                style={{ color: isAvailable ? "black" : "gray" }}
                              >
                                {w.full_name} ({w.active_tasks}) {isAvailable ? "" : "- Busy"}
                              </option>
                            );
                          })}
                        </select>

                        <input
                          type="text"
                          className="border p-2 rounded w-full"
                          placeholder="Remarks"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                        />
                        <Button
                          className="w-full"
                          onClick={handleAssignWorker}
                          disabled={!selectedWorker}
                        >
                          Assign Worker
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setViewingComplaint(c)}>
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setCurrentComplaintId(c.id)}
                    >
                      Assign Worker
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Complaint Details Modal */}
        <Modal open={!!viewingComplaint} onClose={() => setViewingComplaint(null)} title={`Complaint #${viewingComplaint?.id}`}>
          <p><b>Subject:</b> {viewingComplaint?.complaint_subject}</p>
          <p><b>Description:</b> {viewingComplaint?.detailed_description}</p>
          <p><b>Address:</b> {viewingComplaint?.complete_address}</p>
          <p><b>Status:</b> {viewingComplaint?.status}</p>
          <p><b>Priority:</b> {viewingComplaint?.priority}</p>
          <p><b>Created At:</b> {new Date(viewingComplaint?.created_at).toLocaleString()}</p>

          {viewingComplaint?.current_assignment?.proof_files?.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {viewingComplaint.current_assignment.proof_files.map((file: any, idx: number) => (
                <div key={idx} className="border rounded-lg p-1 flex flex-col items-center">
                  {file.file_url ? (
                    <img
                      src={file.file_url}
                      alt={file.file_name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">{file.file_name}</span>
                  )}
                  <span className="text-xs mt-1">{file.file_name}</span>
                </div>
              ))}
            </div>
          )}
        </Modal>

      </div>
    </div>
  );
};

/* Helper functions */
function getStatusBadge(status: string) {
  const variants: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    resolved: "bg-green-100 text-green-800",
    escalated: "bg-red-100 text-red-800",
  };
  return <Badge className={variants[status] || ""}>{status}</Badge>;
}

function getPriorityBadge(priority: string) {
  const variants: Record<string, string> = {
    high: "bg-red-100 text-red-800",
    medium: "bg-blue-100 text-blue-800",
    low: "bg-gray-100 text-gray-800",
  };
  return <Badge className={variants[priority] || ""}>{priority}</Badge>;
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "escalation":
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case "assignment":
      return <UserCheck className="h-5 w-5 text-blue-500" />;
    case "new":
      return <FileText className="h-5 w-5 text-green-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
}

export default ComplaintManager;
