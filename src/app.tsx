import { useEffect } from "react";
import { Flex } from "antd";

import { TAction } from "./types/TMessage";
import { sendMessage } from "./utils/helpers";
import { useStore } from "./store";
import { RenderInPageButtons } from "./components/RenderInPageButtons";
import { Configs } from "./components/Configs";
import { Content } from "./components/Content";
import { Loading } from "./components/Loading";

export const App = () => {
	const [animalData, { dispatch, actions }] = useStore((state) => state.app.animalData);

	useEffect(() => {
		onInit();
	}, []);

	const onInit = async () => {
		const res = await sendMessage({ action: TAction.INIT });
		res.animalData.image && dispatch(actions.app.setAnimalData(res.animalData));
	};

	return (
		<Loading>
			<Flex vertical align="center" justify="center" gap={10}>
				{/* кнопки для отрисовки/удаления полученного контента на странице активной вкладки браузера */}
				{animalData.image && animalData.fact && <RenderInPageButtons />}
				{/* конфигурации и кнопка для отправки запроса получения информации о животном */}
				<Configs />
				{/* контент с полученной информацией о животном */}
				<Content />
			</Flex>
		</Loading>
	);
};
