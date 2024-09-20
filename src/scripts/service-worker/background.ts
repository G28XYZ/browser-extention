import { TAction, TMessage } from "@/types/TMessage";
import { sendMessageToContent } from "@/utils/helpers";

// Listen for messages from the app or content scripts
chrome.runtime.onMessage.addListener((request: TMessage, sender, sendResponse) => {
  console.log(request, sender, sendResponse);
  const { action } = request;

  switch (action) {
    case TAction.INIT:
      (async () => {
        const hasTableRes = await sendMessageToContent(request);
        console.log(hasTableRes);
        sendResponse({ ...request, ...hasTableRes });
      })();
      break;
    default:
      sendResponse(request);
  }

  return true; // признак что ответ будет асинхронный
});
