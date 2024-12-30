import { Button } from "@/components/ui/button";

interface TimeRangeSelectorProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

export const TimeRangeSelector = ({
  selectedRange,
  onRangeChange,
}: TimeRangeSelectorProps) => {
  const ranges = [
    { label: "1D", value: "1D" },
    { label: "7D", value: "7D" },
    { label: "30D", value: "30D" },
  ];

  return (
    <div className="flex gap-2">
      {ranges.map((range) => (
        <Button
          key={range.value}
          variant={selectedRange === range.value ? "default" : "outline"}
          size="sm"
          onClick={() => onRangeChange(range.value)}
          className="min-w-[60px]"
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
};