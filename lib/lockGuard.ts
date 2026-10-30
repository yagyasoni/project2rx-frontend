import type { HTMLAttributes, KeyboardEvent, SyntheticEvent } from "react";
import { toast } from "sonner";
import { SUBSCRIPTION_ACTION_MESSAGE } from "@/lib/api";

/**
 * Capture-phase guards for the real page UI that sits under a lock overlay.
 *
 * While locked that UI is also `inert`, so normally nothing here ever fires.
 * These handlers are the second line: if someone strips the overlay and the
 * inert attribute in DevTools, every click, key press, form submit and input
 * change is swallowed before it reaches the page's own handlers, and the user
 * gets the subscription toast instead. That covers purely client-side features
 * (Random Generate on Temperature Logs, local filters, downloads) exactly like
 * the features that call the API.
 *
 *   <div className="contents" inert={locked} {...lockGuardProps(locked)}>
 */
type GuardProps = Pick<
  HTMLAttributes<HTMLElement>,
  | "onPointerDownCapture"
  | "onPointerUpCapture"
  | "onMouseDownCapture"
  | "onClickCapture"
  | "onSubmitCapture"
  | "onChangeCapture"
  | "onKeyDownCapture"
>;

const TOAST_ID = "subscription-required";

const INTERACTIVE = [
  "button",
  "a[href]",
  "input",
  "select",
  "textarea",
  "label",
  "summary",
  '[role="button"]',
  '[role="tab"]',
  '[role="menuitem"]',
  '[role="menuitemcheckbox"]',
  '[role="menuitemradio"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="switch"]',
  '[role="option"]',
  '[role="combobox"]',
  '[role="slider"]',
  '[contenteditable="true"]',
].join(", ");

// Keys that only move focus or dismiss things; nothing to lock there.
const PASS_KEYS = new Set(["Tab", "Escape", "Shift", "Control", "Alt", "Meta", "CapsLock"]);

const isInteractive = (target: EventTarget | null): boolean => {
  if (!(target instanceof Element)) return false;
  if (target.closest(INTERACTIVE)) return true;
  // Clickable cards and rows advertise themselves with a pointer cursor.
  return getComputedStyle(target).cursor === "pointer";
};

const notify = () => toast.error(SUBSCRIPTION_ACTION_MESSAGE, { id: TOAST_ID });

// Pointer phases: stop the page's handlers (menus and selects open on
// pointerdown) without preventDefault, so scrolling and text selection still work.
const swallow = (e: SyntheticEvent) => {
  e.stopPropagation();
  if (isInteractive(e.target)) notify();
};

// Clicks, submits and changes: also cancel the native default (links,
// checkboxes, form posts).
const cancel = (e: SyntheticEvent) => {
  e.preventDefault();
  e.stopPropagation();
  if (isInteractive(e.target)) notify();
};

const cancelKey = (e: KeyboardEvent) => {
  if (PASS_KEYS.has(e.key)) return;
  cancel(e);
};

const GUARDS: GuardProps = {
  onPointerDownCapture: swallow,
  onPointerUpCapture: swallow,
  onMouseDownCapture: swallow,
  onClickCapture: cancel,
  onSubmitCapture: cancel,
  onChangeCapture: cancel,
  onKeyDownCapture: cancelKey,
};

export const lockGuardProps = (locked: boolean): GuardProps =>
  locked ? GUARDS : {};
