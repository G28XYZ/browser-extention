export enum TAction {
	INIT = "INIT",
	GET_ANIMAL = "GET_ANIMAL",
	RENDER = "RENDER",
	DELETE_RENDER = "DELETE_RENDER",
	INVERT_COLOR = "INVERT_COLOR",
}

export type TMessage = {
	action: `${TAction}`;
	tabId?: number;
	animalType?: string;
	animalData?: AnimalResponse;
};

export type AnimalResponse = { image: string; fact: string };
