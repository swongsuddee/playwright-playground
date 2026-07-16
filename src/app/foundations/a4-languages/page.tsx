"use client";

import Link from "next/link";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { LangTabs } from "./LangTabs";
import { Visualizer } from "./Visualizer";
import { LANGS, PROGRAMS, type Lang } from "./languageData";

export default function A4LanguagesPage() {
  const [lang, setLang] = useState<Lang>("python");
  const activeLabel = LANGS.find((l) => l.key === lang)?.label ?? "";

  return (
    <main className="container">
      <Sidebar />

      <section className="panel">
        <div className="panelHeader">
          <div className="small" style={{ fontWeight: 700, color: "var(--accent-text)", margin: 0 }}>
            Track A · Foundations
          </div>
          <h1 className="h1" style={{ marginTop: 6 }}>
            A4 — Programming Languages
          </h1>
          <p className="small">The same logic, written in different languages — see it run step by step.</p>
        </div>

        <div className="panelBody stack" style={{ gap: 18 }}>
          {/* 1. Intro */}
          <div className="card stack" style={{ gap: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Code is just precise, ordered steps</div>
            <p className="small" style={{ margin: 0, maxWidth: "72ch" }}>
              A program is a list of exact instructions the computer follows in order. A <b>programming language</b> is
              simply the words and punctuation you write those instructions in. Switch languages and the same idea looks
              a little different — but the building blocks (variables, loops, and if/else) are always there.
            </p>
            <p className="small" style={{ margin: 0, maxWidth: "72ch" }}>
              Playwright — the tool you will automate with — supports <b>TypeScript / JavaScript</b> (recommended),{" "}
              <b>Python</b>, <b>Java</b>, and <b>.NET</b>. This playground is written in <b>TypeScript</b>, and{" "}
              <b>Python</b> is a great first language to learn the ideas.
            </p>
          </div>

          {/* 2. Same program, three languages */}
          <div className="card stack" style={{ gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>The same program in three languages</div>
              <p className="small" style={{ margin: "4px 0 0", maxWidth: "72ch" }}>
                Each version does exactly the same thing: loop over the numbers 1 to 5, print whether each is even or
                odd, keep a running total, then print <code className="kbd">total = 15</code>. Compare the syntax —
                notice how the loop and the if/else show up in every one.
              </p>
            </div>

            <LangTabs lang={lang} setLang={setLang} idPrefix="prog" />

            <div
              role="tabpanel"
              aria-label={`${activeLabel} program`}
              className="stack"
              style={{ gap: 6, minWidth: 0 }}
            >
              <div className="small" style={{ margin: 0, fontWeight: 600, color: "var(--accent-text)" }}>
                {activeLabel}
              </div>
              <pre className="code codeWrap" data-testid="a4-program" style={{ margin: 0 }}>
                {PROGRAMS[lang].join("\n")}
              </pre>
            </div>
          </div>

          {/* 3. Step-through visualizer */}
          <Visualizer lang={lang} setLang={setLang} />

          {/* 4. Which language? */}
          <div
            className="card stack"
            style={{ gap: 8, background: "var(--accent-soft)", borderColor: "var(--accent-border)" }}
          >
            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--accent-text)" }}>Which language should I use?</div>
            <p className="small" style={{ margin: 0, color: "var(--text)", maxWidth: "72ch" }}>
              For <b>Playwright automation</b> here, use <b>TypeScript</b> — it is the recommended, best-supported
              choice and the one this playground uses. If you are brand new to programming, learn the ideas in{" "}
              <b>Python</b> first: the syntax is light, so you can focus on loops, conditions, and variables. Once those
              click, the same concepts carry straight over to TypeScript.
            </p>
          </div>
        </div>
      </section>

      {/* Aside — quick reference */}
      <aside className="panel inspector panelSticky noScrollBar" style={{ overflowY: "auto" }}>
        <div className="panelHeader">
          <h2 className="h1">Quick reference</h2>
          <p className="small">Same logic, different syntax.</p>
        </div>

        <div className="panelBody stack">
          <div className="card">
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Takeaways</div>
            <ul className="inspectorList" style={{ fontSize: 13 }}>
              <li>Same logic → different syntax. The idea does not change, only the wording.</li>
              <li>Loops, if/else, and variables exist in every language.</li>
              <li>
                <b>TypeScript</b> is recommended for Playwright; <b>Python</b> is a great first language.
              </li>
            </ul>
          </div>

          <div className="card">
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Playwright languages</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <span className="badge">TypeScript / JS</span>
              <span className="badge">Python</span>
              <span className="badge">Java</span>
              <span className="badge">.NET</span>
            </div>
          </div>

          <div
            className="card"
            style={{ background: "var(--secondary-soft)", borderColor: "var(--secondary-border)" }}
          >
            <div style={{ fontWeight: 700, marginBottom: 6, color: "var(--secondary-text)" }}>Tip</div>
            <p className="small" style={{ margin: 0, color: "var(--text)" }}>
              Switch the language tab, then step through with <b>Next</b> — the highlighted line jumps to the matching
              spot in each language, but the variables and output stay identical. That is the whole point: same program,
              different words.
            </p>
          </div>

          <Link className="btn btnPrimary" href="/foundations/a1-code-blocks" style={{ width: "100%" }}>
            ← Back to A3
          </Link>
          <p className="small" style={{ margin: 0, textAlign: "center" }}>
            Foundations complete 🎉
          </p>
        </div>
      </aside>
    </main>
  );
}
