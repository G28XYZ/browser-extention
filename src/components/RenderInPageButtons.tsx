import { TAction } from "@/types/TMessage";
import { sendMessage } from "@/utils/helpers";
import { Button } from "antd";
import { useCallback } from "react";
/** компонент с кнопками отрисовки и удаления полученного контента на странице активной вкладки */
export const RenderInPageButtons = () => {
	const handleRender = useCallback(() => sendMessage({ action: TAction.RENDER }), []);
	const handleDelete = useCallback(() => sendMessage({ action: TAction.DELETE_RENDER }), []);
	return (
		<>
			<Button size="small" children="Отрисовать на странице" onClick={handleRender} />
			<Button size="small" children="Удалить со страницы" onClick={handleDelete} />
		</>
	);
};
