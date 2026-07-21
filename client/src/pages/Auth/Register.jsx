import { useState } from "react";
import { Mail, User, ArrowRight } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import SocialLogin from "../../components/auth/SocialLogin.jsx";
import Input from "../../components/ui/Input.jsx";
import PasswordInput from "../../components/ui/PasswordInput.jsx";
import PasswordStrength from "../../components/auth/PasswordStrength.jsx";
import Checkbox from "../../components/ui/Checkbox.jsx";
import Button from "../../components/ui/Button.jsx";
import Divider from "../../components/ui/Divider.jsx";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm your password.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!values.acceptTerms) {
    errors.acceptTerms = "You must accept the Terms & Conditions to continue.";
  }

  return errors;
}

const initialValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

export default function Register({ onNavigateLogin }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function updateField(field, value) {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    if (touched[field] || (field === "password" && touched.confirmPassword)) {
      setErrors(validate(nextValues));
    }
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(values));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true, acceptTerms: true });
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
try {
  const response = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: values.fullName,
      email: values.email,
      password: values.password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong. Try again.");
  }

  localStorage.setItem("token", data.token);
  // navigate("/dashboard") or onNavigateLogin() to send them to sign in
} catch (err) {
  setSubmitError(err.message || "Something went wrong while creating your account. Try again.");
} finally {
  setSubmitting(false);
} 
  }

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create your account"
      description="Spin up a workspace with cloud environments and an AI pair programmer built in."
      footer={
        <>
          Already have an account?{" "}
          <button
            type="button"
            onClick={onNavigateLogin}
            className="font-medium text-ink underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ink/15 rounded"
          >
            Login
          </button>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {submitError && (
          <div className="rounded-xl border border-danger/20 bg-danger-soft px-3.5 py-2.5 text-[13.5px] text-danger" role="alert">
            {submitError}
          </div>
        )}

        <Input
          label="Full name"
          id="register-name"
          type="text"
          icon={User}
          required
          autoComplete="name"
          placeholder="Ada Lovelace"
          value={values.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          onBlur={() => handleBlur("fullName")}
          error={touched.fullName ? errors.fullName : undefined}
        />

        <Input
          label="Email"
          id="register-email"
          type="email"
          icon={Mail}
          required
          autoComplete="email"
          placeholder="you@company.com"
          value={values.email}
          onChange={(e) => updateField("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          error={touched.email ? errors.email : undefined}
        />

        <div>
          <PasswordInput
            id="register-password"
            required
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={values.password}
            onChange={(e) => updateField("password", e.target.value)}
            onBlur={() => handleBlur("password")}
            error={touched.password ? errors.password : undefined}
          />
          <PasswordStrength password={values.password} />
        </div>

        <PasswordInput
          label="Confirm password"
          id="register-confirm-password"
          required
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={values.confirmPassword}
          onChange={(e) => updateField("confirmPassword", e.target.value)}
          onBlur={() => handleBlur("confirmPassword")}
          error={touched.confirmPassword ? errors.confirmPassword : undefined}
        />

        <Checkbox
          label={
            <>
              I agree to the{" "}
              <a href="#" className="font-medium text-ink underline-offset-4 hover:underline">
                Terms &amp; Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="font-medium text-ink underline-offset-4 hover:underline">
                Privacy Policy
              </a>
              .
            </>
          }
          checked={values.acceptTerms}
          onChange={(e) => updateField("acceptTerms", e.target.checked)}
          error={touched.acceptTerms ? errors.acceptTerms : undefined}
        />

        <Button type="submit" loading={submitting} icon={!submitting ? ArrowRight : undefined}>
          Create account
        </Button>

        <Divider>or continue with</Divider>

        <SocialLogin label="Sign up" />
      </form>
    </AuthLayout>
  );
}
