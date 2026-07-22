import type { MeterDevice, TimeScale } from "../api/types";
import { MeterPanel } from "./MeterPanel";

interface MeterGridProps {
  meters: MeterDevice[];
  timeScale: TimeScale;
}

export function MeterGrid({ meters, timeScale }: MeterGridProps) {
  if (meters.length === 0) {
    return null;
  }

  return (
    <div className="meter-grid">
      {meters.map((meter) => (
        <MeterPanel
          key={meter.device_id}
          meter={meter}
          timeScale={timeScale}
          isStale={false}
        />
      ))}
    </div>
  );
}
