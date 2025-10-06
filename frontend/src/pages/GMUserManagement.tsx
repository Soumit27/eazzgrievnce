import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  UserPlus,
  MapPin,
  Mail,
  Shield,
  Users,
  Settings,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  EyeOff
} from "lucide-react";
import { Link } from "react-router-dom";
import { AdminRoleBadge } from "@/components/dashboard/AdminRoleBadge";
import { loginRequest } from "@/service/authApi";
import { getRequest } from "@/service/api";
import { createUserRequest, CreateUserPayload, UpdateUserPayload, updateUserRequest, deleteUserRequest, } from "@/service/userApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UserEditModal from "@/components/users/UserEditModal";

interface User {
  id: string;
  name: string;
  email: string;
  role: "JE" | "SDO" | "CM";
  division: string;
  status: "Active" | "Inactive";
  createdDate: string;
}

interface Division {
  id: string;
  name: string;
  code: string;
  jeCount: number;
  sdoCount: number;
  activeComplaints: number;
}

const GMUserManagement = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const data = await loginRequest(email, password);
      sessionStorage.setItem("access_token", data.access_token);
      sessionStorage.setItem("role", data.role);
      alert(`✅ Logged in as ${data.role}`);
    } catch (err: any) {
      console.error("❌ Login failed", err.response?.data || err.message);
      alert("Login failed. Check credentials.");
    }
  };


  const [divisions] = useState<Division[]>([
    { id: "1", name: "Central Division", code: "CD", jeCount: 3, sdoCount: 1, activeComplaints: 45 },
    { id: "2", name: "North Division", code: "ND", jeCount: 2, sdoCount: 1, activeComplaints: 32 },
    { id: "3", name: "South Division", code: "SD", jeCount: 4, sdoCount: 2, activeComplaints: 67 },
    { id: "4", name: "East Division", code: "ED", jeCount: 2, sdoCount: 1, activeComplaints: 28 }
  ]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    division: "",
    password: "",
  });

  const queryClient = useQueryClient();

  // Fetch users
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => getRequest<User[]>("/users/"),
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (payload: CreateUserPayload) => createUserRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setNewUser({ name: "", email: "", role: "", division: "", password: "" });
      alert("✅ User created successfully!");
    },
    onError: (err: any) => {
      console.error(err);
      alert("❌ Failed to create user.");
    }
  });


  const updateUserMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      updateUserRequest(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      alert("✅ User updated successfully!");
    },
    onError: (err: any) => {
      console.error(err);
      alert("❌ Failed to update user.");
    },
  });



  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteUserRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      alert("🗑️ User deleted successfully!");
    },
    onError: (err: any) => {
      console.error(err);
      alert("❌ Failed to delete user.");
    },
  });

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.division || !newUser.password) return;

    const payload: CreateUserPayload = { ...newUser }; // password comes from newUser.password
    createUserMutation.mutate(payload);
  };


  const getNextEmployeeId = (role: string, division: string) => {
    const divisionCode = divisions.find(d => d.name === division)?.code || "XX";
    let roleCode = "XX";
    if (role === "JE") roleCode = "JE";
    else if (role === "SDO") roleCode = "SDO";
    else if (role === "CM") roleCode = "CM";

    const count = users.filter(u => u.role === role && u.division === division).length + 1;
    return `${divisionCode}-${roleCode}${count.toString().padStart(3, '0')}`;
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
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">User Management</h1>
                  <p className="text-sm text-muted-foreground">Create and manage JE/SDO accounts</p>
                </div>
              </div>
            </div>
            <AdminRoleBadge role="GM" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="create">Create Users</TabsTrigger>
            <TabsTrigger value="manage">Manage Users</TabsTrigger>
            <TabsTrigger value="divisions">Divisions</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* User Creation Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create New User
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="user@gov.in"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="JE">Assistant Manager(JE)</SelectItem>
                          <SelectItem value="SDO">Manager(SDO)</SelectItem>
                          <SelectItem value="CM">Complain Manager(CM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"} // toggle visibility
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          placeholder="Enter password"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Sub-Division Assignment</Label>
                      <Select value={newUser.division} onValueChange={(value) => setNewUser({ ...newUser, division: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select division" />
                        </SelectTrigger>
                        <SelectContent>
                          {divisions.map((division) => (
                            <SelectItem key={division.id} value={division.name}>
                              {division.name} ({division.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {newUser.role && newUser.division && (
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm font-medium">Generated Employee ID:</p>
                      <p className="text-lg font-bold text-primary">
                        {getNextEmployeeId(newUser.role, newUser.division)}
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleCreateUser}
                    className="w-full"
                    disabled={!newUser.name || !newUser.email || !newUser.role || !newUser.division || createUserMutation.isPending}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {createUserMutation.isPending ? "Creating..." : "Create User & Send Credentials"}
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-primary/10 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{users.filter(u => u.role === 'JE').length}</div>
                        <div className="text-sm text-muted-foreground">Junior Engineers</div>
                      </div>
                      <div className="text-center p-4 bg-secondary/10 rounded-lg">
                        <div className="text-2xl font-bold text-secondary">{users.filter(u => u.role === 'SDO').length}</div>
                        <div className="text-sm text-muted-foreground">SDOs</div>
                      </div>
                      <div className="text-center p-4 bg-success/10 rounded-lg">
                        <div className="text-2xl font-bold text-success">{users.filter(u => u.role === 'CM').length}</div>
                        <div className="text-sm text-muted-foreground">Complaint Managers</div>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-success/10 rounded-lg">
                      <div className="text-2xl font-bold text-success">{divisions.length}</div>
                      <div className="text-sm text-muted-foreground">Active Divisions</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span>Sunita Devi (SDO) added to South Division</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>Amit Singh (JE) assigned to North Division</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-warning rounded-full"></div>
                        <span>Central Division reached capacity</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>User Directory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="government-gradient p-2 rounded-full">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold">{user.name}</h3>
                            <AdminRoleBadge role={user.role} />  {/* Add this */}
                            <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                              {user.status}
                            </Badge>
                          </div>

                          <div className="text-sm text-muted-foreground">
                            {user.email} • {user.division} • Created: {user.createdDate}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateUserMutation.mutate({
                              id: user.id,
                              payload: { status: user.status === "Active" ? "Inactive" : "Active" }
                            })
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setEditOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>


                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          onClick={() => deleteUserMutation.mutate(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>


            <UserEditModal
              open={editOpen}
              onClose={() => setEditOpen(false)}
              user={selectedUser}
              onSave={(data) => {
                if (selectedUser) {
                  updateUserMutation.mutate({ id: selectedUser.id, payload: data });
                }
              }}
            />

          </TabsContent>

          <TabsContent value="divisions">
            <div className="grid md:grid-cols-2 gap-6">
              {divisions.map((division) => (
                <Card key={division.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5" />
                        <span>{division.name}</span>
                      </div>
                      <Badge variant="outline">{division.code}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">{division.jeCount}</div>
                        <div className="text-xs text-muted-foreground">JE Officers</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-secondary">{division.sdoCount}</div>
                        <div className="text-xs text-muted-foreground">SDO Officers</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-warning">{division.activeComplaints}</div>
                        <div className="text-xs text-muted-foreground">Active Cases</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GMUserManagement;
