import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import LandingPage from "@/pages/landing";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import HistoryPage from "@/pages/history";
import ModelsPage from "@/pages/models";
import ReportsPage from "@/pages/reports";
import NetworkPage from "@/pages/network";
import SettingsPage from "@/pages/settings";
import NotFound from "@/pages/not-found";
import { Toaster } from "@/components/ui/toaster";
import { FilterProvider } from "@/lib/filter-context";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      
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
  const [location] = useHashLocation();
  
  return (
    <FilterProvider>
      <WouterRouter hook={useHashLocation}>
        <AppRouter />
        <Toaster />
      </WouterRouter>
    </FilterProvider>
  );
}

export default App;
