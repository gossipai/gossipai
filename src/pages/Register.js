import { Alert, Button, FormLabel, Grid, Input, Stack } from "@mui/joy";
import LayoutAuth from "../components/LayoutAuth";
import { Link } from "react-router-dom";
import { useAuth } from "../firebase/auth";
import { useState } from "react";

export default function Register() {

  const { signup } = useAuth();
  const [error, setError] = useState(null);

  const handleSignUp = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    signup(email, password).catch((error) => {
      setError(error.message);
    });
  }

  return (
    <LayoutAuth>
      <Stack direction="column" spacing={1}>
        {error && <Alert color="danger" variant="solid">{error}</Alert>}            
        <h2>Create An Account</h2>
        <form onSubmit={handleSignUp}>
          <Stack direction="column" spacing={1}>
              <FormLabel>E-mail</FormLabel>
              <Input variant="soft" type="email" placeholder="Enter your e-mail" />
              <FormLabel>Password</FormLabel>
              <Input variant="soft" type="password"/>
              <Button type="submit">Register</Button>
          </Stack>
        </form>
        <Link to="/login">Already have an account? Sign In</Link>
      </Stack>
    </LayoutAuth>
  );
}