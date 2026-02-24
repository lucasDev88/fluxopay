import { motion } from "framer-motion"

const testimonials = [
  {
    name: "Rafael Mendes",
    role: "Freelance Designer",
    content:
      "Finalmente consigo prever meus meses ruins. O score de estabilidade mudou a forma como organizo minha renda.",
  },
  {
    name: "Camila Rocha",
    role: "Criadora Digital",
    content:
      "A previsão de receita me dá clareza para tomar decisões antes do problema acontecer.",
  },
  {
    name: "Eduardo Silva",
    role: "Microempresário",
    content:
      "FluxoPay parece um analista financeiro dentro do meu negócio.",
  },
]

export default function ComentsCard() {
  return (
    <section className="py-20 px-6 bg-linear-to-b from-black to-zinc-900">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          O que nossos usuários dizem
        </h2>
        <p className="text-zinc-400 mb-16">
          Validação real de quem vive de renda variável.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="bg-zinc-800/60 backdrop-blur-lg p-6 rounded-2xl border border-zinc-700 hover:border-indigo-500 transition"
            >
              <div className="mb-4 text-yellow-400 text-lg">
                ⭐⭐⭐⭐⭐
              </div>

              <p className="text-zinc-300 mb-6 text-sm leading-relaxed">
                "{t.content}"
              </p>

              <div className="text-left">
                <p className="text-white font-semibold">{t.name}</p>
                <p className="text-zinc-500 text-sm">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}