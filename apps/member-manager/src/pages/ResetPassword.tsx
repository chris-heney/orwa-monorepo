import React, { useState, useEffect } from "react";
import { useAuthProvider, useNotify } from "react-admin";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link, CircularProgress } from "@mui/material";
import Logo from "./components/logo";
import AuthPageShell from "./components/AuthPageShell";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const authProvider = useAuthProvider();
  const notify = useNotify();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split("?")[1]);
    const extractedCode = params.get("code");
    setCode(extractedCode as string);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password || !passwordConfirmation) {
      notify("Please enter both password and password confirmation", {
        type: "error",
      });
      return;
    }

    if (password !== passwordConfirmation) {
      notify("Passwords do not match", {
        type: "error",
      });
      return;
    }

    if (!code) {
      notify("Invalid or missing password reset code", {
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      await authProvider.resetUserPassword(code, password, passwordConfirmation);
      notify("Your password has been reset successfully", {
        type: "success",
      });
    } catch (error) {
      notify("Error resetting password. Please resend Auth Code", {
        type: "error",
      });
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
            id="password"
            label="New Password"
            name="password"
            type="password"
            autoComplete="new-password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="passwordConfirmation"
            label="Confirm New Password"
            name="passwordConfirmation"
            type="password"
            autoComplete="new-password"
            variant="outlined"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
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

export default ResetPasswordPage;
