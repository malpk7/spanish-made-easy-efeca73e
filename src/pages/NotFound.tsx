import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-spanish-gold/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-spanish-red/10 rounded-full blur-3xl" />
      </div>

      <div className="text-center relative z-10">
        <h1 className="font-display text-8xl md:text-9xl font-bold mb-4">
          <span className="text-spanish-red">4</span>
          <span className="text-spanish-gold">0</span>
          <span className="text-spanish-red">4</span>
        </h1>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
          ¡Página no encontrada!
        </h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          La página que buscas no existe o ha sido movida.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild variant="default" size="lg" className="gap-2">
            <Link to="/">
              <Home size={18} />
              Volver al inicio
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="gap-2" onClick={() => window.history.back()}>
            <ArrowLeft size={18} />
            Volver atrás
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
