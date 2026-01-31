import { useState, useMemo } from "react";
import { PracticeTitle, CodeBox } from "./PracticeShared";

export function Practice25() {
  const [seatType, setSeatType] = useState("standard");
  const [meal, setMeal] = useState(false);
  const [payment, setPayment] = useState<"card" | "cash">("card");

  const [countryOpen, setCountryOpen] = useState(false);
  const [country, setCountry] = useState("Thailand");
  const options = useMemo(() => ["Thailand", "Japan", "Nepal", "Russia"], []);

  return (
    <div className="stack" style={{ gap: 12 }}>
      <PracticeTitle
        title="Practice: Select, Checkbox, Radio & Dropdown"
        goal="Goal: change selections and assert value/checked/aria-selected."
      />

      <div className="card" style={{ padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="stack" style={{ gap: 10 }}>
          <label className="small" htmlFor="seatType">Seat type</label>
          <select
            id="seatType"
            data-testid="select-seat-type"
            className="input"
            value={seatType}
            onChange={(e) => setSeatType(e.target.value)}
          >
            <option value="standard">Standard</option>
            <option value="vip">VIP</option>
            <option value="sofa">Sofa</option>
          </select>

          <label className="small" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              data-testid="checkbox-meal"
              type="checkbox"
              checked={meal}
              onChange={(e) => setMeal(e.target.checked)}
            />
            Add meal
          </label>

          <div className="small" style={{ fontWeight: 900 }}>Payment</div>
          <label className="small" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              data-testid="radio-card"
              type="radio"
              name="payment"
              checked={payment === "card"}
              onChange={() => setPayment("card")}
            />
            Card
          </label>
          <label className="small" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              data-testid="radio-cash"
              type="radio"
              name="payment"
              checked={payment === "cash"}
              onChange={() => setPayment("cash")}
            />
            Cash
          </label>

          <div className="small" style={{ fontWeight: 900, marginTop: 6 }}>Country (custom dropdown)</div>
          <div className="card" style={{ padding: 12 }}>
            <div
              data-testid="dropdown-country"
              role="button"
              aria-haspopup="listbox"
              aria-expanded={countryOpen}
              onClick={() => setCountryOpen((v) => !v)}
              style={{ fontWeight: 900, cursor: "pointer", userSelect: "none" }}
            >
              {country} ▾
            </div>

            {countryOpen ? (
              <div
                data-testid="dropdown-list"
                role="listbox"
                style={{
                  marginTop: 10,
                  borderRadius: 12,
                  border: "1px solid rgba(148,163,184,0.25)",
                  background: "white",
                  overflow: "hidden",
                }}
              >
                {options.map((o) => {
                  const selected = o === country;
                  return (
                    <div
                      key={o}
                      role="option"
                      aria-selected={selected}
                      data-testid={`country-${o}`}
                      onClick={() => {
                        setCountry(o);
                        setCountryOpen(false);
                      }}
                      style={{
                        padding: 10,
                        fontWeight: 900,
                        cursor: "pointer",
                        background: selected ? "rgba(249,115,22,0.10)" : "transparent",
                        color: selected ? "#9a3412" : "#0f172a",
                      }}
                    >
                      {o}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        <div className="stack" style={{ gap: 10 }}>
          <div className="card" style={{ padding: 12 }}>
            <div className="small">Observed state</div>
            <div className="small" style={{ marginTop: 8 }}>
              seatType: <span data-testid="value-seatType" style={{ fontWeight: 900 }}>{seatType}</span>
            </div>
            <div className="small" style={{ marginTop: 8 }}>
              meal: <span data-testid="value-meal" style={{ fontWeight: 900 }}>{meal ? "true" : "false"}</span>
            </div>
            <div className="small" style={{ marginTop: 8 }}>
              payment: <span data-testid="value-payment" style={{ fontWeight: 900 }}>{payment}</span>
            </div>
            <div className="small" style={{ marginTop: 8 }}>
              country: <span data-testid="value-country" style={{ fontWeight: 900 }}>{country}</span>
            </div>
          </div>
        </div>
      </div>

          <CodeBox
            code={`await page.getByTestId('select-seat-type').selectOption('vip');
await expect(page.getByTestId('select-seat-type')).toHaveValue('vip');

await page.getByTestId('checkbox-meal').check();
await expect(page.getByTestId('checkbox-meal')).toBeChecked();

await page.getByTestId('dropdown-country').click();
await page.getByTestId('country-Japan').click();
await expect(page.getByTestId('value-country')).toHaveText('Japan');`}
          />
    </div>
  );
}