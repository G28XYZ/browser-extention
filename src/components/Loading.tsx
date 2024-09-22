import { useStore } from "@/store";
import { Flex, Spin } from "antd";
/** компонент лоадера */
export const Loading = ({ children }) => {
	const [isLoading] = useStore((state) => state.app.isLoading);

	if (isLoading)
		// если загрузка, показать лоадер
		return (
			<Flex gap={8} align="center" justify="center">
				<span>Загрузка...</span>
				<Spin />
			</Flex>
		);

	return children;
};
