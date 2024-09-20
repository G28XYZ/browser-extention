import { TMessage } from "@/types/TMessage";

chrome.runtime.onMessage.addListener((request: TMessage, sender, sendResponse: (msg: TMessage) => any) => {
  console.log(request, sender);
  sender;
  const { action } = request;
  switch (action) {
    case "INIT":
      sendResponse(request);
      break;
    default:
      sendResponse(request);
  }
  return true; // признак что ответ будет асинхронный
});
