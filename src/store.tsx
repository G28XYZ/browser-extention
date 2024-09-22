import { Store, TSliceAction, createSlice, TMiddleware } from "react-context-tk";
import { AnimalResponse } from "./types/TMessage";

const initAppState = {
	isLoading: false,
	animalData: { image: "", fact: "" },
	animalType: "cat",
};

type TAppState = typeof initAppState;
const onChange: TSliceAction<TAppState, string> = (state, payload) => {
	state.animalType = payload;
};

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

const store = { ...appSlice.sliceStore };

const actionMiddleware: TMiddleware<typeof storeInstance> = async ({ action, actions, dispatch, state }) => {
	switch (action.type) {
		case "app/onChange":
			console.log({ prev: state.app.animalType, new: action.payload });
			dispatch(actions.app.onFetching(true));
			const res = await fetch("https://some-random-api.com/animal/" + (action.payload || ""));
			res.ok && dispatch(actions.app.setAnimalData(await res.json()));
			dispatch(actions.app.onFetching(false));
	}
};

const actions = {
	[appSlice.name]: appSlice.actions,
};

export const { useStore, StoreProvider, storeInstance } = Store(store, actions);

const middlewares = storeInstance.createMiddleware(actionMiddleware);
