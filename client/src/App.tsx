import { Toaster } from "@/components/ui/toaster";
import { Switch, Route } from "wouter";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <div className="min-h-screen bg-black-100 flex flex-col">
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </div>
  );
}

export default App;
