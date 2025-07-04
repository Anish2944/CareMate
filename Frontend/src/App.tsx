
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DoctorSearch from "./pages/DoctorSearch";
import DoctorProfile from "./pages/DoctorProfile";
import BookAppointment from "./pages/BookAppointment";
import VideoConsultation from "./pages/VideoConsultation";
import Prescriptions from "./pages/Prescriptions";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import AIAssistance from "./pages/AIAssistance";
import { Navigate } from "react-router-dom";

// Layout components
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";

// Context providers
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import Appointments from "./pages/Appointments";
import Success from "./pages/Success";

const queryClient = new QueryClient();

const user = localStorage.getItem("caremate_auth_token") || null;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
              
              {/* Dashboard Routes */}
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/doctors" element={<DoctorSearch />} />
                <Route path="/doctors/:id" element={<DoctorProfile />} />
                <Route path="/book-appointment/:doctorId" element={<BookAppointment />} />
                <Route path="/prescriptions" element={<Prescriptions />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/aiassistance" element={<AIAssistance />} />
                <Route path="/success" element={<Success />} />
                <Route path="/consultation/:appointmentId" element={<VideoConsultation />} />
              </Route>
              
              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
