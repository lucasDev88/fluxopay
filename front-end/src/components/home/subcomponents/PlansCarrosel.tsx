import { useState } from "react"
import PlanCard from "./planCard"
import { plans } from "../data/Planos"

export default function PlansCarousel() {
  const [index, setIndex] = useState<number>(0)

  function next() {
    setIndex((i) => (i + 1) % plans.length)
  }

  function prev() {
    setIndex((i) => (i - 1 + plans.length) % plans.length)
  }

  return (
    <div className="max-w-xl mx-auto">

      <div className="relative overflow-hidden">

        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {plans.map((plan) => (
            <div key={plan.name} className="w-full shrink-0 p-4">
              <PlanCard plan={plan} />
            </div>
          ))}
        </div>

        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-r-lg"
        >
          ‹
        </button>

        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-l-lg"
        >
          ›
        </button>

      </div>

      <div className="flex justify-center gap-2 mt-4">
        {plans.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full ${
              i === index ? "bg-black w-6" : "bg-gray-400"
            }`}
          />
        ))}
      </div>

    </div>
  )
}
