import { Button, Flex, Spin } from "antd";
import { TAction } from "./types/TMessage";
import { sendMessage } from "./utils/helpers";
import { useEffect, useState } from "react";

export const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  setIsLoading;
  const onInit = async () => {
    const response = await sendMessage({ action: TAction.INIT });
    console.log(response);
  };

  useEffect(() => {
    onInit();
  }, []);

  if (isLoading)
    return (
      <Flex gap={8} align="center" justify="center">
        <span>Загрузка...</span>
        <Spin />
      </Flex>
    );

  return (
    <Flex vertical align="center" justify="center" gap={10}>
      <Button />
    </Flex>
  );
};
