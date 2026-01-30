export default function HomeContent() {
    return (
      
<section className="panel panelSticky">
    {/* <div className="space-y-6"> */}
      {/* Header block (same tone as session header) */}
      <div className="panelHeader">
        <h1 className="h1">
          🎭 Playwright Playground
        </h1>
        <p className="small">
          Learn Playwright by interacting with real UI patterns.
        </p>
      </div>

      {/* Main card – mirrors “Seat Booking Practice” container */}
      <div className="panelBody stack">
          {/* Intro */}
          <div>
            <h2 className="h2">What is this?</h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              This is a static playground for Playwright beginners.  
              Each session provides a small UI (like a real app) so you can
              practice writing locators, actions, and assertions in a realistic way.
            </p>
          </div>

          {/* Two-column blocks (same visual weight as practice panels) */}
            <div className="rounded-2xl border bg-slate-50 p-5">
              <h3 className="text-sm font-semibold text-slate-900">
                What you’ll practice
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                <li>
                  <span className="font-semibold">Locators:</span>{" "}
                  role, label, test id, text, CSS, filtering
                </li>
                <li>
                  <span className="font-semibold">Actions:</span>{" "}
                  click, hover, fill, type, press, select
                </li>
                <li>
                  <span className="font-semibold">Assertions:</span>{" "}
                  visibility, text, value, count, enabled/disabled
                </li>
                <li>
                  <span className="font-semibold">Patterns:</span>{" "}
                  stable selectors, reusable helpers, POM basics
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-5">
              <h3 className="text-sm font-semibold text-slate-900">
                How to use this playground
              </h3>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
                <li>Select a session from the left sidebar</li>
                <li>Interact with the UI in the center panel</li>
                <li>Hover elements to inspect locator hints</li>
                <li>Translate what you see into Playwright code</li>
              </ol>
            </div>

          
        </div>
                
    {/* </div> */}
        
</section>
  );
}
