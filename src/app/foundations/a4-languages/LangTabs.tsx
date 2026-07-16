"use client";

import { LANGS, type Lang } from "./languageData";

// A small, accessible language-tab switcher. Shared by the "same program" card
// and the visualizer so both always show the same language.
export function LangTabs({
  lang,
  setLang,
  idPrefix,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  idPrefix: string;
}) {
  return (
    <div
      role="tablist"
      aria-label="Programming language"
      className="scrollX"
      style={{ display: "flex", gap: 8, padding: 2 }}
    >
      {LANGS.map((l) => {
        const active = l.key === lang;
        return (
          <button
            key={l.key}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${l.key}`}
            aria-selected={active}
            data-testid={`${idPrefix}-lang-${l.key}`}
            className="btn"
            onClick={() => setLang(l.key)}
            style={{
              flex: "0 0 auto",
              padding: "8px 14px",
              fontWeight: 600,
              background: active ? "var(--accent-soft)" : "var(--surface)",
              borderColor: active ? "var(--accent-border)" : "var(--border-strong)",
              color: active ? "var(--accent-text)" : "var(--text)",
              boxShadow: active ? "none" : "var(--shadow-sm)",
            }}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
