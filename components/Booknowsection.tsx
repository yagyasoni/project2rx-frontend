export default function BookNowSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-10 bg-white">
      <div className="mx-auto max-w-[93rem] px-4 sm:px-6 lg:px-8">

        <div
          className="
            relative overflow-hidden rounded-3xl
            bg-[#262626]
            px-5 sm:px-8 md:px-12
            py-14 sm:py-18 md:py-24
          "
        >

          {/* Decorative circles */}
          <div className="absolute -left-8 -top-8 w-36 h-36 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full bg-[#404040] opacity-20" />

          <div className="absolute -right-6 -bottom-6 w-48 h-48 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full bg-[#404040] opacity-10" />

          <div className="absolute right-4 top-[60%] w-24 h-24 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full bg-[#737373] opacity-10" />

          {/* Content */}
          <div className="relative text-center">

            {/* Tag */}
            <div className="mb-4 sm:mb-5 inline-block rounded-full bg-white/10 px-4 py-2">
              <p className="text-xs sm:text-sm font-semibold tracking-wider text-white uppercase">
                Book Now
              </p>
            </div>

            {/* Heading */}
            <h2 className="text-[22px] sm:text-3xl md:text-5xl font-bold text-white mb-4 sm:mb-6 leading-snug">
              Dedicated Support.
              <br className="hidden sm:block" />
              Every Client. Every Time.
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-[#A6A6A6] mb-7 sm:mb-8 max-w-[92%] sm:max-w-xl md:max-w-2xl mx-auto leading-relaxed">
              Get access to our expert team that&apos;s committed to your success.
              We&apos;re here to support every step of your journey.
            </p>

            {/* Button */}
            <button
              className="
                rounded-full
                bg-[#0D0D0D]
                px-7 sm:px-8
                py-3
                text-sm sm:text-base
                text-white
                font-semibold
                hover:bg-black
                transition
              "
            >
              Request Demo
            </button>

          </div>
        </div>
      </div>
    </section>
  )
}
