import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { signup } from "../../_services/auth";
import { useAuth } from "../../_services/authContext";

export function SignUpCard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false) 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setError] = useState("")

  const navigate = useNavigate()
  const { setLogged } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true)
    setError("")

    try {
      await signup({
        name: name,
        email: email,
        password: password
      })

      setLogged(true)
      navigate("/dashboard")
    } catch (err) {
      setError(`Erro ao criar conta: ${err}`)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl font-extrabold text-blue-700">FluxoPay</h1>
          </div>
          <p className="text-slate-500 mt-2">Criar conta</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Nome
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              placeholder="voce@email.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 shadow-lg shadow-blue-700/30 transition"
          >
            { loading ? "Criando..." : "Criar conta" }
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-xs text-slate-400">ou</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <button onClick={() => {
          navigate("/login")
        }} className="w-full rounded-xl border border-slate-300 py-3 font-medium hover:bg-slate-50 transition">
          Entrar na conta
        </button>
      </div>

      <p className="text-center text-xs text-slate-500 mt-6">
        © {new Date().getFullYear()} FluxoPay — FinTech
      </p>
    </motion.div>
  );
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-200 flex items-center justify-center px-4">
      <SignUpCard />
    </div>
  );
}
