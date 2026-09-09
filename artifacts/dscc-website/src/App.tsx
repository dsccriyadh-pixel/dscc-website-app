import { lazy, Suspense, useEffect, useLayoutEffect, useState } from "react";
import { Switch, Route, Router as WouterRouter, useRoute, useLocation } from "wouter";
import { trackVisit } from "@/lib/visitTracker";
import { initEventTracking } from "@/lib/eventTracker";
import { SECRET_FORM_PATH } from "@/data/intakeForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { ScrollReset } from "@/components/layout/ScrollReset";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { MobileQuickActions } from "@/components/layout/MobileQuickActions";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { NewsTicker } from "@/components/layout/NewsTicker";

const Home = lazy(() => import("@/pages/home"));
const About = lazy(() => import("@/pages/about"));
const Services = lazy(() => import("@/pages/services"));
const ServiceDetail = lazy(() => import("@/pages/service-detail"));
const ServiceCity = lazy(() => import("@/pages/service-city"));
const Sectors = lazy(() => import("@/pages/sectors"));
const SectorDetail = lazy(() => import("@/pages/sector-detail"));
const SectorCity = lazy(() => import("@/pages/sector-city"));
const Projects = lazy(() => import("@/pages/projects"));
const ProjectDetail = lazy(() => import("@/pages/project-detail"));
const Clients = lazy(() => import("@/pages/clients"));
const Resources = lazy(() => import("@/pages/resources"));
const ResourceDetail = lazy(() => import("@/pages/resource-detail"));
const Quote = lazy(() => import("@/pages/quote"));
const SuppliersPage = lazy(() => import("@/pages/suppliers"));
const CalculatorPage = lazy(() => import("@/pages/calculator"));
const Contact = lazy(() => import("@/pages/contact"));
const Locations = lazy(() => import("@/pages/locations"));
const LocationPage = lazy(() => import("@/pages/location"));
const ProcessPage = lazy(() => import("@/pages/process"));
const QualityPage = lazy(() => import("@/pages/quality"));
const WarrantyPage = lazy(() => import("@/pages/warranty"));
const SafetyPage = lazy(() => import("@/pages/safety"));
const SustainabilityPage = lazy(() => import("@/pages/sustainability"));
const InsightsPage = lazy(() => import("@/pages/insights"));
const SolutionsPage = lazy(() => import("@/pages/solutions").then(m => ({ default: m.SolutionsIndex })));
const SolutionDetail = lazy(() => import("@/pages/solutions").then(m => ({ default: m.SolutionDetail })));
const InsightDetail = lazy(() => import("@/pages/insight-detail"));
const NewsPage = lazy(() => import("@/pages/news"));
const NewsDetail = lazy(() => import("@/pages/news-detail"));
const FaqPage = lazy(() => import("@/pages/faq"));
const MediaCenter = lazy(() => import("@/pages/media-center"));
const PrivacyPage = lazy(() => import("@/pages/privacy"));
const TermsPage = lazy(() => import("@/pages/terms"));
const NotFound = lazy(() => import("@/pages/not-found"));
const SecretIntakeForm = lazy(() => import("@/pages/secret-intake-form"));
const Chatbot = lazy(() => import("@/components/chatbot/Chatbot").then(m => ({ default: m.Chatbot })));
import { ShowroomInvite } from "@/components/ShowroomInvite";
import { SocialProofToasts } from "@/components/SocialProofToasts";
import { ExitIntent } from "@/components/ExitIntent";
import { ConsentBanner } from "@/components/ConsentBanner";
import { captureAttribution } from "@/lib/attribution";
import { trackGa4PageView } from "@/lib/ga4";
import { initMeta, metaConsentChoicesChanged, trackMetaPageView } from "@/lib/meta";

const queryClient = new QueryClient();

function IndexingPolicyGuard() {
  const [location] = useLocation();
  useLayoutEffect(() => {
    const privateRoute =
      location === "/calculator" ||
      location === "/suppliers" ||
      location === "/supplier-register-dk49rz" ||
      location === SECRET_FORM_PATH;
    if (!privateRoute) return;

    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex, nofollow";
    document.head.querySelector('link[rel="canonical"]')?.remove();
  }, [location]);
  return null;
}

