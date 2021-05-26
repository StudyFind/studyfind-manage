import React from "react";

import { Flex } from "@chakra-ui/react";

import ResetPassword from "./ResetPassword";
import VerifyEmail from "./VerifyEmail";

function App() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  const code = params.get("oobCode");

  return (
    <Flex h="100vh" w="100vw" justify="center" align="center">
      {mode === "resetPassword" ? <ResetPassword code={code} /> : <VerifyEmail code={code} />}
    </Flex>
  );
}

export default App;
