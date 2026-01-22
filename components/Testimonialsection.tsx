"use client"

import { useRef, useEffect } from "react"
import { Star } from "lucide-react"

const testimonialData = [
  {
    id: 1,
    text: "BatchRx has been a game-changer for our pharmacy. The user-friendly interface and accurate reporting have revolutionized our compliance process.",
    author: "Alex",
    pharmacy: "Springfield Pharmacy",
  },
  {
    id: 2,
    text: "BatchRx simplifies our entire audit process. It’s incredibly straightforward to use, and the peace of mind knowing we’re compliant is invaluable.",
    author: "Eli",
    pharmacy: "Manhattan Pharmacy",
  },
  {
    id: 3,
    text: "As a busy pharmacy owner, I appreciate how BatchRx simplifies our audit process and protects us from compliance risks.",
    author: "Jake",
    pharmacy: "Bronx Pharmacy",
  },
  {
    id: 4,
    text: "BatchRx is a game-changer for my 12-pharmacy network. I can oversee all locations from one dashboard.",
    author: "David",
    pharmacy: "NY State Pharmacy Group",
  },
  {
    id: 5,
    text: "The automation has reduced our audit preparation time by more than 60%.",
    author: "Jennifer",
    pharmacy: "Downtown Medical Pharmacy",
  },
]

const TestimonialCard = ({
  testimonial,
}: {
  testimonial: typeof testimonialData[0]
}) => (
  <div
    className="
      w-[90vw] sm:w-[420px] lg:w-[520px]
      flex-shrink-0
      rounded-3xl
      p-6 sm:p-10 lg:p-14
      border border-neutral-300
      shadow-[0_30px_70px_rgba(0,0,0,0.18)]
      bg-gradient-to-r
      from-neutral-900
      via-neutral-800
      to-neutral-700
    "
  >
    <p className="text-sm sm:text-base lg:text-lg leading-7 sm:leading-8 lg:leading-9 mb-6 sm:mb-8 lg:mb-10 max-w-[90%] text-white">
      “{testimonial.text}”
    </p>

    <div className="flex flex-col gap-1 sm:gap-2">
      <p className="font-semibold text-white text-base sm:text-lg lg:text-xl">
        {testimonial.author}
      </p>

      <p className="text-neutral-200 text-sm sm:text-base mb-3 sm:mb-4">
        {testimonial.pharmacy}
      </p>

      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className="fill-white text-white"
          />
        ))}
      </div>
    </div>
  </div>
)

export default function TestimonialSection() {
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    let scroll = 0

    const interval = setInterval(() => {
      scroll += 0.6
      slider.scrollLeft = scroll

      if (scroll >= slider.scrollWidth / 2) {
        scroll = 0
      }
    }, 18)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="-mt-20 py-20 sm:py-28 lg:py-40 overflow-hidden">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-16 sm:mb-20 lg:mb-24">
        <span className="inline-block rounded-full border border-neutral-300 px-6 py-2 text-sm font-semibold tracking-wider text-neutral-700 uppercase mb-6 bg-white">
          Testimonials
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-[56px] leading-tight lg:leading-[68px] font-bold text-neutral-900 mb-8 lg:mb-10">
          Trusted by pharmacies nationwide
        </h2>

        <button
          className="
            rounded-full
            border border-neutral-900
            px-10 py-3 sm:px-12 sm:py-4
            text-neutral-900
            font-semibold
            hover:bg-black
            hover:text-white
            transition
          "
        >
          Request Demo
        </button>
      </div>

      {/* SLIDER */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div
          ref={sliderRef}
          className="flex gap-6 sm:gap-10 lg:gap-14 overflow-x-hidden px-4 sm:px-10 lg:px-16"
        >
          {[...testimonialData, ...testimonialData].map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>
      </div>

    </section>
  )
}
