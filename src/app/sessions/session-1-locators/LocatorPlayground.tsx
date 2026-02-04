"use client";

import { useMemo, useState } from "react";
import { LocatorHint } from "../../../components/types";

type Props = {
  onHoverHint: (hint: LocatorHint | null) => void;
};

const ROWS = [1, 2, 3, 4, 5, 6] as const;
const LEFT_COLS = ["A", "B"] as const;
const RIGHT_COLS = ["C", "D"] as const;

function seatId(row: number, col: string) {
  return `${row}${col}`;
}

export function LocatorPlayground({ onHoverHint }: Props) {
  // Grey seats = taken (not selectable)
  const taken = useMemo(() => new Set<string>(["5C", "5D"]), []);

  // Optional: pre-select seats like the sketch (remove if you want empty by default)
  const [selected, setSelected] = useState<string[]>([]);

  const [movie, setMovie] = useState("Interstellar");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [redeem, setRedeem] = useState("");
  const [agree, setAgree] = useState(false);

  const basePrice = 200; // just a demo value
  const subtotal = selected.length * basePrice;
  const discount = redeem.trim().length > 0 ? Math.min(50, subtotal) : 0; // demo
  const afterDiscount = Math.max(0, subtotal - discount);
  const vat = Math.round(afterDiscount * 0.1);
  const total = afterDiscount + vat;

  const setHover = (hint: LocatorHint | null) => onHoverHint(hint);

  const hintForSeat = (id: string): LocatorHint => ({
    id: `seat-${id}`,
    title: `Seat ${id} (role=button)`,
    purpose: "Seats are interactive buttons. Use stable locators: role + accessible name, or data-testid.",
    selectors: [
      `page.getByRole('button', { name: 'Seat ${id}' })`,
      `page.getByTestId('seat-${id}')`,
      `page.locator('[data-seat="${id}"]')`,
    ],
    actions: ["Click to select/deselect", "Assert aria-pressed toggles", "Ensure taken seats are disabled"],
    docsUrl: "https://playwright.dev/docs/locators#locate-by-role",
    target: ""
  });

  const toggleSeat = (id: string) => {
    if (taken.has(id)) return;

    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const bindSeatHover = (id: string) => ({
    onMouseEnter: () => setHover(hintForSeat(id)),
    onMouseLeave: () => setHover(null),
  });

  return (
    <section className="panel panelSticky">
      <div className="panelHeader">
        <h1 className="h1">Session 1 — Locator Finding</h1>
        <p className="small">
          Practice locating seats using <b>role</b>, <b>label</b>, and <b>test id</b>.
          Gray seats are taken.
        </p>
      </div>

      <div className="panelBody stack">
        {/* Practice 1: Seat booking */}
        <div className="card stack">
          <div style={{ fontWeight: 700, fontSize: 18 }}>Seat Booking Practice</div>
          <div className="small">
            Goal: click seats to select/deselect → selected seats appear in the list.
            Taken seats are disabled.
          </div>

          <div className="seatLayout">
            {/* LEFT: seat map */}
            <div className="seatMapCard">
              <div className="seatScreen" aria-hidden="true">
                Screen
              </div>

              <div className="seatGridWrap">
                {/* Column labels */}
                <div className="seatGridHeader">
                  <div className="seatColLabel">A</div>
                  <div className="seatColLabel">B</div>
                  <div className="seatAisleLabel" aria-hidden="true" />
                  <div className="seatColLabel">C</div>
                  <div className="seatColLabel">D</div>
                </div>

                {/* Rows */}
                <div className="seatGrid" role="grid" aria-label="Seat map">
                  {ROWS.map((r) => (
                    <div className="seatRow" role="row" key={r}>
                      <div className="seatRowLabel" aria-hidden="true">
                        {r}
                      </div>

                      {/* A B */}
                      {LEFT_COLS.map((c) => {
                        const id = seatId(r, c);
                        const isTaken = taken.has(id);
                        const isSelected = selected.includes(id);

                        return (
                          <button
                            key={id}
                            type="button"
                            role="button"
                            className={[
                              "seatBtn",
                              isTaken ? "seatTaken" : "",
                              isSelected ? "seatSelected" : "",
                            ].join(" ")}
                            data-testid={`seat-${id}`}
                            data-seat={id}
                            aria-label={`Seat ${id}`}
                            aria-pressed={isSelected}
                            disabled={isTaken}
                            onClick={() => toggleSeat(id)}
                            {...bindSeatHover(id)}
                          />
                        );
                      })}

                      {/* aisle */}
                      <div className="seatAisle" aria-hidden="true" />

                      {/* C D */}
                      {RIGHT_COLS.map((c) => {
                        const id = seatId(r, c);
                        const isTaken = taken.has(id);
                        const isSelected = selected.includes(id);

                        return (
                          <button
                            key={id}
                            type="button"
                            className={[
                              "seatBtn",
                              isTaken ? "seatTaken" : "",
                              isSelected ? "seatSelected" : "",
                            ].join(" ")}
                            data-testid={`seat-${id}`}
                            data-seat={id}
                            aria-label={`Seat ${id}`}
                            aria-pressed={isSelected}
                            disabled={isTaken}
                            onClick={() => toggleSeat(id)}
                            {...bindSeatHover(id)}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div className="seatLegend">
                  <span className="legendItem">
                    <span className="legendDot dotAvailable" /> Available
                  </span>
                  <span className="legendItem">
                    <span className="legendDot dotSelected" /> Selected
                  </span>
                  <span className="legendItem">
                    <span className="legendDot dotTaken" /> Taken
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: booking info (inside practice card) */}
            <div className="bookingCard">
              <div className="stack">
                <div className="grid2">
                  <div className="stack">
                    <label className="small" htmlFor="movie">
                      Movie
                    </label>
                    <select
                      id="movie"
                      className="select"
                      value={movie}
                      data-testid="movie-select"
                      onChange={(e) => setMovie(e.target.value)}
                      onMouseEnter={() =>
                        setHover({
                          id: "movie-select",
                          title: "Movie dropdown (getByLabel / getByTestId)",
                          purpose: "Dropdowns are easy with getByLabel or data-testid.",
                          selectors: [
                            `page.getByLabel('Movie')`,
                            `page.getByTestId('movie-select')`,
                          ],
                          actions: ["Use selectOption()", "Assert selected value"],
                          docsUrl: "https://playwright.dev/docs/input#select-options",
                          target: ""
                        })
                      }
                      onMouseLeave={() => setHover(null)}
                    >
                      <option>Interstellar</option>
                      <option>Inception</option>
                      <option>Dune</option>
                    </select>
                  </div>

                  <div className="stack">
                    <label className="small" htmlFor="date">
                      Date
                    </label>
                    <input
                      id="date"
                      type="date"
                      className="input"
                      value={date}
                      data-testid="date-picker"
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="card" style={{ boxShadow: "none" }}>
                  <div style={{ fontWeight: 650, marginBottom: 8 }}>Seats</div>

                  {selected.length === 0 ? (
                    <div className="small">No seats selected</div>
                  ) : (
                    <ul data-testid="seat-list" style={{ margin: 0, paddingLeft: 18 }}>
                      {[...selected].sort().map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="stack">
                  <label className="small" htmlFor="redeem">
                    Redeem
                  </label>
                  <input
                    id="redeem"
                    className="input"
                    placeholder="e.g. SAVE50"
                    value={redeem}
                    data-testid="redeem-input"
                    onChange={(e) => setRedeem(e.target.value)}
                  />
                </div>

                <div className="card" style={{ boxShadow: "none" }}>
                  <div className="rowLine">
                    <span className="small">Discount</span>
                    <strong data-testid="discount-label">{discount}</strong>
                  </div>
                  <div className="rowLine">
                    <span className="small">VAT (10%)</span>
                    <strong data-testid="vat-label">{vat}</strong>
                  </div>
                  <div className="rowLine">
                    <span className="small">Total</span>
                    <strong data-testid="total-label">{total}</strong>
                  </div>
                </div>

                <label className="agreeRow">
                  <input
                    type="checkbox"
                    checked={agree}
                    data-testid="agree-checkbox"
                    onChange={(e) => setAgree(e.target.checked)}
                  />
                  <span>I agree</span>
                </label>

                <button
                  className="btn btnPrimary"
                  type="button"
                  data-testid="confirm-button"
                  disabled={!agree || selected.length === 0}
                  title={!agree || selected.length === 0 ? "Select seats and agree to continue" : "Confirm booking"}
                >
                  Confirm
                </button>

                <div className="small">
                  Confirm is enabled when you selected ≥ 1 seat and checked “I agree”.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* You can keep other practice blocks below if you want */}
      </div>
    </section>
  );
}
