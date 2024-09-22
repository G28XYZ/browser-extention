import { TAction, TMessage } from "@/types/TMessage";
import { sendMessageToContent } from "@/utils/helpers";

// слушатель сообщений из app.tsx и content.ts
chrome.runtime.onMessage.addListener((request: TMessage, sender, sendResponse) => {
	console.log(request, sender, sendResponse);
	const { action } = request;

	switch (action) {
		case TAction.INIT:
			(async () => {
				sendResponse(await sendMessageToContent(request));
			})();
			break;
		case TAction.GET_ANIMAL:
			(async () => {
				const res = await sendMessageToContent(request);
				sendResponse(res);
			})();
			break;
		case TAction.DELETE_RENDER:
		case TAction.RENDER:
		case TAction.INVERT_COLOR:
			sendMessageToContent(request);
		default:
			sendResponse(request);
	}

	return true; // признак что ответ будет асинхронный
});
