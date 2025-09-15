import React, { useState } from "react";
import { useAuthProvider, useNotify } from "react-admin";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link, CircularProgress } from "@mui/material";
import Logo from "./components/logo";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state
  const authProvider = useAuthProvider();
  const notify = useNotify();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      notify("Please enter your email", { type: "error" });
      return;
    }

    setLoading(true); // Start loading

    try {
      await authProvider.sendResetPasswordEmail(email);
      notify("Password reset link has been sent to your email", { type: "success" });
    } catch (error) {
      notify("Error sending reset password link. Please try again.", { type: "error" });
    } finally {
      setLoading(false); // Stop loading after submission
    }
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "15px",
        }}
      >
        <Logo />

        <Typography component="h1" variant="h6">
          ORWA Admin v2
        </Typography>
        <Typography component="h1" variant="h6">
          Reset Password
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
            disabled={loading} // Disable input while loading
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading} // Disable button while loading
          >
            {loading ? <CircularProgress size={24} /> : "Send Reset Password Link"}
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
    </>
  );
};

export default ForgotPasswordPage;