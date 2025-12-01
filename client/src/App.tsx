import { Switch, Route } from "wouter";
import LandingPage from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import HistoryPage from "@/pages/history";
import ModelsPage from "@/pages/models";
import ReportsPage from "@/pages/reports";
import NetworkPage from "@/pages/network";
import SettingsPage from "@/pages/settings";
import NotFound from "@/pages/not-found";
import { Toaster } from "@/components/ui/toaster";
import { FilterProvider } from "@/lib/filter-context";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      
      {/* FDC Module Routes */}
      <Route path="/fdc" component={Dashboard} />
      <Route path="/fdc/history" component={HistoryPage} />
      <Route path="/fdc/models" component={ModelsPage} />
      <Route path="/fdc/reports" component={ReportsPage} />
      <Route path="/fdc/network" component={NetworkPage} />
      <Route path="/fdc/settings" component={SettingsPage} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <FilterProvider>
      <Router />
      <Toaster />
    </FilterProvider>
  );
}

export default App;
