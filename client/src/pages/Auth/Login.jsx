import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import SocialLogin from "../../components/auth/SocialLogin.jsx";
import Input from "../../components/ui/Input.jsx";
import PasswordInput from "../../components/ui/PasswordInput.jsx";
import Checkbox from "../../components/ui/Checkbox.jsx";
import Button from "../../components/ui/Button.jsx";
import Divider from "../../components/ui/Divider.jsx";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  }

  return errors;
}

export default function Login({ onNavigateRegister }) {
  const [values, setValues] = useState({ email: "", password: "", remember: false });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function updateField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => ({ ...validate({ ...values, [field]: value }) }));
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
    setTouched({ email: true, password: true });
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
try {
  const response = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: values.email,
      password: values.password,
    }),
  });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Invalid email or password.");
    }

    // Example: store the token and redirect
    localStorage.setItem("token", data.token);
    // navigate("/dashboard") — if you're using react-router
  } catch (err) {
    setSubmitError(err.message || "Something went wrong while signing you in. Try again.");
  } finally {
    setSubmitting(false);
  }
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your workspace"
      description="Pick up where you left off — your environments, agents, and repos are right where you left them."
      footer={
        <>
          Don&rsquo;t have an account?{" "}
          <button
            type="button"
            onClick={onNavigateRegister}
            className="font-medium text-ink underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ink/15 rounded"
          >
            Register
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
          label="Email"
          id="login-email"
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
            id="login-password"
            required
            autoComplete="current-password"
            placeholder="Enter your password"
            value={values.password}
            onChange={(e) => updateField("password", e.target.value)}
            onBlur={() => handleBlur("password")}
            error={touched.password ? errors.password : undefined}
          />
        </div>

        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            checked={values.remember}
            onChange={(e) => updateField("remember", e.target.checked)}
          />
          <button
            type="button"
            className="text-[13.5px] font-medium text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ink/15 rounded"
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" loading={submitting} icon={!submitting ? ArrowRight : undefined}>
          Sign in
        </Button>

        <Divider>or continue with</Divider>

        <SocialLogin label="Sign in" />
      </form>
    </AuthLayout>
  );
}
