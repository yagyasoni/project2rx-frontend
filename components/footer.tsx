import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white py-13">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid md:grid-cols-2 gap-12 pb-12">

          {/* Left Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-neutral-900 font-bold text-lg">✕</span>
              </div>
              <h3 className="text-2xl font-bold tracking-wide">MedRx.co</h3>
            </div>

            <p className="text-neutral-300 max-w-sm">
              Streamline your audit process with our all-in-one tool designed specifically for pharmacies.
            </p>
          </div>

          {/* Right Section */}
          <div className="flex justify-end items-start">
            <div>
              <h4 className="text-lg font-semibold mb-6 uppercase tracking-wider text-neutral-200">
                Pages
              </h4>

              <div className="space-y-3">
                <Link href="/" className="block text-neutral-400 hover:text-white transition">
                  Home
                </Link>

                <Link href="/trust" className="block text-neutral-400 hover:text-white transition">
                  Trust
                </Link>

                <button className="text-neutral-400 hover:text-white transition">
                  Request Demo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-neutral-400 text-sm">
            © 2025 BatchRx. All rights reserved.
          </p>

          <div className="flex gap-8 text-neutral-400 text-sm">
            <Link href="#" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
