import Link from "next/link";
import { MiniMascot } from "@/components/art/Characters";
import { SkillTree } from "@/components/SkillTree";

const A1 = "/foundations/a3-decomposition";
const S1 = "/sessions/session-1-locators";
const S2 = "/sessions/session-2-basic-operations";

const FEATURES = [
  { accent: "indigo" as const, title: "Foundations", text: "Start from zero — sequence, loops and conditionals as code blocks in Scratch." },
  { accent: "orange" as const, title: "Locators", text: "Find stable selectors: role, label, test id, text, CSS and XPath." },
  { accent: "coral" as const, title: "Actions", text: "Click, fill, type, select, upload, scroll and drag — on realistic UI." },
  { accent: "sky" as const, title: "Assertions", text: "Web-first, auto-retrying expectations that don’t flake." },
];

export function LandingPage() {
  return (
    <div className="lp">
      {/* Nav */}
      <nav className="lpNav">
        <div className="lpWrap">
          <Link href="/" style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.01em" }}>
            🎭 Playwright Playground
          </Link>
          <div className="lpNavLinks">
            <Link className="lpNavLink" href={A1}>Foundations</Link>
            <Link className="lpNavLink" href={S1}>Web Testing</Link>
          </div>
          <Link className="btn btnPrimary" href={A1}>Start learning</Link>
        </div>
      </nav>

      {/* Hero — the skill path */}
      <header className="lpWrap">
        <div className="lpTreeHead">
          <span className="badge" style={{ background: "var(--secondary-soft)", borderColor: "var(--secondary-border)", color: "var(--secondary-text)" }}>
            For QA engineers · free · in your browser
          </span>
          <h1 className="lpTitle" style={{ marginTop: 14 }}>
            Choose your <span style={{ color: "var(--accent-text)" }}>skill path</span>.
          </h1>
          <p className="lpLede" style={{ margin: "16px auto 0" }}>
            A hands-on skill tree for learning test automation — start at the center, branch into
            foundations and QA, then unlock more as you go. Hover a node to preview it, click to start.
          </p>
        </div>

        <div style={{ marginTop: 28 }}>
          <SkillTree />
        </div>

        <p className="small" style={{ textAlign: "center", marginTop: 14 }}>
          🔒 Front End, Back End and other branches are on the roadmap — the lit paths are playable today.
        </p>
      </header>

      {/* Features */}
      <section className="lpSection">
        <div className="lpWrap">
          <div className="lpSectionHead" data-reveal>
            <h2 className="lpH2">What you’ll practice</h2>
            <p className="small" style={{ fontSize: 14 }}>Four building blocks of automated UI testing — each with interactive, realistic exercises.</p>
          </div>
          <div className="lpFeatureGrid">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="card" data-reveal style={{ textAlign: "center", padding: 22, ["--reveal-delay" as string]: `${i * 80}ms` }}>
                <div style={{ display: "flex", justifyContent: "center" }}><MiniMascot accent={f.accent} size={64} /></div>
                <h3 className="h2" style={{ marginTop: 10, fontSize: 16 }}>{f.title}</h3>
                <p className="small">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lpSection" style={{ paddingTop: 0 }}>
        <div className="lpWrap">
          <div className="lpBand" data-reveal style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, minWidth: 0 }}>
              <div style={{ flex: "0 0 auto" }}><MiniMascot accent="coral" size={72} /></div>
              <div style={{ minWidth: 0 }}>
                <h2 className="lpH2" style={{ fontSize: 24 }}>Ready to write your first test?</h2>
                <p className="small" style={{ fontSize: 14 }}>No setup. Pick a node and start clicking.</p>
              </div>
            </div>
            <Link className="btn btnPrimary" href={A1} style={{ padding: "12px 22px", fontSize: 15 }}>Get started →</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="lpFooter">
        <div className="lpWrap">
          <div className="lpFootGrid">
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>🎭 Playwright Playground</div>
              <p className="small" style={{ maxWidth: "40ch" }}>A free, hands-on playground for QA engineers to learn Playwright and the foundations underneath.</p>
            </div>
            <FooterCol title="Foundations" links={[["A1 — Problem Decomposition", A1]]} />
            <FooterCol title="Sessions" links={[["Locator Finding", S1], ["Basic Operations", S2]]} />
            <FooterCol title="Resources" links={[["Playwright docs", "https://playwright.dev"], ["Scratch", "https://scratch.mit.edu"]]} external />
          </div>
          <div className="small" style={{ paddingBottom: 28, margin: 0 }}>Built as a QA learning playground · light & dark, fully responsive.</div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links, external }: { title: string; links: [string, string][]; external?: boolean }) {
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>{title}</div>
      <div style={{ display: "grid", gap: 8 }}>
        {links.map(([label, href]) =>
          external ? (
            <a key={label} className="lpNavLink" href={href} target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>{label} ↗</a>
          ) : (
            <Link key={label} className="lpNavLink" href={href} style={{ fontSize: 13 }}>{label}</Link>
          ),
        )}
      </div>
    </div>
  );
}
