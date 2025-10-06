// Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Phone, User, Lock, ArrowLeft } from "lucide-react";
import { postRequest } from "@/service/api";
import { loginRequest } from "@/service/authApi";
import { getMeRequest, MeResponse } from "@/service/userApi";


interface LoginResponse {
  access_token: string;
  token_type: string;
  role: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpDebug, setOtpDebug] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  // Citizen OTP mutations
  const sendOtpMutation = useMutation({
    mutationFn: () => postRequest("/auth/citizen/send-otp", { phone: phoneNumber }),
    onSuccess: (data: any) => {
      setOtpSent(true);
      // access nested 'data'
      setOtpDebug(data.data?.otp_debug || "");
      alert(`OTP sent (dev): ${data.data?.otp_debug}`);
    },
    onError: (err) => {
      console.error("Send OTP failed:", err);
      alert("Failed to send OTP. Try again.");
    },
  });


  const verifyOtpMutation = useMutation({
    mutationFn: () => postRequest("/auth/citizen/verify-otp", { phone: phoneNumber, otp }),
    onSuccess: (res: any) => {
      alert("Login successful!");
      navigate("/dashboard");
    },
    onError: (err) => {
      console.error("OTP verification failed:", err);
      alert("Invalid OTP. Please try again.");
    },
  });

  // const adminLoginMutation = useMutation({
  //   mutationFn: () => loginRequest(username, password),
  //   onSuccess: (data) => {
  //     // Save token and role
  //     sessionStorage.setItem("access_token", data.access_token);
  //     sessionStorage.setItem("role", data.role.toUpperCase()); // normalize

  //     // Redirect based on role
  //     const role = data.role.toUpperCase();
  //     if (role === "GM") navigate("/admin");          // GM goes to admin dashboard
  //     else if (role === "JE") navigate("/je/dashboard"); // JE goes to JE dashboard
  //     else if (role === "SDO") navigate("/sdo/dashboard"); // SDO goes to SDO dashboard
  //     else if (role === "CM") navigate("/complaint/manager");
  //     else navigate("/login"); // fallback
  //   },
  //   onError: (err: any) => {
  //     console.error("Admin login failed:", err);
  //     alert(err.response?.data?.detail || "Login failed. Check username/password");
  //   },
  // });



  const adminLoginMutation = useMutation({
    mutationFn: async () => {
      const loginData = await loginRequest(username, password);
      sessionStorage.setItem("access_token", loginData.access_token);

      const role = loginData.role.toUpperCase();
      sessionStorage.setItem("role", role);

      // Fetch full user info only for backend-supported roles
      let user: MeResponse;
      if (["JE", "SDO", "CM"].includes(role)) {
        user = await getMeRequest();
      } else {
        // For GM or others, create minimal user object
        user = {
          id: "",
          name: "GM User",
          email: "",
          phone: "",
          role,
          division: "",
          status: "active",
        };
      }

      sessionStorage.setItem("user", JSON.stringify(user));
      return user;
    },
    onSuccess: (user: MeResponse) => {
      const role = user.role.toUpperCase();
      if (role === "GM") navigate("/admin");
      else if (role === "JE") navigate("/je/dashboard");
      else if (role === "SDO") navigate("/sdo/dashboard");
      else if (role === "CM") navigate("/complaint/manager");
      else navigate("/login");
    },
    onError: (err: any) => {
      console.error("Admin login failed:", err);
      alert(err.response?.data?.detail || "Login failed. Check username/password");
    },
  });




  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="backgroundvideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>

      {/* Main Content */}
      <div className="relative z-20 w-full max-w-md space-y-6">
        <Link
          to="/"
          className="flex items-center text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center">
          <div className="government-gradient p-3 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Eazz Grievance</h1>
          <p className="text-muted-foreground">Secure Login Portal</p>
        </div>

        <Tabs defaultValue="citizen" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="citizen">Citizen Login</TabsTrigger>
            <TabsTrigger value="admin">Admin Login</TabsTrigger>
          </TabsList>

          {/* Citizen Login */}
          <TabsContent value="citizen">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  OTP Login
                </CardTitle>
                <CardDescription>
                  Enter your registered mobile number to receive OTP
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!otpSent ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Mobile Number</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                          +91
                        </span>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter 10-digit mobile number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="rounded-l-none"
                          maxLength={10}
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => sendOtpMutation.mutate()}
                      className="w-full"
                      disabled={
                        phoneNumber.length !== 10 || sendOtpMutation.isPending
                      }
                    >
                      {sendOtpMutation.isPending ? "Sending OTP..." : "Send OTP"}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
                      <p className="text-success font-medium">
                        OTP sent to +91 {phoneNumber}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Please enter the 6-digit code
                      </p>
                      {otpDebug && (
                        <p className="text-xs text-muted-foreground mt-1">
                          (Dev OTP: {otpDebug})
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        className="text-center text-lg tracking-wider"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => verifyOtpMutation.mutate()}
                        className="flex-1"
                        disabled={
                          otp.length !== 6 || verifyOtpMutation.isPending
                        }
                      >
                        {verifyOtpMutation.isPending
                          ? "Verifying..."
                          : "Verify & Login"}
                      </Button>
                      <Button variant="outline" onClick={() => setOtpSent(false)}>
                        Change Number
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full text-sm"
                      onClick={() => sendOtpMutation.mutate()}
                    >
                      {sendOtpMutation.isPending
                        ? "Resending..."
                        : "Didn't receive OTP? Resend"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Login */}
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Admin Access
                </CardTitle>
                <CardDescription>Authorized personnel only</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter admin username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full flex items-center justify-center"
                  onClick={() => adminLoginMutation.mutate()}
                  disabled={
                    !username || !password || adminLoginMutation.isPending
                  }
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {adminLoginMutation.isPending
                    ? "Logging in..."
                    : "Login to Dashboard"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-muted-foreground">
          <p>Need help? Contact support at</p>
          <p className="text-primary font-medium">1800-XXX-XXXX</p>
        </div>
      </div>
    </div>
  );

};

export default Login;
