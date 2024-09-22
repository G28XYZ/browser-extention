import { AnimalResponse, TMessage } from "@/types/TMessage";

let animalData = {
	image: "",
	fact: "Ошибка, попробуйте ещё раз.",
};

chrome.runtime.onMessage.addListener((request: TMessage, sender, sendResponse: (msg: TMessage) => any) => {
	console.log(request, sender);
	sender;
	const { action, animalType } = request;
	switch (action) {
		case "INIT":
			sendResponse({ ...request, animalData });
			break;
		case "GET_ANIMAL":
			(async () => {
				animalData = await actions.getRandom(animalType);
				sendResponse({ ...request, animalData });
			})();
			break;
		case "DELETE_RENDER":
			actions.deleteRender();
			sendResponse(request);
			break;
		case "INVERT_COLOR":
			actions.onInvert();
			sendResponse(request);
			break;
		case "RENDER":
			actions.renderToPage();
		default:
			sendResponse(request);
	}
	return true; // признак что ответ будет асинхронный
});

const actions = {
	renderToPage: () => {
		const browserExtentionRender = document.querySelector("#browserExtentionRender");
		if (!browserExtentionRender) {
			const img = document.createElement("img");
			const figcaption = document.createElement("figcaption");
			const figure = document.createElement("figure");

			figure.id = "browserExtentionRender";

			img.src = animalData.image;
			img.style.maxHeight = "300px";
			img.style.maxWidth = "300px";

			figcaption.textContent = animalData.fact;

			figure.append(img, figcaption);

			document.body.prepend(figure);
		} else if (browserExtentionRender) {
			const img = browserExtentionRender.querySelector("img");
			const figcaption = browserExtentionRender.querySelector("figcaption");

			img.src = animalData.image;
			figcaption.textContent = animalData.fact;
		}
	},

	deleteRender: () => {
		document.querySelector("#browserExtentionRender")?.remove();
	},

	onInvert: () => {
		const invertValue = "invert(100%)";

		if (!document.body.style.filter?.includes(invertValue)) document.body.style.filter = invertValue;
		else document.body.style.filter = "none";
	},

	getRandom: async (animalType: string = "cat"): Promise<AnimalResponse> => {
		await new Promise((resolve) => setTimeout(() => resolve(true), 1000));

		const res = await fetch("https://some-random-api.com/animal/" + (animalType || ""));

		animalData = {
			image: "",
			fact: "Ошибка, попробуйте ещё раз.",
		};

		if (res.ok && animalType) {
			animalData = await res.json();
			return animalData;
		}

		return animalData;
	},
};
