import { TAction } from "@/types/TMessage";
import { sendMessage } from "@/utils/helpers";
import { FloatButton } from "antd";
import { useCallback } from "react";
import { SyncOutlined } from "@ant-design/icons";
/** компонент смены темы в активной вкладке браузера ( простая смена пропа filter у body ) */
export const ChangeTheme = () => {
	const handleInvert = useCallback(() => sendMessage({ action: TAction.INVERT_COLOR }), []);

	return (
		<FloatButton
			onClick={handleInvert}
			icon={<SyncOutlined />}
			style={{ top: 5, left: 5 }}
			tooltip="сменить тему"
		/>
	);
};
