import { useState } from "react";
import { Alert, Button, FormLabel, Grid, Input, Stack } from "@mui/joy";
import LayoutAuth from "../components/LayoutAuth";
import { Link } from "react-router-dom";

import { useAuth } from "../firebase/auth";


export default function Login() {

  const { login } = useAuth();
  const [error, setError] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    login(email, password).catch((error) => {
      setError(error.message);
    });
  }

  return (
    <LayoutAuth>
      <Stack direction="column" spacing={1}>
        <h2>Sign In</h2>
        <form onSubmit={handleLogin}>
          <Stack direction="column" spacing={1}>
            {error && <Alert color="danger" variant="solid">{error}</Alert>}
            <FormLabel>E-mail</FormLabel>
            <Input
            variant="soft" type="email" placeholder="Enter your e-mail" />
            <FormLabel>Password</FormLabel>
            <Input
            variant="soft" type="password"/>
            <Button type="submit">Login</Button>
          </Stack>
        </form>
        <Link to="/register">Don't have an account? Register</Link>
      </Stack>
    </LayoutAuth>
  );
}