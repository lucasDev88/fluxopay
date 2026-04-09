import { Menu, X } from "lucide-react";
import "../../style/App.css"
import { useState } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const [ isOpen, setIsOpen ] = useState(false);

    const navigate = useNavigate()

    const navLinks = [
      { href: "#hero", label: "Início" },
      { href: "#beneficios", label: "Benefícios" },
      { href: "#depoimentos", label: "Depoimentos" },
      { href: "#planos", label: "Planos" },
    ]

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex justify-between h-16 items-center">
                    
                    <div className="shrink-0 flex items-center">

                        <span className="text-2xl font-bold bg-linear-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                          FluxoPay
                        </span>

                    </div>

                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                          <a 
                            key={link.href} 
                            href={link.href} 
                            className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-200"
                          >
                            {link.label}
                          </a>
                        ))}

                        <button onClick={() => navigate("/login")} className="px-5 py-2 text-gray-600 font-medium hover:text-blue-700 hover:bg-blue-50/50 rounded-lg transition-all duration-200">
                            Entrar
                        </button>
                        <button onClick={() => navigate("/signup")} className="ml-2 bg-linear-to-r from-blue-700 to-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-500 transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 cursor-pointer">
                            Cadastrar
                        </button>

                    </div>

                    <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <a 
                  key={link.href}
                  href={link.href} 
                  onClick={() => setIsOpen(false)} 
                  className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 space-y-3">
                <button 
                  onClick={() => { setIsOpen(false); navigate("/login"); }}
                  className="w-full bg-white text-gray-700 border border-gray-200 px-5 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Entrar
                </button>
                <button 
                  onClick={() => { setIsOpen(false); navigate("/signup"); }}
                  className="w-full bg-linear-to-r from-blue-700 to-blue-600 text-white px-5 py-3.5 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-500 transition-all shadow-lg"
                >
                  Cadastrar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
