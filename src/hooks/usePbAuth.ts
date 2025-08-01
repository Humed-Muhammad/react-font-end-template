/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FormErrors } from "@/types";
import { db } from "@/utils/pockatbase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const usePbAuth = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<FormErrors>>({});
  const navigate = useNavigate();
  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrors({});

    try {
      // PocketBase OAuth with Google
      const authData = await db.collection("users").authWithOAuth2({
        provider: "google",
      });

      if (authData) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (error: any) {
      let errorMessage = "Google signup failed. Please try again.";

      if (error.message) {
        errorMessage = error.message;
      }

      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    success,
    errors,
    setErrors,
    setSuccess,
    setLoading,
    handleGoogleAuth,
  };
};
