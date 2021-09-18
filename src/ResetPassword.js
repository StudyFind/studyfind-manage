import { useState } from "react";
import { useFirebase } from "@studyfind/firebase";

import { validate } from "@studyfind/utils";

import { Card, Form, Message, PasswordInput } from "@studyfind/components";
import { Grid, Heading, Button } from "@chakra-ui/react";

function ResetPassword({ code }) {
  const [inputs, setInputs] = useState({ password: "" });
  const [errors, setErrors] = useState({ password: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const { auth } = useFirebase();

  const handleChange = (_, value) => {
    setInputs({ password: value });
    setErrors({ password: validate.password(value) });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const error = validate.password(inputs.password);

      if (error) {
        setErrors({ password: error });
        return;
      }

      await auth.verifyPasswordResetCode(code);
      await auth.confirmPasswordReset(code, inputs.password);

      setSuccess(true);
    } catch (e) {
      setSuccess(false);
      setErrors({ password: "The password reset link has expired" });
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
      <Card p="30px" w="350px">
        <Grid gap="20px">
          <Heading fontSize="1.75rem" mb="6px" color="blue.500" textAlign="center">
            Reset Password
          </Heading>
          <PasswordInput
            size="lg"
            name="password"
            value={inputs.password}
            error={errors.password}
            onChange={handleChange}
            placeholder="Password"
          />
          <Button size="lg" colorScheme="blue" type="submit" isLoading={loading}>
            Confirm Reset Password
          </Button>
        </Grid>
      </Card>
    </Form>
  );
}

export default ResetPassword;
