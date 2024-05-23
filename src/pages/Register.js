import { Button, FormLabel, Grid, Input, Stack } from "@mui/joy";
import LayoutAuth from "../components/LayoutAuth";
import { Link } from "react-router-dom";
import { useAuth } from "../firebase/auth";

export default function Register() {

  const { signup } = useAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    await signup(email, password)
  }

  return (
    <LayoutAuth>
      <Grid container justifyContent="center" alignItems="center" p={3}>
        <Grid xs={12} md={8} lg={4}>
          <Stack direction="column" spacing={2}>
            <h1>GossipAI</h1>
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
        </Grid>
      </Grid>
    </LayoutAuth>
  );
}