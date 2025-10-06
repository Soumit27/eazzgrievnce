// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Landing from "./pages/Landing";
// import Login from "./pages/Login";
// import CitizenDashboard from "./pages/CitizenDashboard";
// import AdminDashboard from "./pages/AdminDashboard";
// import ComplaintForm from "./pages/ComplaintForm";
// import TrackComplaint from "./pages/TrackComplaint";
// import GMUserManagement from "./pages/GMUserManagement";
// import ComplaintWorkflow from "./pages/ComplaintWorkflow";
// import NotFound from "./pages/NotFound";
// import { ProtectedRoute } from "./routes/ProtectedRoute";
// import JEDashboard from "./pages/JEDashboard";
// import SDODashboard from "./pages/SDODashboard";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Landing />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/dashboard" element={<CitizenDashboard />} />
//           <Route
//             path="/admin"
//             element={
//               <ProtectedRoute>
//                 <AdminDashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="/admin/users" element={<GMUserManagement />} />
//           <Route path="/admin/workflow/:id" element={<ComplaintWorkflow />} />
//           <Route path="/complaint/new" element={<ComplaintForm />} />
//           <Route path="/je/dashboard" element={<JEDashboard />} />
//           <Route path="/sdo/dashboard" element={<SDODashboard />} />
//           <Route path="/track" element={<TrackComplaint />} />
//           {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;



import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import CitizenDashboard from "./pages/CitizenDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ComplaintForm from "./pages/ComplaintForm";
import TrackComplaint from "./pages/TrackComplaint";
import GMUserManagement from "./pages/GMUserManagement";
import ComplaintWorkflow from "./pages/ComplaintWorkflow";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import JEDashboard from "./pages/JEDashboard";
import SDODashboard from "./pages/SDODashboard";
import ComplaintManagerPage from "./pages/ComplaintManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<CitizenDashboard />} />

          {/* GM only routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["GM"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["GM"]}>
                <GMUserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/workflow/:id"
            element={
              <ProtectedRoute allowedRoles={["GM"]}>
                <ComplaintWorkflow />
              </ProtectedRoute>
            }
          />

          {/* JE only dashboard */}
          <Route
            path="/je/dashboard"
            element={
              <ProtectedRoute allowedRoles={["JE"]}>
                <JEDashboard />
              </ProtectedRoute>
            }
          />

          {/* SDO only dashboard */}
          <Route
            path="/sdo/dashboard"
            element={
              <ProtectedRoute allowedRoles={["SDO"]}>
                <SDODashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/complaint/manager" element={<ComplaintManagerPage />} />
          <Route path="/complaint/new" element={<ComplaintForm />} />
          <Route path="/track" element={<TrackComplaint />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>

      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

