import { useState } from "react";
import { CodeBox, PracticeTitle } from "./PracticeShared";

export function PracticeDownloadFile() {
  const [last, setLast] = useState<string>("—");

  const download = () => {
    const content = `Ticket generated at: ${new Date().toISOString()}\nRef: PW-PLAYGROUND\n`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ticket.txt";
    a.click();
    URL.revokeObjectURL(url);
    setLast("ticket.txt");
  };

  return (
    <div className="stack" style={{ gap: 12 }}>
      <PracticeTitle
        title="Practice: Download File / Image"
        goal="Goal: trigger download and assert filename + file exists."
      />

      <div className="card" style={{ padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="stack" style={{ gap: 10 }}>
          <button data-testid="btn-download" className="btnPrimary" onClick={download}>
            Download ticket
          </button>

          <div className="card" style={{ padding: 12 }}>
            <div className="small">Last downloaded</div>
            <div data-testid="last-downloaded" style={{ fontWeight: 900 }}>
              {last}
            </div>
          </div>
        </div>
      </div>

        <CodeBox
          code={`const downloadPromise = page.waitForEvent('download');
await page.getByTestId('btn-download').click();
const download = await downloadPromise;

expect(download.suggestedFilename()).toBe('ticket.txt');
await download.saveAs('downloads/ticket.txt');
// then assert file exists & size > 0`}
        />
    </div>
  );
}