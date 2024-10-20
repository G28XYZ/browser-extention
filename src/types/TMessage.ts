export enum TAction {
	/** инициализация */
	INIT = "INIT",
	/** получить инфу о животном */
	GET_ANIMAL = "GET_ANIMAL",
	/** отрендерить инфу на странице активной вкладки */
	RENDER = "RENDER",
	/** удалить рендер от расширения */
	DELETE_RENDER = "DELETE_RENDER",
	/** сменить тему */
	INVERT_COLOR = "INVERT_COLOR",
}

export type TMessage = {
	/** тип экшена {@see TAction} */
	action: `${TAction}`;
	/** id вкладки */
	tabId?: number;
	/** тип животного */
	animalType?: string;
	/** полученные данные */
	animalData?: AnimalResponse;
};

export type AnimalResponse = { image: string; fact: string };
