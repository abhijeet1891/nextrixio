export default function AccountPage() {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Account Settings</h1>
        <form className="flex flex-col max-w-sm space-y-4">
          <input type="text" placeholder="Name" className="border p-2 rounded" />
          <input type="email" placeholder="Email" className="border p-2 rounded" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
        </form>
      </div>
    );
  }
  