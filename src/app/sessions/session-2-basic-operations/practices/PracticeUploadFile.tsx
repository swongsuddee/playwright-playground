import { useState } from "react";
import { CodeBox, PracticeTitle } from "./PracticeShared";

type PreviewFile = {
  name: string;
  url: string;
};

export function PracticeUploadFile() {
  const [singlePreview, setSinglePreview] = useState<PreviewFile | null>(null);
  const [bulkPreview, setBulkPreview] = useState<PreviewFile[]>([]);

  return (
    <div className="stack" style={{ gap: 12 }}>
      <PracticeTitle
        title="Practice: Upload Image (Single & Bulk)"
        goal="Goal: practice single-file and multi-file upload and assert previews."
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
        {/* ===================== */}
        {/* Single Upload */}
        {/* ===================== */}
        <div className="stack" style={{ gap: 10 }}>
          <div className="small" style={{ fontWeight: 900 }}>
            Single Upload
          </div>

          <input
            data-testid="single-file-input"
            type="file"
            accept="image/*"
            className="input"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              setSinglePreview({
                name: file.name,
                url: URL.createObjectURL(file),
              });
            }}
          />

          {singlePreview ? (
            <div className="card" style={{ padding: 12 }}>
              <div className="small">Preview</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                data-testid="single-img-preview"
                src={singlePreview.url}
                alt="single preview"
                style={{
                  width: "100%",
                  maxHeight: 200,
                  objectFit: "contain",
                  borderRadius: 12,
                }}
              />
              <div
                data-testid="single-file-name"
                className="small"
                style={{ marginTop: 8, fontWeight: 900 }}
              >
                {singlePreview.name}
              </div>
            </div>
          ) : (
            <div className="small">No image selected</div>
          )}
        </div>

        {/* ===================== */}
        {/* Bulk Upload */}
        {/* ===================== */}
        <div className="stack" style={{ gap: 10 }}>
          <div className="small" style={{ fontWeight: 900 }}>
            Bulk Upload
          </div>

          <input
            data-testid="bulk-file-input"
            type="file"
            accept="image/*"
            multiple
            className="input"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              const previews = files.map((file) => ({
                name: file.name,
                url: URL.createObjectURL(file),
              }));
              setBulkPreview(previews);
            }}
          />

          {bulkPreview.length > 0 ? (
            <div className="stack" style={{ gap: 8 }}>
              {bulkPreview.map((file, index) => (
                <div
                  key={index}
                  className="card"
                  style={{ padding: 8 }}
                  data-testid="bulk-item"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    data-testid="bulk-img-preview"
                    src={file.url}
                    alt={`preview-${index}`}
                    style={{
                      width: "100%",
                      maxHeight: 120,
                      objectFit: "contain",
                      borderRadius: 8,
                    }}
                  />
                  <div
                    data-testid="bulk-file-name"
                    className="small"
                    style={{ fontWeight: 900, marginTop: 4 }}
                  >
                    {file.name}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="small">No images selected</div>
          )}
        </div>
      </div>

      {/* ===================== */}
      {/* Playwright Examples */}
      {/* ===================== */}
      <CodeBox
        code={`// Single upload
await page
  .getByTestId('single-file-input')
  .setInputFiles('tests/assets/profile.jpg');

await expect(page.getByTestId('single-img-preview')).toBeVisible();
await expect(page.getByTestId('single-file-name')).toContainText('.jpg');

// Bulk upload
await page
  .getByTestId('bulk-file-input')
  .setInputFiles([
    'tests/assets/profile.jpg',
    'tests/assets/banner.jpg',
  ]);

await expect(page.getByTestId('bulk-item')).toHaveCount(2);
await expect(page.getAllByTestId('bulk-img-preview').first()).toBeVisible();`}
      />
    </div>
  );
}
