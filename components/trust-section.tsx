import { Shield, CheckCircle } from "lucide-react";

export default function TrustSection() {
  return (
    <section className="py-16 sm:py-24 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* CTA Card */}
        <div
          className="
            relative overflow-hidden rounded-3xl
            bg-[#262626]
            px-5 sm:px-8 md:px-12
            py-10 sm:py-12 md:py-16
            mb-16 sm:mb-20
            w-full
            max-w-[90rem]
            mx-auto
          "
        >
          {/* Decorative elements */}
          <div className="absolute -left-16 -top-16 w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full bg-[#676565] opacity-20" />
          <div className="absolute -right-10 -bottom-10 w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full bg-[#8e8b8b] opacity-10" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 text-center md:text-left">
            <div>
              <h3 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                Ready to know more?
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-[#A6A6A6] max-w-xl">
                Get in touch with us today to learn more about our product and
                how it can benefit your business.
              </p>
            </div>

            <button className="flex-shrink-0 rounded-full bg-white px-7 sm:px-8 py-3 text-sm sm:text-base text-black font-semibold hover:bg-gray-200 transition">
              Get In Touch
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="mb-5 inline-block rounded-full bg-black/5 px-4 py-2">
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#737373] uppercase">
              Trusted by 300+ Pharmacies
            </p>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-black">
            Trusted Compliance
          </h2>
        </div>

        {/* Trust Cards */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 max-w-3xl mx-auto">
          <div className="rounded-xl border border-[#E5E7EB] p-6 sm:p-8 transition bg-[#262626]">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-lg bg-white/10">
                <Shield size={26} className="text-[#A6A6A6]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                HIPAA Compliant
              </h3>
            </div>

            <p className="text-sm sm:text-base text-[#737373]">
              Full healthcare data protection with industry-leading security standards.
            </p>
          </div>

          <div className="rounded-xl border border-[#E5E7EB] p-6 sm:p-8 transition bg-[#262626]">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-lg bg-white/10">
                <CheckCircle size={26} className="text-[#A6A6A6]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                SOC 2 Type II
              </h3>
            </div>

            <p className="text-sm sm:text-base text-[#737373]">
              Enterprise security standards with comprehensive compliance audit certifications.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-bold text-black">300+</p>
            <p className="text-[#737373] mt-2 text-sm sm:text-base">
              Pharmacies Trusting Us
            </p>
          </div>

          <div>
            <p className="text-3xl sm:text-4xl font-bold text-black">99.9%</p>
            <p className="text-[#737373] mt-2 text-sm sm:text-base">
              System Uptime
            </p>
          </div>

          <div>
            <p className="text-3xl sm:text-4xl font-bold text-black">24/7</p>
            <p className="text-[#737373] mt-2 text-sm sm:text-base">
              Dedicated Support
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
