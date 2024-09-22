import { useStore } from "@/store";
import { TAction } from "@/types/TMessage";
import { sendMessage } from "@/utils/helpers";
import { Button, Select } from "antd";
import { useCallback } from "react";
/** компонент с конфигурированием запроса и отправкой запроса */
export const Configs = () => {
	const [animalType, { dispatch, actions }] = useStore((state) => state.app.animalType);

	const handleGetAnimal = useCallback(async () => {
		dispatch(actions.app.onFetching(true));
		const res = await sendMessage({ action: TAction.GET_ANIMAL, animalType });
		res.animalData && dispatch(actions.app.setAnimalData(res.animalData));
		dispatch(actions.app.onFetching(false));
	}, [animalType]);

	const onChange = useCallback((animalType: string) => dispatch(actions.app.onChange(animalType)), []);

	return (
		<>
			<Button size="small" children="Получить факт о животном" onClick={handleGetAnimal} />
			<Select onChange={onChange} value={animalType}>
				<Select.Option value="cat">Кошки</Select.Option>
				<Select.Option value="dog">Собаки</Select.Option>
			</Select>
		</>
	);
};
