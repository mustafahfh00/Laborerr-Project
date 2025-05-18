// src/components/become-laborer-button.tsx
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function BecomeLaborerButton() {
  return (
    <Link href="/become-laborer">
      <Button variant="default" className="ml-4 bg-blue-600 hover:bg-blue-700">
        Become a Laborer
      </Button>
    </Link>
  );
}