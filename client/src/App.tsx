import { Switch, Route } from "wouter";
import Dashboard from "@/pages/dashboard";
import HistoryPage from "@/pages/history";
import ModelsPage from "@/pages/models";
import ReportsPage from "@/pages/reports";
import NetworkPage from "@/pages/network";
import SettingsPage from "@/pages/settings";
import NotFound from "@/pages/not-found";
import { Toaster } from "@/components/ui/toaster";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/history" component={HistoryPage} />
      <Route path="/models" component={ModelsPage} />
      <Route path="/reports" component={ReportsPage} />
      <Route path="/network" component={NetworkPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
