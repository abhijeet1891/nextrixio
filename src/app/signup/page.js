"use client";
import { useState } from "react";
import { addUser } from "../../services/db/apiService";
import { getAuthClient } from "../../services/db/authClient";
export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = getAuthClient();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) throw authError;

      const user = authData.user;
      if (!user) {
        throw new Error("Sign-up failed: User data missing.");
      }
      await addUser(supabase, {
        id: user.id,
        name,
        email,
        plan: "free",
        createdAt: new Date().toISOString(),
      });
      alert("Signup successful!");
    } catch (err) {
      console.error("Signup error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <h2 className="text-3xl font-bold mb-6">Sign Up</h2>
      <form
        className="flex flex-col w-full max-w-sm space-y-4"
        onSubmit={handleSignup}
      >
        <input
          type="text"
          placeholder="Name"
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
