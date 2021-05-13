import React, { useState, useEffect } from "react";
import { auth } from "database/firebase";
import { Flex, Spinner } from "@chakra-ui/react";
import Message from "./Message";

function VerifyEmail({ code }) {
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth
      .applyActionCode(code || "")
      .then(() => setSuccess(true))
      .catch(() => setSuccess(false))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) {
    return (
      <Flex py="120px" w="100%" justify="center">
        <Spinner />
      </Flex>
    );
  }

  if (success) {
    return (
      <Message
        status="success"
        title="Verification successful!"
        description="Your email has now been verified!"
      />
    );
  }

  return (
    <Message
      status="failure"
      title="Verification expired"
      description="Your email verification was unsuccessful"
    />
  );
}

export default VerifyEmail;
