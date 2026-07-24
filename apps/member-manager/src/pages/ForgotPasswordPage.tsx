import React, { useState } from "react";
import { useAuthProvider, useNotify } from "react-admin";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link, CircularProgress } from "@mui/material";
import Logo from "./components/logo";
import AuthPageShell from "./components/AuthPageShell";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const authProvider = useAuthProvider();
  const notify = useNotify();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      notify("Please enter your email", { type: "error" });
      return;
    }

    setLoading(true);

    try {
      await authProvider.sendResetPasswordEmail(email);
      notify("Password reset link has been sent to your email", { type: "success" });
    } catch (error) {
      notify("Error sending reset password link. Please try again.", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell>
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Logo />

        <Typography component="h1" variant="h6" sx={{ mt: 1 }}>
          ORWA Admin v2
        </Typography>
        <Typography component="h2" variant="h6">
          Reset Password
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            variant="outlined"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Send Reset Password Link"}
          </Button>
          <Link
            href="#/login"
            variant="body2"
            display={"flex"}
            justifyContent={"center"}
          >
            Back to login
          </Link>
        </Box>
      </Box>
    </AuthPageShell>
  );
};

export default ForgotPasswordPage;
