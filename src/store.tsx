import { Store, TSliceAction, createSlice, TMiddleware } from "react-context-tk";
import { AnimalResponse } from "./types/TMessage";
/** стейт приложения */
const initAppState = {
	isLoading: false,
	animalData: { image: "", fact: "" },
	animalType: "cat",
};
/** тип дл стейта */
type TAppState = typeof initAppState;
/** метод для изменения типа животного */
const onChange: TSliceAction<TAppState, string> = (state, payload) => {
	state.animalType = payload;
};
/** слайс для стора приложения */
const appSlice = createSlice({
	name: "app",
	initState: initAppState,
	reducers: {
		onChange,
		setAnimalData: (state, payload: AnimalResponse) => {
			state.animalData = payload;
		},
		onFetching(state, payload: boolean) {
			state.isLoading = payload;
		},
	},
});
/** стор приложения */
const store = { ...appSlice.sliceStore };
/** экшен для мидлвары */
const actionMiddleware: TMiddleware<typeof storeInstance> = async ({ action, actions, dispatch, state }) => {
	switch (
		action.type // реакция на изменение вида животного, активируется как мидлвара
	) {
		case "app/onChange":
			console.log({ prev: state.app.animalType, new: action.payload });
			dispatch(actions.app.onFetching(true));
			const res = await fetch(`https://some-random-api.com/animal/${action.payload || ""}`);
			res.ok && dispatch(actions.app.setAnimalData(await res.json()));
			dispatch(actions.app.onFetching(false));
	}
};
/** экшены приложения */
const actions = {
	[appSlice.name]: appSlice.actions,
};

export const {
	/** хук для извлечения стейта, экшенов и диспатча приложения */
	useStore,
	/** стор провайдер */
	StoreProvider,
	/** инстанс стора, для доп настроек */
	storeInstance,
} = Store(store, actions);
// мидлвары приложения, передается колбэк который получает текущий контекст приложения
// можно по типу экшена предварительно обработать вызов
// как например app/onChange, при смене типа животного изменяет состояние isLoading и отправляет запрос на получение данных
storeInstance.createMiddleware(actionMiddleware);
