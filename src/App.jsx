import { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { flatNavItems } from "./data/dashboardData";
import Sidebar from "./components/Sidebar";
import TopHeader from "./components/TopHeader";
import BackgroundGlow from "./components/BackgroundGlow";
import Login from "./components/auth/Login";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import { hasRole, USER_ROLES } from "./utils/authorization";
import { useAuth } from "./context/AuthContext";
import "./App.css";
import RoleRoute from "./components/routing/RoleRoute";
import { ManagerRoute } from "./components/routing/RoleRoute";

const ApplicationGuide = lazy(() => import("./pages/applicationGuide/ApplicationGuide.jsx"));
const ClientsPage = lazy(() => import("./pages/clients/ClientsPage"));
const CustomerTicketPage = lazy(() => import("./pages/tickets/CustomerTicketPage"));
const MeetingsPage = lazy(() => import("./pages/meetings/MeetingsPage"));
const ProjectsPage = lazy(() => import("./pages/projects/ProjectsPage"));
const SlaContractEdit = lazy(() => import("./pages/sla/SlaContractEdit"));
const SlaContractsPage = lazy(() => import("./pages/sla/SlaContractsPage"));
const TasksPage = lazy(() => import("./pages/tasks/TasksPage"));
const TeamPage = lazy(() => import("./pages/team/TeamPage"));
const TicketChatPage = lazy(() => import("./pages/tickets/TicketChatPage"));
const TicketCreatePage = lazy(() => import("./pages/tickets/TicketCreatePage"));
const TicketPage = lazy(() => import("./pages/tickets/TicketPage"));
const UserManagementPage = lazy(() => import("./pages/users/UserManagementPage"));
const UserPermissionsPage = lazy(() => import("./pages/users/UserPermissionsPage"));

function ApplicationLayout() {
  const location = useLocation();

  // جعبه جستجوی هدر مشترک بین همه صفحات است؛ فقط در صفحه تسک‌ها اثر عملی دارد
  const [searchQuery, setSearchQuery] = useState("");

  // منوی موبایل
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    function checkMobile() {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // وقتی سایدبار در موبایل باز است، اسکرول پشت آن قفل شود
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, sidebarOpen]);

  // بستن سایدبار موبایل با کلید Escape
  useEffect(() => {
    if (!isMobile || !sidebarOpen) return;
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobile, sidebarOpen]);

  // عنوان صفحه و بردکرامب بر اساس مسیر فعلی از داده‌های منو استخراج می‌شود
  const isSlaEditPage = /^\/sla-contracts\/[^/]+\/edit$/.test(
    location.pathname,
  );
  const currentNavItem = flatNavItems.find(
    (item) => item.path === location.pathname,
  );
  const pageTitle =
    location.pathname === "/tasks"
      ? "مانیتورینگ تسک‌ها"
      : isSlaEditPage
        ? "ویرایش قرارداد SLA"
        : location.pathname === "/tickets/new"
          ? "ایجاد تیکت"
          : (currentNavItem?.label ?? "");
  const breadcrumbLabel = isSlaEditPage
    ? "قراردادهای SLA"
    : location.pathname === "/tickets/new"
      ? "تیکت‌ها"
      : (currentNavItem?.label ?? "");

  return (
    <>
      <BackgroundGlow />

      <Sidebar
        isOpen={sidebarOpen}
        onNavigate={() => isMobile && setSidebarOpen(false)}
      />

      {isMobile && sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <main className="main-content">
        <TopHeader
          pageTitle={pageTitle}
          breadcrumbLabel={breadcrumbLabel}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isMobile={isMobile}
          onMenuToggleClick={() => setSidebarOpen((open) => !open)}
        />

        <Suspense fallback={<div className="page-loading">در حال بارگذاری...</div>}>
          <Routes>
          <Route index element={<Navigate to="/tickets" replace />} />
          <Route
            path="tasks"
            element={
              <RoleRoute roles={[USER_ROLES.TEAM_MEMBER, USER_ROLES.TEAM_MANAGER]} permission="TASK_READ">
                <TasksPage searchQuery={searchQuery} />
              </RoleRoute>
            }
          />
          <Route
            path="tickets"
            element={
              <RoleRoute roles={Object.values(USER_ROLES)} permission="TICKET_READ">
                <TicketPageRouter />
              </RoleRoute>
            }
          />
          <Route
            path="tickets/new"
            element={
              <RoleRoute roles={Object.values(USER_ROLES)} permission="TICKET_CREATE">
                <TicketCreatePage />
              </RoleRoute>
            }
          />
          <Route
            path="sla-contracts"
            element={
              <ManagerRoute>
                <SlaContractsPage />
              </ManagerRoute>
            }
          />
          <Route
            path="sla-contracts/:contractId/edit"
            element={
              <ManagerRoute>
                <SlaContractEdit />
              </ManagerRoute>
            }
          />
          <Route
            path="projects"
            element={
              <ManagerRoute>
                <ProjectsPage />
              </ManagerRoute>
            }
          />
          <Route
            path="meetings"
            element={
              <RoleRoute
                roles={[USER_ROLES.TEAM_MANAGER, USER_ROLES.TEAM_MEMBER]}
                permission="MEETING_READ"
              >
                <MeetingsPage searchQuery={searchQuery} />
              </RoleRoute>
            }
          />
          <Route
            path="reports"
            element={
              <RoleRoute
                roles={[USER_ROLES.TEAM_MANAGER, USER_ROLES.TEAM_MEMBER]}
              >
                <TicketChatPage />
              </RoleRoute>
            }
          />
          <Route
            path="team"
            element={
              <ManagerRoute>
                <TeamPage />
              </ManagerRoute>
            }
          />
          <Route
            path="clients"
            element={
              <ManagerRoute>
                <ClientsPage />
              </ManagerRoute>
            }
          />
          <Route
            path="applicationGuide"
            element={
              <ManagerRoute>
                <ApplicationGuide />
              </ManagerRoute>
            }
          />
          <Route
            path="users"
            element={
              <RoleRoute roles={[USER_ROLES.TEAM_MANAGER]} permission="USER_READ">
                <UserManagementPage />
              </RoleRoute>
            }
          />
          <Route
            path="user-permissions"
            element={
              <ManagerRoute>
                <UserPermissionsPage />
              </ManagerRoute>
            }
          />
          <Route path="*" element={<Navigate to="/tickets" replace />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <ApplicationLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
function TicketPageRouter() {
  const { auth } = useAuth();
  return hasRole(auth, USER_ROLES.CUSTOMER) ? (
    <CustomerTicketPage />
  ) : (
    <TicketPage />
  );
}
