import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-12 mt-auto bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          <p className="text-muted-foreground text-center">
            Made by Team De-Cypher with <span className="text-red-500">❤️</span>
          </p>
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/20 transition-all border border-border"
                aria-label={`GitHub profile ${i}`}
              >
                <Github className="h-5 w-5" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}