function DeferredChatbot() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const idle = w.requestIdleCallback;
    if (idle) {
      const id = idle(() => setShow(true), { timeout: 4000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = setTimeout(() => setShow(true), 2500);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <Suspense fallback={null}>
      <Chatbot />
    </Suspense>
  );
}

function VisitTracker() {
  const [location] = useLocation();
  useEffect(() => {
    captureAttribution();
    initEventTracking();
    initMeta();
  }, []);
  useEffect(() => {
    trackVisit(location);
    trackGa4PageView(location);
    trackMetaPageView(location);
  }, [location]);
  useEffect(() => {
    const onConsent = () => trackGa4PageView(location);
    window.addEventListener("dscc:analytics-consent-granted", onConsent);
    return () => window.removeEventListener("dscc:analytics-consent-granted", onConsent);
  }, [location]);
  useEffect(() => {
    const onMetaConsent = () => {
      metaConsentChoicesChanged();
      trackMetaPageView(location);
    };
    window.addEventListener("dscc:meta-consent-changed", onMetaConsent);
    return () => window.removeEventListener("dscc:meta-consent-changed", onMetaConsent);
  }, [location]);
  return null;
}

function Router() {
  const [isSecretForm] = useRoute(SECRET_FORM_PATH);
  if (isSecretForm) {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <SecretIntakeForm />
      </Suspense>
    );
  }
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollReset />
      <Header />
      <NewsTicker />
      <main className="flex-1">
        <Suspense fallback={<PageSkeleton />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/services" component={Services} />
            <Route path="/services/:slug/:city" component={ServiceCity} />
            <Route path="/services/:slug" component={ServiceDetail} />
            <Route path="/sectors" component={Sectors} />
            <Route path="/sectors/:slug/:city" component={SectorCity} />
            <Route path="/sectors/:slug" component={SectorDetail} />
            <Route path="/projects" component={Projects} />
            <Route path="/projects/:slug" component={ProjectDetail} />
            <Route path="/clients" component={Clients} />
            <Route path="/resources" component={Resources} />
            <Route path="/resources/:slug" component={ResourceDetail} />
            <Route path="/quote" component={Quote} />
            {/* Secret supplier-registration link — intentionally not linked anywhere on the site */}
            <Route path="/suppliers" component={SuppliersPage} />
            <Route path="/supplier-register-dk49rz" component={SuppliersPage} />
            <Route path="/calculator" component={CalculatorPage} />
            <Route path="/contact" component={Contact} />
            <Route path="/locations" component={Locations} />
            <Route path="/locations/:slug" component={LocationPage} />
            <Route path="/process" component={ProcessPage} />
            <Route path="/quality" component={QualityPage} />
            <Route path="/warranty" component={WarrantyPage} />
            <Route path="/safety" component={SafetyPage} />
            <Route path="/sustainability" component={SustainabilityPage} />
            <Route path="/insights" component={InsightsPage} />
            <Route path="/insights/:slug" component={InsightDetail} />
            <Route path="/solutions" component={SolutionsPage} />
            <Route path="/solutions/:slug" component={SolutionDetail} />
            <Route path="/news" component={NewsPage} />
            <Route path="/news/:slug" component={NewsDetail} />
            <Route path="/media-center" component={MediaCenter} />
            <Route path="/faq" component={FaqPage} />
            <Route path="/privacy" component={PrivacyPage} />
            <Route path="/terms" component={TermsPage} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>
      <Footer />
      <ScrollToTop />
      <DeferredChatbot />
      <ShowroomInvite />
      <SocialProofToasts />
      <ExitIntent />
      <MobileQuickActions />
      <MobileTabBar />
      <div className="lg:hidden h-16" aria-hidden />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <IndexingPolicyGuard />
            <VisitTracker />
            <Router />
          </WouterRouter>
          <Toaster />
          <ConsentBanner />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
