import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PriceRangeProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  onApply?: (value: [number, number]) => void;
}

export function PriceRange({
  min = 0,
  max = 100,
  step = 1,
  defaultValue = [min, max],
  onValueChange,
  onApply
}: PriceRangeProps) {
  const [range, setRange] = useState<[number, number]>(defaultValue);

  const handleSliderChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setRange(newRange);
    onValueChange?.(newRange);
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) return;
    
    const newRange: [number, number] = [Math.max(min, Math.min(value, range[1])), range[1]];
    setRange(newRange);
    onValueChange?.(newRange);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) return;
    
    const newRange: [number, number] = [range[0], Math.min(max, Math.max(value, range[0]))];
    setRange(newRange);
    onValueChange?.(newRange);
  };

  const handleApply = () => {
    onApply?.(range);
  };

  return (
    <div className="space-y-4">
      <Slider
        defaultValue={range}
        min={min}
        max={max}
        step={step}
        value={range}
        onValueChange={handleSliderChange}
        className="my-6"
      />
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          placeholder="Min"
          value={range[0]}
          onChange={handleMinInputChange}
          min={min}
          max={range[1]}
          className="w-24"
        />
        <span>-</span>
        <Input
          type="number"
          placeholder="Max"
          value={range[1]}
          onChange={handleMaxInputChange}
          min={range[0]}
          max={max}
          className="w-24"
        />
        <Button onClick={handleApply} className="bg-primary text-white">
          Apply
        </Button>
      </div>
    </div>
  );
}
