import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Shield,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  LogOut,
  Eye,
  User,
  BarChart3,
  PieChart,
  TrendingUp,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";
import { AdminRoleBadge, AdminRole, getRolePermissions } from "@/components/dashboard/AdminRoleBadge";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ComplaintChart } from "@/components/dashboard/ComplaintChart";
import { ReportsTable } from "@/components/dashboard/ReportsTable";
import { postRequest } from "@/service/api";
import { useLogout } from "@/service/useLogout";


interface LoginResponse {
  access_token: string;
  token_type: string;
  role: string;
}

const AdminDashboard = () => {
  const logout = useLogout();
  const [currentRole, setCurrentRole] = useState<AdminRole>("GM");
  const [stats] = useState({
    totalComplaints: 1247,
    pendingValidation: 23,
    inProgress: 89,
    completedToday: 15,
    slaBreaches: 3,
    completionRate: 87,
    avgRating: 4.3,
    activeWorkers: 24
  });

  const [pendingComplaints] = useState([
    {
      id: "CGR001240",
      subject: "Street Light Not Working",
      category: "Street Lighting",
      citizen: "Rahul Kumar",
      location: "MG Road, Sector 15",
      dateSubmitted: "2024-01-20 09:30 AM",
      priority: "Medium"
    },
    {
      id: "CGR001241",
      subject: "Water Pipeline Burst",
      category: "Water Supply",
      citizen: "Priya Sharma",
      location: "Park Street, Block A",
      dateSubmitted: "2024-01-20 11:15 AM",
      priority: "High"
    }
  ]);

  const c = async (username: string, password: string) => {
    const body = new URLSearchParams();
    body.append("grant_type", "password");
    body.append("username", username);
    body.append("password", password);

    return postRequest<LoginResponse>("/v1/auth/login", body.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="government-gradient p-2 rounded-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Eazz Grievance Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={currentRole} onValueChange={(value) => setCurrentRole(value as AdminRole)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GM">Grievance Manager</SelectItem>
                  <SelectItem value="CM">Complaint Manager</SelectItem>
                  <SelectItem value="AM">Assistant Manager</SelectItem>
                  <SelectItem value="JE">Junior Engineer</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="SDO">Sub-Divisional Officer</SelectItem>
                </SelectContent>
              </Select>
              <AdminRoleBadge role={currentRole} />
              {currentRole === "GM" && (
                <Link to="/admin/users">
                  <Button variant="outline" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <User className="w-6 h-6 text-muted-foreground" />
                <span className="font-medium">Admin User</span>
              </div>
              <Button variant="ghost" size="sm"onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="mb-8">
          <StatsCards stats={stats} />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 max-w-4xl">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid md:grid-cols-2 gap-6">
              <ComplaintChart type="status" />
              <ComplaintChart type="sla" />
              <ComplaintChart type="category" />
              <ComplaintChart type="trend" />
            </div>
          </TabsContent>

          <TabsContent value="validation">
            <Card>
              <CardHeader>
                <CardTitle>Pending Validation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingComplaints.map((complaint) => (
                    <div key={complaint.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold">{complaint.subject}</h3>
                          <Badge variant="secondary">{complaint.priority}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {complaint.id} | Citizen: {complaint.citizen}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Location: {complaint.location} | Submitted: {complaint.dateSubmitted}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link to={`/admin/workflow/${complaint.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                        </Link>
                        <Button size="sm">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring">
            <div className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>SLA Monitoring</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Within SLA</span>
                        <Badge variant="default" className="bg-success text-success-foreground">87%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>SLA Breaches</span>
                        <Badge variant="secondary">13%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Critical Escalations</span>
                        <Badge variant="secondary">3</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Active Teams Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Team A (Available)</span>
                        <Badge variant="default" className="bg-success text-success-foreground">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Team B (Busy)</span>
                        <Badge variant="secondary">Busy</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Contractors</span>
                        <Badge variant="secondary">5 Available</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <ComplaintChart type="trend" />
                <ComplaintChart type="category" />
              </div>
              <ComplaintChart type="status" />
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <div className="space-y-6">
              <Tabs defaultValue="complaints" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="complaints">Complaints</TabsTrigger>
                  <TabsTrigger value="workers">Workers</TabsTrigger>
                  <TabsTrigger value="feedback">Feedback</TabsTrigger>
                  <TabsTrigger value="hotspots">Hotspots</TabsTrigger>
                </TabsList>

                <TabsContent value="complaints">
                  <ReportsTable type="complaints" />
                </TabsContent>

                <TabsContent value="workers">
                  <ReportsTable type="workers" />
                </TabsContent>

                <TabsContent value="feedback">
                  <ReportsTable type="feedback" />
                </TabsContent>

                <TabsContent value="hotspots">
                  <ReportsTable type="hotspots" />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardContent className="p-12 text-center">
                <Settings className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">System Settings</h3>
                <p className="text-muted-foreground">Configuration panel coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;