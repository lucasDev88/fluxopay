import { motion } from "framer-motion"

const testimonials = [
  {
    name: "Rafael Mendes",
    role: "Freelance Designer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    content:
      "Finalmente consigo prever meus meses ruins. O score de estabilidade mudou a forma como organizo minha renda.",
  },
  {
    name: "Camila Rocha",
    role: "Criadora Digital",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    content:
      "A previsão de receita me dá clareza para tomar decisões antes do problema acontecer.",
  },
  {
    name: "Eduardo Silva",
    role: "Microempresário",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    content:
      "FluxoPay parece um analista financeiro dentro do meu negócio.",
  },
]

export default function ComentsCard() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          O que nossos usuários dizem
        </h2>
        <p className="text-blue-200/70 mb-16">
          Validação real de quem vive de renda variável.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 hover:border-blue-500/30 transition"
            >
              <div className="mb-4 text-yellow-400 text-lg">
                ⭐⭐⭐⭐⭐
              </div>

              <p className="text-blue-200/70 mb-6 text-sm leading-relaxed">
                "{t.content}"
              </p>

              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30" />
                <div>
                  <p className="text-white font-semibold">{t.name}</p>
                  <p className="text-blue-200/60 text-sm">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}