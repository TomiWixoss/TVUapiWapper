import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  SnackbarProvider,
  ZMPRouter,
} from "zmp-ui";
import { Toaster } from "sonner";
import { useEffect } from "react";

// TVU Pages
import TvuLoginPage from "../pages/tvu-login";
import TvuDashboard from "../pages/tvu";
import TvuProfilePage from "../pages/tvu-profile";
import TvuSchedulePage from "../pages/tvu-schedule";
import TvuGradesPage from "../pages/tvu-grades";
import TvuTuitionPage from "../pages/tvu-tuition";
import TvuCurriculumPage from "../pages/tvu-curriculum";
import TvuNotificationsPage from "../pages/tvu-notifications";
import TvuSettingsPage from "../pages/tvu-settings";

import { BottomNav } from "./bottom-nav";
import { useThemeStore } from "@/stores/theme-store";

const Layout = () => {
  const systemInfo = getSystemInfo();
  const zaloTheme = systemInfo.zaloTheme as "dark" | "light" | undefined;
  const { theme, setTheme } = useThemeStore();

  // Sync with Zalo theme on first load if not set
  useEffect(() => {
    if (zaloTheme && !localStorage.getItem("tvu-theme")) {
      setTheme(zaloTheme);
    }
  }, [zaloTheme, setTheme]);

  return (
    <App theme={theme}>
      {/* @ts-expect-error zmp-ui types issue */}
      <SnackbarProvider>
        <ZMPRouter>
          <AnimationRoutes>
            <Route path="/" element={<TvuLoginPage />} />
            <Route path="/tvu-login" element={<TvuLoginPage />} />
            <Route path="/tvu" element={<TvuDashboard />} />
            <Route path="/tvu-profile" element={<TvuProfilePage />} />
            <Route path="/tvu-schedule" element={<TvuSchedulePage />} />
            <Route path="/tvu-grades" element={<TvuGradesPage />} />
            <Route path="/tvu-tuition" element={<TvuTuitionPage />} />
            <Route path="/tvu-curriculum" element={<TvuCurriculumPage />} />
            <Route
              path="/tvu-notifications"
              element={<TvuNotificationsPage />}
            />
            <Route path="/tvu-settings" element={<TvuSettingsPage />} />
          </AnimationRoutes>
          <BottomNav />
        </ZMPRouter>
      </SnackbarProvider>
      <Toaster position="top-center" richColors />
    </App>
  );
};

export default Layout;
