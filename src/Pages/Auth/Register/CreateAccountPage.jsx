import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../../Contexts/AuthContext";
import { AuthAlerts } from "../Shared/AuthAlerts";
import { AuthCardLayout } from "../Shared/AuthCardLayout";
import { RegisterForm } from "./RegisterForm";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  agreed: true,
};

export const CreateAccountPage = ({ onSuccess, onSwitchToLogin }) => {
  const { createUser } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    if (form.password !== form.confirmPassword) {
      return setError("Password and confirm password do not match");
    }
    if (!form.agreed) {
      return setError("Please agree to the Terms of Service & Privacy Policy");
    }

    setLoading(true);
    try {
      const payload = {
        name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        clientOrigin: window.location.origin,
      };

      const result = await createUser(payload);

      setSuccessMsg(
        result?.message ||
          "Account created! Verification link sent to your email. Account remains pending until admin assigns your role."
      );
      setForm(INITIAL_FORM);
      onSuccess?.(result);
    } catch (err) {
      setError(err?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCardLayout title="SIGN UP" className="py-9">
      <div className="mt-4">
        <AuthAlerts error={error} successMsg={successMsg} />
        <RegisterForm
          form={form}
          onChange={handleFieldChange}
          loading={loading}
          onSubmit={handleSubmit}
        />
        <p className="mt-6 text-center text-[12.5px] text-[#9ca3af]">
          Already have an account?{" "}
          <Link
            to="/login"
            onClick={onSwitchToLogin}
            className="text-[#1588d8] hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthCardLayout>
  );
};