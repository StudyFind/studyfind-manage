import React, { useState } from "react";
import { auth } from "database/firebase";
import { Grid, Heading, Button } from "@chakra-ui/react";

import Message from "./Message";
import Input from "./Input";
import Form from "./Form";

function ResetPassword({ code }) {
  const [show, setShow] = useState(false);
  const [inputs, setInputs] = useState({ password: "" });
  const [errors, setErrors] = useState({ password: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleToggle = () => {
    setShow((show) => !show);
  };

  const check = (password) => {
    const checkCase = password !== password.toLowerCase();
    const checkSize = password.length > 7;

    if (!password) return " ";
    if (!checkCase && !checkSize) return "Password must have 8 characters and one capital letter";
    if (!checkCase) return "Password must have a capital letter";
    if (!checkSize) return "Password must have 8 characters";
    return "";
  };

  const handleChange = (_, value) => {
    setInputs({ password: value });
    setErrors({ password: check(value) });
  };

  const handleSubmit = async () => {
    try {
      const error = check(inputs.password);

      if (error) {
        setErrors(error);
      }

      await auth.verifyPasswordResetCode(code);
      await auth.confirmPasswordReset(code, inputs.password);

      setSuccess(true);
    } catch (e) {
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Message
        status="success"
        title="Password Reset!"
        description="You can now use your new password to log in"
      />
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Grid p="30px" gap="20px" bg="#f8f9fa" borderRadius="5px" borderWidth="1px" w="350px">
        <Heading fontSize="1.75rem" mb="6px" color="blue.500" textAlign="center">
          Reset Password
        </Heading>
        <Input
          size="lg"
          name="password"
          value={inputs.password}
          error={errors.password}
          onChange={handleChange}
          placeholder="Password"
          type={show ? "text" : "password"}
          rightWidth="5rem"
          right={
            <Button color="gray.500" size="sm" onClick={handleToggle}>
              {show ? "Hide" : "Show"}
            </Button>
          }
        />
        <Button size="lg" colorScheme="blue" type="submit" isLoading={loading}>
          Confirm Reset Password
        </Button>
      </Grid>
    </Form>
  );
}

export default ResetPassword;
