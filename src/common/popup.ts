import { BrowserRuntime, EXTENSION_WIDTH, EXTENSION_HEIGHT } from "../common";
import { Context } from "../background/backend";

const POPUP_HTML = "popup.html";
export const QUERY_LOCKED = "locked=true";
export const QUERY_APPROVAL = "approval=true";
export const QUERY_LOCKED_APPROVAL = "locked-approval=true";

export function openLockedApprovalPopupWindow(ctx: Context) {
  const url = `${POPUP_HTML}?${QUERY_LOCKED_APPROVAL}&origin=${ctx.sender.origin}`;
  return openPopupWindow(ctx, url);
}

export function openLockedPopupWindow(ctx: Context) {
  const url = `${POPUP_HTML}?${QUERY_LOCKED}&origin=${ctx.sender.origin}`;
  return openPopupWindow(ctx, url);
}

export function openApprovalPopupWindow(ctx: Context) {
  const url = `${POPUP_HTML}?${QUERY_APPROVAL}&origin=${ctx.sender.origin}`;
  return openPopupWindow(ctx, url);
}

function openPopupWindow(ctx: Context, url: string) {
  BrowserRuntime.getLastFocusedWindow().then((window: any) => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      BrowserRuntime.openWindow({
        url: `${url}&windowId=${window.id}&tabId=${tab.id}`,
        type: "popup",
        width: EXTENSION_WIDTH,
        height: EXTENSION_HEIGHT,
        top: window.top,
        left: window.left + (window.width - EXTENSION_WIDTH),
        focused: true,
      });
    });
  });
}

export function openExpandedExtension() {
  window.open(chrome.extension.getURL(POPUP_HTML), "_blank");
}

export function isExtensionPopup() {
  // A bit of a hack, but we want to know this *on click*  of the extension
  // button and so the dimensions can be smaller since the view hasn't loaded.
  return (
    window.innerWidth <= EXTENSION_WIDTH &&
    window.innerHeight <= EXTENSION_HEIGHT
  );
}
