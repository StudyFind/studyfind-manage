import React from "react";
import { Heading, Text, Box, Center, Flex } from "@chakra-ui/react";
import { FaTimesCircle, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

function Message({ status, title, description, children, ...rest }) {
  const statuses = {
    success: { icon: FaCheckCircle, color: "green" },
    neutral: { icon: FaExclamationCircle, color: "blue" },
    failure: { icon: FaTimesCircle, color: "red" },
  };

  const { icon, color } = statuses[status] || statuses["neutral"];

  return (
    <Flex direction="column" justify="center" align="center" h="100%" w="100%" {...rest}>
      <Center maxW="400px">
        <Flex direction="column" align="center" textAlign="center">
          <Box as={icon} size="48px" color={`${color}.400`} />
          <Flex justify="center" align="center" gridGap="10px">
            <Heading size="lg" mt="20px" mb="10px">
              {title}
            </Heading>
          </Flex>
          <Text mb="15px" color="gray.500">
            {description}
          </Text>
          {children}
        </Flex>
      </Center>
    </Flex>
  );
}

export default Message;
