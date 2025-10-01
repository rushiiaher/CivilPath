import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ExamDetail from "./pages/ExamDetail";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminExams from "./pages/admin/AdminExams";
import AdminResources from "./pages/admin/AdminResources";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminExamInfo from "./pages/admin/AdminExamInfo";
import AdminStages from "./pages/admin/AdminStages";
import AdminSubjects from "./pages/admin/AdminSubjects";
import AdminSyllabus from "./pages/admin/AdminSyllabus";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="exams/:examId" element={<ExamDetail />} />
            <Route path="blog" element={<Blog />} />
            <Route path="contact" element={<Contact />} />
          </Route>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/exams" element={<ProtectedRoute><AdminExams /></ProtectedRoute>} />
          <Route path="/admin/resources" element={<ProtectedRoute><AdminResources /></ProtectedRoute>} />
          <Route path="/admin/blog" element={<ProtectedRoute><AdminBlog /></ProtectedRoute>} />
          <Route path="/admin/exam-info" element={<ProtectedRoute><AdminExamInfo /></ProtectedRoute>} />
          <Route path="/admin/stages" element={<ProtectedRoute><AdminStages /></ProtectedRoute>} />
          <Route path="/admin/subjects" element={<ProtectedRoute><AdminSubjects /></ProtectedRoute>} />
          <Route path="/admin/syllabus" element={<ProtectedRoute><AdminSyllabus /></ProtectedRoute>} />


          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
