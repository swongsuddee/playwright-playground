import { useState, useMemo } from "react";
import { PracticeTitle, CodeBox } from "./PracticeShared";

export function Practice26() {
  const [date, setDate] = useState("2026-01-30");
  const [time, setTime] = useState("14:30");
  const [disablePastDemo, setDisablePastDemo] = useState(false);

  const times = useMemo(() => ["09:00", "10:30", "12:00", "14:30", "18:00"], []);
  const isDisabledTime = (t: string) => disablePastDemo && t < "12:00";

  const combined = `${date} ${time}`;

  return (
    <div className="stack" style={{ gap: 12 }}>
      <PracticeTitle
        title="Practice: Date & Time Picker"
        goal="Goal: set date + time → assert combined date-time. Demo: disable past time options."
      />

      <div className="card" style={{ padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="stack" style={{ gap: 10 }}>
          <label className="small" htmlFor="date">Date</label>
          <input
            id="date"
            data-testid="input-date"
            className="input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <label className="small" htmlFor="time">Time</label>
          <select
            id="time"
            data-testid="select-time"
            className="input"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            {times.map((t) => (
              <option key={t} value={t} disabled={isDisabledTime(t)} data-testid={`time-${t}`}>
                {t} {isDisabledTime(t) ? "(disabled)" : ""}
              </option>
            ))}
          </select>

          <label className="small" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              data-testid="toggle-disable-past"
              type="checkbox"
              checked={disablePastDemo}
              onChange={(e) => setDisablePastDemo(e.target.checked)}
            />
            Disable times before 12:00 (demo)
          </label>

          <div className="card" style={{ padding: 12 }}>
            <div className="small">Combined date-time</div>
            <div data-testid="datetime-value" style={{ fontWeight: 900, fontSize: 18 }}>
              {combined}
            </div>
          </div>
        </div>
      </div>

        <CodeBox
          code={`await page.getByTestId('input-date').fill('2026-02-10');
await page.getByTestId('select-time').selectOption('14:30');
await expect(page.getByTestId('datetime-value')).toContainText('2026-02-10 14:30');

await page.getByTestId('toggle-disable-past').check();
await expect(page.getByTestId('time-09:00')).toBeDisabled();`}
        />
    </div>
  );
}