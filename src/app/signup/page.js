export default function SignupPage() {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4">
        <h2 className="text-3xl font-bold mb-6">Sign Up</h2>
        <form className="flex flex-col w-full max-w-sm space-y-4">
          <input type="text" placeholder="Name" className="border p-2 rounded" />
          <input type="email" placeholder="Email" className="border p-2 rounded" />
          <input type="password" placeholder="Password" className="border p-2 rounded" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Sign Up</button>
        </form>
      </div>
    );
  }
  