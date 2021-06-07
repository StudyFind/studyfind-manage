import React, { useState, useEffect } from "react";
import { auth } from "database/firebase";
import { Flex, Spinner } from "@chakra-ui/react";
import Message from "./Message";

function VerifyEmail({ code }) {
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (code) {
      auth
        .applyActionCode(code)
        .then(() => setSuccess(true))
        .catch(() => setSuccess(false));
    } else {
      setSuccess(false);
    }
  }, [code]);

  if (success === null) {
    return (
      <Flex py="120px" w="100%" justify="center">
        <Spinner />
      </Flex>
    );
  }

  return success ? (
    <Message
      status="success"
      title="Verification successful!"
      description="Your email has now been verified!"
    />
  ) : (
    <Message
      status="failure"
      title="Verification expired!"
      description="Your email verification was unsuccessful"
    />
  );
}

export default VerifyEmail;
