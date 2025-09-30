import { Button } from "./components/ui/button";
import HelloWorld from "./components/HelloWorld";

export default function App() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
        <h1 className="text-3xl font-bold mb-2">Let’s Travel — Starter</h1>
        <p className="text-muted-foreground mb-4">
          <HelloWorld /> 👋
        </p>
        <div className="flex gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>
      </div>
    </main>
  );
}