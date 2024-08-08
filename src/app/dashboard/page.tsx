import Layout from "@/app/components/Layout";

export default function Dashboard() {
  return (
    <main className="bg-[#111827] min-h-screen text-white">
      <Layout>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <p>Welcome to your dashboard!</p>
          {/* Add additional content and styling here */}
        </div>
      </Layout>
    </main>
  );
}
