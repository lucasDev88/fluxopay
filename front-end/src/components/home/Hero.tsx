import { motion } from "framer-motion"
import { ArrowRight, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate()

  return (
    <section id="hero" className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Nova versão com IA avançada disponível
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-[1.1]">
              Gerencie sua renda com{' '}
              <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Inteligência Artificial
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
              Utilize nosso sistema para garantir organização e previsibilidade na sua vida financeira.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button 
                className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-blue-500 transition-all shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer hover:shadow-blue-500/35 hover:-translate-y-0.5"
                onClick={() => navigate("/signup")}
              >
                Começar grátis
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm text-gray-500 font-medium">
              {[
                "14 dias grátis",
                "Sem cartão de crédito",
                "Cancelamento a qualquer momento"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle size={14} className="text-green-600" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto max-w-5xl"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/15 border border-gray-200/80 bg-white">
            <div className="absolute top-0 w-full h-10 bg-gray-100/80 border-b border-gray-200/60 flex items-center px-4 gap-2.5 backdrop-blur-sm">
              <div className="w-3.5 h-3.5 rounded-full bg-red-400/80"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-400/80"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-green-400/80"></div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1759752394755-1241472b589d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmFseXRpY3MlMjBkYXNoYm9hcmQlMjBzY3JlZW58ZW58MXx8fHwxNzcwNjM0Mjk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
              alt="Dashboard do FluxoPay" 
              className="w-full md:w-3/4 lg:w-full mx-auto h-auto pt-10"
            />
          </div>
          
          <div className="absolute -top-8 -right-8 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl -z-10"></div>
        </motion.div>
      </div>
    </section>
  );
}
