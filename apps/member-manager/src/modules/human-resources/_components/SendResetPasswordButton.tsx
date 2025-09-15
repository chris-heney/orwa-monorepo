import React from "react";
import { useAuthProvider, useNotify } from "react-admin";
import { Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import LockResetIcon from '@mui/icons-material/LockReset';

const SendResetPasswordButton = ({ email, isSmall }: { email: string, isSmall?: boolean }) => {
  const notify = useNotify();
  const authProvider = useAuthProvider();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!email) {
      notify("Please make sure an email is attached", { type: "error" });
      return;
    }

    setLoading(true); // Start loading

    try {
      await authProvider.sendResetPasswordEmail(email);
      notify(`Password reset link has been sent to ${email}`, {
        type: "success",
      });
    } catch (error) {
      notify("Error sending reset password link. Please try again.", {
        type: "error",
      });
    } finally {
      setLoading(false); // Stop loading after submission
    }
  };

  return isSmall ? (
    <Tooltip title="Send Reset Password">
      <span>
        <IconButton
          size="small"
          onClick={handleSubmit}
          disabled={loading}
          color="primary"
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <LockResetIcon />
          )}
        </IconButton>
      </span>
    </Tooltip>
  ) : (
    <Button
      variant="contained"
      size="small"
      endIcon={<LockResetIcon />}
      onClick={handleSubmit}
      disabled={loading}
    >
      {loading ? (
        <CircularProgress
          sx={{
            color: "white",
          }}
          size={24}
        />
      ) : (
        "Send Reset Password Link"
      )}
    </Button>
  );
};

export default SendResetPasswordButton;