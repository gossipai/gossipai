import { Button, FormLabel, Grid, Input, Stack } from "@mui/joy";
import LayoutAuth from "../components/LayoutAuth";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <LayoutAuth>
      <Grid container justifyContent="center" alignItems="center" p={3}>
        <Grid xs={12} md={8} lg={4}>
          <Stack direction="column" spacing={2}>
            <h1>GossipAI</h1>
            <h2>Sign In</h2>
            <form>
              <Stack direction="column" spacing={0.5}>
                <FormLabel>E-mail</FormLabel>
                <Input variant="soft" type="email" placeholder="Enter your e-mail" />
                <FormLabel>Password</FormLabel>
                <Input variant="soft" type="password"/>
              </Stack>
            </form>
            <Button type="submit">Login</Button>
            <Link to="/register">Don't have an account? Register</Link>
          </Stack>
        </Grid>
      </Grid>
    </LayoutAuth>
  );
}