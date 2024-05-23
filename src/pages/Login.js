import { useState } from "react";
import { Button, FormLabel, Grid, Input, Stack } from "@mui/joy";
import LayoutAuth from "../components/LayoutAuth";
import { Link } from "react-router-dom";

import { useAuth } from "../firebase/auth";


export default function Login() {

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  }

  return (
    <LayoutAuth>
      <Grid container justifyContent="center" alignItems="center" p={3}>
        <Grid xs={12} md={8} lg={4}>
          <Stack direction="column" spacing={2}>
            <h1>GossipAI</h1>
            <h2>Sign In</h2>
            <form onSubmit={handleLogin}>
              <Stack direction="column" spacing={1}>
                <FormLabel>E-mail</FormLabel>
                <Input
                onChange={(e) => setEmail(e.target.value)}
                variant="soft" type="email" placeholder="Enter your e-mail" />
                <FormLabel>Password</FormLabel>
                <Input
                onChange={(e) => setPassword(e.target.value)}
                variant="soft" type="password"/>
                <Button type="submit">Login</Button>
              </Stack>
            </form>
            <Link to="/register">Don't have an account? Register</Link>
          </Stack>
        </Grid>
      </Grid>
    </LayoutAuth>
  );
}