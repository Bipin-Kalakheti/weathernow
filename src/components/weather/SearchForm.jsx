"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchForm({ city, setCity, handleSubmit, isLoading }) {
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <Input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name..."
        className="w-full"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </form>
  );
}
