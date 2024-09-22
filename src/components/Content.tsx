import { useStore } from "@/store";
import { Tooltip, Typography, Image } from "antd";

const { Paragraph } = Typography;
/** компонента для рендера полученного контента о животном */
export const Content = () => {
	const [animalData] = useStore((state) => state.app.animalData);

	return (
		<>
			{animalData.image && <Image height={200} width={200} src={animalData.image} alt="" />}
			{animalData.fact && (
				<Tooltip title="TODO translate">
					<Paragraph copyable>{animalData.fact}</Paragraph>
				</Tooltip>
			)}
		</>
	);
};
