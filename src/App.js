import React, { useState, useEffect } from "react";

import { Flex } from "@chakra-ui/react";

import ResetPassword from "./ResetPassword";
import VerifyEmail from "./VerifyEmail";

function App() {
  const [mode, setMode] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setMode(params.get("mode"));
    setCode(params.get("oobCode"));
  }, []);

  return (
    <Flex h="100vh" w="100vw" justify="center" align="center">
      {mode === "resetPassword" ? <ResetPassword code={code} /> : <VerifyEmail code={code} />}
    </Flex>
  );
}

export default App;
