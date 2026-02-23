import "../../style/App.css"
import { motion } from "framer-motion"
import { Card } from "../utils/Card"
import { CardContent } from "../utils/CardContent"

interface StatCardProps {
  title: string
  value: string | number
  desc: string
}

export default function StatCard({ title, value, desc }: StatCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }}>
      <Card className="bg-slate-900 border-slate-800 text-white rounded-2xl shadow-lg">
        <CardContent className="p-6">
          <p className="text-sm text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          <p className="text-xs text-slate-500 mt-2">{desc}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}