import { TMessage } from "@/types/TMessage"; // Импортируем тип сообщения

/** Функция для получения активной вкладки браузера */
export const getActiveTab = async (): Promise<chrome.tabs.Tab | undefined> => {
	return new Promise((resolve, reject) => {
		try {
			// Запрашиваем все активные вкладки
			chrome.tabs.query({ active: true }, (tabs) => {
				// Если возникла ошибка расширения Chrome, выбрасываем её
				if (chrome.runtime.lastError) throw new Error(chrome.runtime.lastError.toString());

				// Получаем первую активную вкладку из массива
				const tab = tabs.at(0);

				// Если вкладка не найдена, выбрасываем ошибку
				if (!tab) throw new Error("An error occurred when getting the active tab");

				// Возвращаем найденную вкладку
				resolve(tab);
			});
		} catch (error) {
			// В случае ошибки возвращаем undefined
			reject(undefined);
		}
	});
};

/**  Функция для отправки сообщения через расширение браузера */
export const sendMessage = async (request: TMessage): Promise<TMessage> => {
	try {
		// Отправляем сообщение через chrome.runtime.sendMessage и получаем ответ
		const response = await chrome.runtime.sendMessage<TMessage, TMessage>(request);

		// Возвращаем ответ как успешный результат
		return Promise.resolve(response);
	} catch (error) {
		// В случае ошибки возвращаем отклонённое Promise с ошибкой
		return Promise.reject(error as Error);
	}
};

/** Функция для отправки сообщения в контент-скрипт на конкретную вкладку */
export const sendMessageToContent = async (request: TMessage, tabId?: number): Promise<TMessage> => {
	try {
		// Если tabId не передан, получаем id активной вкладки
		tabId = tabId ?? Number((await getActiveTab())?.id);

		// Если не удалось получить корректный id вкладки, выбрасываем ошибку
		if (!tabId || tabId <= 0) {
			throw Error("Can't get the active tab");
		}

		// Отправляем сообщение на вкладку с tabId через chrome.tabs.sendMessage
		const contentResponse = await chrome.tabs.sendMessage<TMessage, TMessage>(tabId, { ...request, tabId });

		// Возвращаем успешный ответ от контент-скрипта
		return Promise.resolve(contentResponse);
	} catch (error) {
		// В случае ошибки возвращаем отклонённое Promise с ошибкой
		return Promise.reject(error as Error);
	}
};

/** Функция проверки, является ли объект типом TMessage */
export const isTMessage = (response: TMessage): response is TMessage => {
	// Проверяем, что объект существует и имеет строковое поле action
	return response && typeof response.action === "string";
};
