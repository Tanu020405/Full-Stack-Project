import { useState } from "react";
import { gql, useMutation } from "@apollo/client";

const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    loginUser(input: $input) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [login, { loading, error }] = useMutation(LOGIN);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login({ variables: { input: form } });
    localStorage.setItem("token", res.data.loginUser.token);
    window.location.href = "/";
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-slate-700 mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email"
            className="border border-slate-300 rounded px-3 py-2 focus:ring-2 focus:ring-slate-400"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border border-slate-300 rounded px-3 py-2 focus:ring-2 focus:ring-slate-400"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button
            type="submit"
            className="bg-slate-600 hover:bg-slate-700 text-white p-2 rounded transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <p className="text-red-500 text-sm">{error.message}</p>}
        </form>
      </div>
    </div>
  );
}
