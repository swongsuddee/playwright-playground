import type { ReactNode } from "react";
import type { LocatorHint } from "@/components/types";
import {
  Practice21,
  Practice22,
  Practice23,
  Practice24,
  Practice25,
  Practice26,
  Practice27,
  PracticeUploadFile,
  PracticeDownloadFile,
  PracticeScrollIntoView,
  PracticeColossal,
  PracticeAssertions,
} from "./index";

export type PracticeProps = { onHoverHint: (h: LocatorHint | null) => void };

/** One row of the Session 2 catalog. Add a practice by adding ONE entry here. */
export type PracticeEntry = {
  /** hash key used in the URL, e.g. "2-1" */
  key: string;
  /** sidebar label, e.g. "2.1 Click & Mouse Operations" */
  title: string;
  /** render the practice; adapts components that don't take onHoverHint */
  render: (props: PracticeProps) => ReactNode;
};

/**
 * Single source of truth for Session 2. Drives both the sidebar nav and the
 * hash-based router in basic-operation-practice.tsx. To add a practice:
 * create the component, export it from index.ts, then add one entry below.
 */
export const session2Practices: PracticeEntry[] = [
  { key: "2-1", title: "2.1 Click & Mouse Operations", render: (p) => <Practice21 {...p} /> },
  { key: "2-2", title: "2.2 Text Input & Keyboard", render: (p) => <Practice22 {...p} /> },
  { key: "2-3", title: "2.3 Reading Text & Values", render: () => <Practice23 /> },
  { key: "2-4", title: "2.4 Element State & Visibility", render: () => <Practice24 /> },
  { key: "2-5", title: "2.5 Select, Checkbox, Radio & Dropdown", render: () => <Practice25 /> },
  { key: "2-6", title: "2.6 Date & Time Picker", render: () => <Practice26 /> },
  { key: "2-7", title: "2.7 Toggle Button (Custom UI)", render: () => <Practice27 /> },
  { key: "2-8", title: "2.8 Upload Image", render: () => <PracticeUploadFile /> },
  { key: "2-9", title: "2.9 Download File / Image", render: () => <PracticeDownloadFile /> },
  { key: "2-10", title: "2.10 Scroll Into View", render: () => <PracticeScrollIntoView /> },
  { key: "2-11", title: "2.11 Colossal Carousel", render: () => <PracticeColossal /> },
  { key: "2-12", title: "2.12 Assertions (web-first)", render: (p) => <PracticeAssertions {...p} /> },
];

/** Lightweight nav metadata derived from the catalog (for the Sidebar). */
export const session2Nav = session2Practices.map(({ key, title }) => ({ key, title }));

/** Valid hash keys, e.g. ["2-1", ...]. */
export const session2Keys = session2Practices.map((p) => p.key);

/** First practice key — the default when no/invalid hash is present. */
export const defaultSession2Key = session2Practices[0].key;

/** Look up a practice by key, falling back to the first one. */
export function getSession2Practice(key: string): PracticeEntry {
  return session2Practices.find((p) => p.key === key) ?? session2Practices[0];
}
