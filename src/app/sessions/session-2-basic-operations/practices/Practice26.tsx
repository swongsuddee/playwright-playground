import { useEffect, useMemo, useState } from "react";
import { PracticeTitle, CodeBox } from "./PracticeShared";

export function Practice26() {
  /* -------------------- shared state -------------------- */
  const [useCustomPicker, setUseCustomPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2026-02-10");
  const [prevDate, setPrevDate] = useState("2026-02-10");
  const [dateError, setDateError] = useState("");

  /* -------------------- native date picker logic -------------------- */
  const isWeekendISO = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(y, m - 1, d, 12);
    const day = dt.getDay(); // 0=Sun, 6=Sat
    return day === 0 || day === 6;
  };

  const handleNativeDateChange = (next: string) => {
    if (isWeekendISO(next)) {
      setDateError("Weekend is disabled. Please select Mon–Fri.");
      setSelectedDate(prevDate); // revert
      return;
    }

    setDateError("");
    setPrevDate(next);
    setSelectedDate(next);
  };

  /* -------------------- custom calendar logic -------------------- */
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(1); // Feb

  const monthLabel = useMemo(() => {
    return new Date(viewYear, viewMonth, 1, 12).toLocaleString(undefined, {
      month: "long",
      year: "numeric",
    });
  }, [viewYear, viewMonth]);

  const pad2 = (n: number) => String(n).padStart(2, "0");
  const iso = (y: number, m: number, d: number) => `${y}-${pad2(m + 1)}-${pad2(d)}`;

  const isWeekend = (y: number, m: number, d: number) => {
    const day = new Date(y, m, d, 12).getDay();
    return day === 0 || day === 6;
  };

  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDow = (y: number, m: number) => new Date(y, m, 1, 12).getDay();

  const cells = useMemo(() => {
    const out: Array<{ day: number | null; iso: string | null; disabled: boolean }> = [];
    const dim = daysInMonth(viewYear, viewMonth);
    const start = firstDow(viewYear, viewMonth);

    for (let i = 0; i < start; i++) out.push({ day: null, iso: null, disabled: false });

    for (let d = 1; d <= dim; d++) {
      out.push({
        day: d,
        iso: iso(viewYear, viewMonth, d),
        disabled: isWeekend(viewYear, viewMonth, d),
      });
    }

    while (out.length < 42) out.push({ day: null, iso: null, disabled: false });
    return out;
  }, [viewYear, viewMonth]);

  /* -------------------- render -------------------- */
  return (
    <div className="stack" style={{ gap: 12 }}>
      <PracticeTitle
        title="Practice: Date Picker (Native vs Custom)"
        goal="Compare native date input vs custom calendar. Weekend dates are disabled in both."
      />

      <label className="small" style={{ display: "flex", gap: 10 }}>
        <input
          type="checkbox"
          data-testid="toggle-custom-picker"
          checked={useCustomPicker}
          onChange={(e) => setUseCustomPicker(e.target.checked)}
        />
        Use custom date picker
      </label>

      <div className="card" style={{ padding: 12 }}>
        {!useCustomPicker ? (
          /* ---------------- native picker ---------------- */
          <>
            <label className="small">Native date input</label>
            <input
              type="date"
              className="input"
              data-testid="input-date"
              value={selectedDate}
              onChange={(e) => handleNativeDateChange(e.target.value)}
            />

            {dateError && (
              <div
                data-testid="date-error"
                style={{
                  marginTop: 8,
                  padding: 10,
                  borderRadius: 8,
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  fontWeight: 600,
                }}
              >
                {dateError}
              </div>
            )}
          </>
        ) : (
          /* ---------------- custom picker ---------------- */
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <button data-testid="cal-prev" onClick={() => setViewMonth(viewMonth - 1)}>←</button>
              <strong data-testid="cal-month">{monthLabel}</strong>
              <button data-testid="cal-next" onClick={() => setViewMonth(viewMonth + 1)}>→</button>
            </div>

            <div
              role="grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}
            >
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="small" style={{ textAlign: "center", fontWeight: 700 }}>
                  {d}
                </div>
              ))}

              {cells.map((c, i) =>
                c.day ? (
                  <button
                    key={c.iso}
                    data-testid={`day-${c.iso}`}
                    disabled={c.disabled}
                    aria-disabled={c.disabled}
                    onClick={() => setSelectedDate(c.iso!)}
                    style={{
                      height: 36,
                      borderRadius: 8,
                      opacity: c.disabled ? 0.4 : 1,
                      cursor: c.disabled ? "not-allowed" : "pointer",
                      background: selectedDate === c.iso ? "#111827" : "#fff",
                      color: selectedDate === c.iso ? "#fff" : "#111",
                    }}
                  >
                    {c.day}
                  </button>
                ) : (
                  <div key={i} />
                )
              )}
            </div>
          </>
        )}
      </div>

      <div className="card" style={{ padding: 12 }}>
        <div className="small">Selected date</div>
        <div data-testid="selected-date" style={{ fontWeight: 900, fontSize: 18 }}>
          {selectedDate}
        </div>
      </div>

      <CodeBox
        code={`// Switch to custom picker
await page.getByTestId('toggle-custom-picker').check();

// Weekend is truly disabled
await expect(page.getByTestId('day-2026-02-14')).toBeDisabled();

// Select weekday
await page.getByTestId('day-2026-02-10').click();
await expect(page.getByTestId('selected-date')).toHaveText('2026-02-10');

// Back to native picker
await page.getByTestId('toggle-custom-picker').uncheck();
await page.getByTestId('native-date').fill('2026-02-14');
await expect(page.getByTestId('date-error')).toBeVisible();`}
      />
    </div>
  );
}
