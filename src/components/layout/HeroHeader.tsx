import Link from "next/link";

const items = [
  { title: "Locator Finding", href: "/sessions/session-1-locators", tag: "Session 1" },
  { title: "Basic Operations", href: "#", tag: "Session 2" },
  { title: "API Basics", href: "#", tag: "Session 3" },
  { title: "Page Object Model", href: "#", tag: "Session 4" },
  { title: "Custom UI Elements", href: "#", tag: "Advanced" },
];

export function HeroHeader() {
  return (
    <section className="hero ">
      <div className="heroTop">
        <div>
          <h1 className="heroTitle">
            <span className="heroIcon" aria-hidden="true">🎭</span>
            Playwright Playground
          </h1>
          <p className="heroSubtitle">Learn by interacting</p>
        </div>

        {/* <div className="heroActions">
          <Link className="btn btnPrimary" href="/sessions/session-1-locators">
            Start Session 1
          </Link>
          <a className="btn" href="https://playwright.dev/docs/locators" target="_blank" rel="noreferrer">
            Docs
          </a>
        </div> */}
      </div>

      {/* <div className="heroChips" role="list" aria-label="Learning sessions">
        {items.map((it) => (
          <Link key={it.title} href={it.href} className="chip" role="listitem">
            <span className="chipTag">{it.tag}</span>
            <span className="chipTitle">{it.title}</span>
          </Link>
        ))}
      </div> */}
    </section>
  );
}
