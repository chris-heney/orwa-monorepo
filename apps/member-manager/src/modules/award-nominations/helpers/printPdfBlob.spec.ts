/** @vitest-environment jsdom */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  PRINT_AFTERPRINT_IGNORE_MS,
  PRINT_DIALOG_TIMEOUT_MS,
  printPdfBlob,
} from "./printNominationApplication";

type FakeWin = {
  focus: () => void;
  print: () => void;
  addEventListener: (type: string, fn: EventListener) => void;
  removeEventListener: (type: string, fn: EventListener) => void;
  dispatchEvent: (event: Event) => boolean;
};

const stubIframeWindow = (printImpl: () => void): FakeWin => {
  const listeners = new Map<string, Set<EventListener>>();
  const fakeWin: FakeWin = {
    focus: vi.fn(),
    print: printImpl,
    addEventListener: (type, fn) => {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type)!.add(fn);
    },
    removeEventListener: (type, fn) => {
      listeners.get(type)?.delete(fn);
    },
    dispatchEvent: (event) => {
      listeners.get(event.type)?.forEach((fn) => fn(event));
      return true;
    },
  };
  const orig = document.createElement.bind(document);
  vi.spyOn(document, "createElement").mockImplementation((tagName, options) => {
    const el = orig(tagName, options as ElementCreationOptions);
    if (String(tagName).toLowerCase() === "iframe") {
      Object.defineProperty(el, "contentWindow", {
        configurable: true,
        get: () => fakeWin,
      });
    }
    return el;
  });
  return fakeWin;
};

const startPrint = async () => {
  const pending = printPdfBlob(
    new Blob(["%PDF-1.4"], { type: "application/pdf" })
  );
  await Promise.resolve();
  const iframe = document.querySelector("iframe");
  iframe?.onload?.(new Event("load"));
  return pending;
};

describe("printPdfBlob", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    URL.createObjectURL = () => "blob:print-test";
    URL.revokeObjectURL = () => undefined;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("ignores afterprint that fires as print() opens", async () => {
    const fakeWin = stubIframeWindow(() => {
      fakeWin.dispatchEvent(new Event("afterprint"));
      window.dispatchEvent(new Event("afterprint"));
    });
    const pending = startPrint();
    await Promise.resolve();
    expect(document.querySelector("iframe")).not.toBeNull();
    vi.advanceTimersByTime(PRINT_AFTERPRINT_IGNORE_MS - 50);
    expect(document.querySelector("iframe")).not.toBeNull();
    vi.advanceTimersByTime(100);
    window.dispatchEvent(new Event("afterprint"));
    await pending;
    expect(document.querySelector("iframe")).toBeNull();
  });

  it("starts the next job only after a late afterprint", async () => {
    const prints: number[] = [];
    const fakeWin = stubIframeWindow(() => {
      prints.push(Date.now());
    });
    const first = startPrint();
    await Promise.resolve();
    expect(prints).toHaveLength(1);
    const secondStarted = vi.fn();
    const second = first.then(() => {
      secondStarted();
      return startPrint();
    });
    await Promise.resolve();
    expect(secondStarted).not.toHaveBeenCalled();
    vi.advanceTimersByTime(PRINT_AFTERPRINT_IGNORE_MS + 10);
    fakeWin.dispatchEvent(new Event("afterprint"));
    await first;
    await Promise.resolve();
    expect(secondStarted).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(PRINT_AFTERPRINT_IGNORE_MS + 10);
    window.dispatchEvent(new Event("focus"));
    await second;
    expect(prints).toHaveLength(2);
  });

  it("accepts window focus after the ignore window (Chromium fallback)", async () => {
    stubIframeWindow(() => undefined);
    const pending = startPrint();
    await Promise.resolve();
    window.dispatchEvent(new Event("focus"));
    expect(document.querySelector("iframe")).not.toBeNull();
    vi.advanceTimersByTime(PRINT_AFTERPRINT_IGNORE_MS + 10);
    window.dispatchEvent(new Event("focus"));
    await pending;
    expect(document.querySelector("iframe")).toBeNull();
  });

  it("clears the iframe on the dialog timeout so the queue cannot spin forever", async () => {
    stubIframeWindow(() => undefined);
    const pending = startPrint();
    await Promise.resolve();
    vi.advanceTimersByTime(PRINT_DIALOG_TIMEOUT_MS);
    await pending;
    expect(document.querySelector("iframe")).toBeNull();
  });
});
