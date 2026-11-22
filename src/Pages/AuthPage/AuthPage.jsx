import  { useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";


export const AuthPage = ({ onSuccess }) => {
  const { user, login, createUser, logout } = useAuth();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (mode === "create") {
        await createUser(name, email, password, role);
        setSuccessMsg("User created and logged in successfully!");
      } else {
        await login(email, password);
        setSuccessMsg("Logged in successfully!");
      }
      setName("");
      setEmail("");
      setPassword("");
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow bg-white space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {mode === "create" ? "Create User" : "User Login"}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
              setSuccessMsg("");
            }}
            className={`px-3 py-1 rounded text-sm ${
              mode === "login" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("create");
              setError("");
              setSuccessMsg("");
            }}
            className={`px-3 py-1 rounded text-sm ${
              mode === "create" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            Create User
          </button>
        </div>
      </div>

      {user && (
        <div className="p-3 rounded bg-blue-50 text-sm flex items-center justify-between">
          <div>
            Active User: <strong>{user.name}</strong> ({user.email})
          </div>
          <button
            type="button"
            onClick={logout}
            className="text-red-600 underline text-xs"
          >
            Logout
          </button>
        </div>
      )}

      {error && <div className="p-2.5 rounded bg-red-100 text-red-700 text-sm">{error}</div>}
      {successMsg && (
        <div className="p-2.5 rounded bg-green-100 text-green-700 text-sm">{successMsg}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "create" && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border px-3 py-2 rounded bg-white"
            >
              <option value="user">User</option>
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </>
        )}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded font-medium"
        >
          {loading
            ? "Please wait..."
            : mode === "create"
            ? "Create User"
            : "Login"}
        </button>
      </form>
    </div>
  );
};