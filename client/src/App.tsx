import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import FreelancerPage from "@/pages/freelancer-page";
import CategoryPage from "@/pages/category-page";
import NotFound from "@/pages/not-found";
import LaborerPostPage from "@/pages/LaborerPostPage";


function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/freelancer/:id" component={FreelancerPage} />
      <Route path="/category/:id" component={CategoryPage} />
      <Route path="/laborer-post" component={LaborerPostPage} /> 
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
