// Data for the "Order the steps" practice.
//
// `steps` is always in the CORRECT order (index 0 = first step). Grading simply
// checks that the step placed at position i is the step whose correct index is i.
//
// `shuffled` is a FIXED, pre-computed permutation of the step indices used to
// render the chips. We keep it in data (never Math.random in render) so the
// chip order is stable across renders and server/client hydration matches.

export type Scenario = {
  id: string;
  label: string; // shown in the <select>
  emoji: string;
  title: string; // scenario headline
  intro: string; // one-line real-world context
  steps: string[]; // correct order
  shuffled: number[]; // fixed shuffled indices into `steps`
};

export const SCENARIOS: Scenario[] = [
  {
    id: "atm",
    label: "🏧 Withdraw cash from an ATM",
    emoji: "🏧",
    title: "Withdraw cash from an ATM",
    intro: "You walk up to a cash machine and want $50 in your pocket.",
    steps: [
      "Insert your bank card",
      "Enter your PIN",
      'Select "Withdraw cash"',
      "Choose the amount",
      "Take your card back",
      "Collect the cash",
    ],
    // correct: [0,1,2,3,4,5]
    shuffled: [2, 0, 4, 1, 5, 3],
  },
  {
    id: "login",
    label: "🔐 Log in to a website",
    emoji: "🔐",
    title: "Log in to a website",
    intro: "You open your favourite site and want to reach your account.",
    steps: [
      "Open the website",
      'Click the "Log in" button',
      "Type your email address",
      "Type your password",
      'Click "Submit"',
      "See your dashboard",
    ],
    shuffled: [1, 3, 0, 5, 2, 4],
  },
  {
    id: "sms",
    label: "💬 Send a text message",
    emoji: "💬",
    title: "Send a text message",
    intro: "You pick up your phone to message a friend.",
    steps: [
      "Unlock your phone",
      "Open the messaging app",
      'Tap "New message"',
      "Choose a contact",
      "Type your message",
      'Tap "Send"',
    ],
    shuffled: [4, 0, 2, 5, 1, 3],
  },
];
