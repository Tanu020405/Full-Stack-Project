import { useState } from "react";
import { gql, useMutation } from "@apollo/client";

const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    registerUser(input: $input) {
      token
    }
  }
`;

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [register, { loading, error }] = useMutation(REGISTER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register({ variables: { input: form } });
    localStorage.setItem("token", res.data.registerUser.token);
    window.location.href = "/";
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-slate-700 mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Full Name"
            className="border border-slate-300 rounded px-3 py-2 focus:ring-2 focus:ring-slate-400"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

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
          >
            {loading ? "Creating..." : "Register"}
          </button>

          {error && <p className="text-red-500">{error.message}</p>}
        </form>
      </div>
    </div>
  );
}
