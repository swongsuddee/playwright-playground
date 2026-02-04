import { useState, useMemo } from "react";
import { PracticeTitle, CodeBox } from "./PracticeShared";

export function Practice25() {
  const [seatType, setSeatType] = useState("standard");
  const [meal, setMeal] = useState(false);
  const [payment, setPayment] = useState<"card" | "cash">("card");

  // ===== Single custom dropdown =====
  const [countryOpen, setCountryOpen] = useState(false);
  const [country, setCountry] = useState("Thailand");
  const options = useMemo(() => ["Thailand", "Japan", "Nepal", "Russia"], []);

  // ===== Native multiple select =====
  const [languages, setLanguages] = useState<string[]>([]);

  // ===== Custom multiple dropdown (max 3) =====
  const MAX_TAGS = 3;
  const [tagsOpen, setTagsOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const tagOptions = ["QA", "Automation", "Playwright", "API", "Performance"];

  const toggleTag = (tag: string) => {
    setTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      }
      if (prev.length >= MAX_TAGS) {
        return prev;
      }
      return [...prev, tag];
    });
  };

  return (
    <div className="stack" style={{ gap: 12 }}>
      <PracticeTitle
        title="Practice: Select, Checkbox, Radio & Dropdown"
        goal="Goal: change selections and assert value / checked / aria-selected / multiselect limit."
      />

      <div
        className="card"
        style={{
          padding: 12,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        {/* ================= Left ================= */}
        <div className="stack" style={{ gap: 10 }}>
          {/* Single select */}
          <label className="small" htmlFor="seatType">
            Seat type
          </label>
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

          {/* Checkbox */}
          <label
            className="small"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
          >
            <input
              data-testid="checkbox-meal"
              type="checkbox"
              checked={meal}
              onChange={(e) => setMeal(e.target.checked)}
            />
            Add meal
          </label>

          {/* Radio */}
          <div className="small" style={{ fontWeight: 900 }}>
            Payment
          </div>
          <label
            className="small"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
          >
            <input
              data-testid="radio-card"
              type="radio"
              name="payment"
              checked={payment === "card"}
              onChange={() => setPayment("card")}
            />
            Card
          </label>
          <label
            className="small"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
          >
            <input
              data-testid="radio-cash"
              type="radio"
              name="payment"
              checked={payment === "cash"}
              onChange={() => setPayment("cash")}
            />
            Cash
          </label>

          {/* Native multiple select */}
          <div className="small" style={{ fontWeight: 900, marginTop: 6 }}>
            Languages (native multiple)
          </div>
          <select
            multiple
            data-testid="select-languages"
            className="input"
            value={languages}
            onChange={(e) =>
              setLanguages(
                Array.from(e.target.selectedOptions).map((o) => o.value)
              )
            }
            style={{ height: 120 }}
          >
            <option value="js">JavaScript</option>
            <option value="ts">TypeScript</option>
            <option value="python">Python</option>
            <option value="go">Go</option>
          </select>

          {/* Custom single dropdown */}
          <div className="small" style={{ fontWeight: 900, marginTop: 6 }}>
            Country (custom dropdown)
          </div>
          <div className="card" style={{ padding: 12 }}>
            <div
              data-testid="dropdown-country"
              role="button"
              aria-haspopup="listbox"
              aria-expanded={countryOpen}
              onClick={() => setCountryOpen((v) => !v)}
              style={{ fontWeight: 900, cursor: "pointer" }}
            >
              {country} ▾
            </div>

            {countryOpen && (
              <div
                role="listbox"
                data-testid="dropdown-country-list"
                style={{ marginTop: 10 }}
              >
                {options.map((o) => (
                  <div
                    key={o}
                    role="option"
                    aria-selected={o === country}
                    data-testid={`country-${o}`}
                    onClick={() => {
                      setCountry(o);
                      setCountryOpen(false);
                    }}
                    style={{ padding: 8, cursor: "pointer" }}
                  >
                    {o}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Custom multiple dropdown (max 3) */}
          <div className="small" style={{ fontWeight: 900 }}>
            Tags (custom multiple, max 3)
          </div>
          <div className="card" style={{ padding: 12 }}>
            <div
              data-testid="dropdown-tags"
              role="button"
              aria-haspopup="listbox"
              aria-expanded={tagsOpen}
              onClick={() => setTagsOpen((v) => !v)}
              style={{ fontWeight: 900, cursor: "pointer" }}
            >
              {tags.length ? tags.join(", ") : "Select tags"} ▾
            </div>

            <div className="small" style={{ opacity: 0.6 }}>
              Select up to {MAX_TAGS} options
            </div>

            {tagsOpen && (
              <div
                role="listbox"
                aria-multiselectable="true"
                data-testid="dropdown-tags-list"
                style={{ marginTop: 10 }}
              >
                {tagOptions.map((tag) => {
                  const selected = tags.includes(tag);
                  const disabled = !selected && tags.length >= MAX_TAGS;

                  return (
                    <div
                      key={tag}
                      role="option"
                      aria-selected={selected}
                      aria-disabled={disabled}
                      data-testid={`tag-${tag}`}
                      onClick={() => !disabled && toggleTag(tag)}
                      style={{
                        padding: 8,
                        cursor: disabled ? "not-allowed" : "pointer",
                        opacity: disabled ? 0.4 : 1,
                        fontWeight: selected ? 900 : 400,
                      }}
                    >
                      <input type="checkbox" readOnly checked={selected} />{" "}
                      {tag}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ================= Right ================= */}
        <div className="stack" style={{ gap: 10 }}>
          <div className="card" style={{ padding: 12 }}>
            <div className="small">Observed state</div>

            <div className="small">
              seatType:{" "}
              <span data-testid="value-seatType">{seatType}</span>
            </div>

            <div className="small">
              meal:{" "}
              <span data-testid="value-meal">{String(meal)}</span>
            </div>

            <div className="small">
              payment:{" "}
              <span data-testid="value-payment">{payment}</span>
            </div>

            <div className="small">
              country:{" "}
              <span data-testid="value-country">{country}</span>
            </div>

            <div className="small">
              languages:{" "}
              <span data-testid="value-languages">
                {languages.join(", ")}
              </span>
            </div>

            <div className="small">
              tags:{" "}
              <span data-testid="value-tags">{tags.join(", ")}</span>
            </div>
          </div>
        </div>
      </div>

      <CodeBox
        code={`// Native multiple select
await page.getByTestId('select-languages').selectOption(['ts', 'python']);
await expect(page.getByTestId('value-languages')).toHaveText('ts, python');

// Custom multiple dropdown (max 3)
await page.getByTestId('dropdown-tags').click();
await page.getByTestId('tag-QA').click();
await page.getByTestId('tag-Playwright').click();
await page.getByTestId('tag-API').click();

// Exceeding max should have no effect
await page.getByTestId('tag-Performance').click();
await expect(page.getByTestId('value-tags'))
  .toHaveText('QA, Playwright, API');`}
      />
    </div>
  );
}
