import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function Documentation() {
  return (
    <>
      <Navbar />
      <section
        className="min-h-screen py-24"
        style={{
          background:
            "linear-gradient(180deg, hsl(0 0% 5%) 0%, hsl(0 0% 15%) 50%, hsl(0 0% 5%) 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-6 text-white">Documentation</h1>
          <p className="text-sm text-gray-400 mb-10">
            Welcome to the AuditProRx documentation!
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
