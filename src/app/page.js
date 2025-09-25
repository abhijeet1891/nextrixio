import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-5xl font-bold mb-4">Welcome to Nextrixio</h1>
      <p className="mb-6 text-lg">Monitor your APIs, track uptime, response times, and get alerts instantly.</p>
      <div className="space-x-4">
        <Link href="/signup" className="px-6 py-3 bg-blue-600 text-white rounded">Sign Up</Link>
        <Link href="/login" className="px-6 py-3 border rounded">Login</Link>
      </div>
    </div>
  );
}
