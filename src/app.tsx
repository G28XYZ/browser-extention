import { Button, Flex, Spin, Typography, Image, Select, FloatButton, Tooltip } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { AnimalResponse, TAction } from "./types/TMessage";
import { sendMessage } from "./utils/helpers";
import { useCallback, useEffect, useState } from "react";

const { Paragraph } = Typography;

export const App = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [animalData, setAnimalData] = useState<AnimalResponse>({ image: "", fact: "" });
	const [animalType, setAnimalType] = useState("cat");

	useEffect(() => {
		onInit();
	}, []);

	const onInit = async () => {
		const response = await sendMessage({ action: TAction.INIT });
		response.animalData.image && setAnimalData(response.animalData);
	};

	const handleGetAnimal = useCallback(async () => {
		setIsLoading(true);
		const res = await sendMessage({ action: TAction.GET_ANIMAL, animalType });
		res.animalData && setAnimalData(res.animalData);
		setIsLoading(false);
	}, [animalType]);

	const handleRender = useCallback(async () => sendMessage({ action: TAction.RENDER }), []);
	const handleDelete = useCallback(async () => sendMessage({ action: TAction.DELETE_RENDER }), []);

	const handleInvert = useCallback(async () => sendMessage({ action: TAction.INVERT_COLOR }), []);

	const onChange = useCallback((animalType: string) => setAnimalType(animalType), []);

	if (isLoading)
		// если загрука, показать лоадер
		return (
			<Flex gap={8} align="center" justify="center">
				<span>Загрузка...</span>
				<Spin />
			</Flex>
		);
	return (
		<Flex vertical align="center" justify="center" gap={10}>
			<FloatButton
				onClick={handleInvert}
				icon={<SyncOutlined />}
				style={{ top: 5, left: 5 }}
				tooltip="сменить тему"
			/>
			{animalData.image && animalData.fact && (
				<>
					<Button size="small" children="Отрисовать на странице" onClick={handleRender} />
					<Button size="small" children="Удалить со страницы" onClick={handleDelete} />
				</>
			)}
			<Button size="small" children="Получить факт о животном" onClick={handleGetAnimal} />
			<Select onChange={onChange} value={animalType}>
				<Select.Option value="cat">Кошки</Select.Option>
				<Select.Option value="dog">Собаки</Select.Option>
			</Select>
			{animalData.image && <Image height={200} width={200} src={animalData.image} alt="" />}
			{animalData.fact && (
				<Tooltip title="TODO translate">
					<Paragraph copyable>{animalData.fact}</Paragraph>
				</Tooltip>
			)}
		</Flex>
	);
};
