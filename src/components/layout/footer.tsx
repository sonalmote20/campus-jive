export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Campus Jive. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
