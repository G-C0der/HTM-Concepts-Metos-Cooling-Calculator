import React, {useContext, useState} from 'react';
import {Alert, Button, Grid, Paper, TextField, Typography} from "@mui/material";
import {AuthContext, UserContext} from "../../contexts";
import {useNavigate} from "react-router-dom";
import {htmConceptsEmail} from "../../config";

const incompleteErrors = {
  userAccountNotYetVerified: 'Your user account hasn\'t been verified yet.',
  userAccountNotYetActivated: 'Your user account is currently inactive.'
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | React.ReactNode>('');

  const { login } = useContext(AuthContext);
  const { sendVerificationEmail } = useContext(UserContext);

  const navigate = useNavigate();

  const completeError = (error: string) => {
    if (!Object.values(incompleteErrors).includes(error)) return error;

    switch (error) {
      case incompleteErrors.userAccountNotYetVerified:
        return (
          <>
            {error} Please click on the "Verify Account" button in the verification email you have got after
            your registration. If you need a new verification email,
            <Button
              style={{backgroundColor: "#4CAF50", color: "#fff", border: "none", padding: "0 10px",
                textAlign: "center", textDecoration: "none", display: "inline-block", fontSize: "12px",
                margin: "0 0 0 3px", cursor: "pointer"}}
              onClick={async () => await sendVerificationEmail(email)}
            >
              click here
            </Button>.
          </>
        );
      case incompleteErrors.userAccountNotYetActivated:
        return (
          <>
            {error} We're reviewing your user account and email you, once your user account has been activated.
            If you need further information, you can contact us <a href={`mailto:${htmConceptsEmail}`}>here</a>
          </>
        );
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const loginResponse = await login({ email, password });

    if (loginResponse.success) navigate('/');
    else setError(completeError(loginResponse.error!)!);
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper style={{ padding: 16 }} elevation={3}>
          <Typography variant="h5" align="center" component="h1" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
            />
            <Button
              fullWidth
              type="submit"
              color="primary"
              variant="contained"
              style={{ marginTop: 16 }}
            >
              Login
            </Button>
            <Button
              fullWidth
              color="secondary"
              variant="outlined"
              style={{ marginTop: 16 }}
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;