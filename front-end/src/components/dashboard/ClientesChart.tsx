import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import "../../style/App.css"
import { Card } from "../utils/Card"
import { CardContent } from "../utils/CardContent"

function ClientsChart() {
  const data = [
    { month: "Jan", clientes: 40 },
    { month: "Fev", clientes: 65 },
    { month: "Mar", clientes: 90 },
    { month: "Abr", clientes: 120 },
    { month: "Mai", clientes: 150 },
    { month: "Jun", clientes: 210 },
  ]

  return (
    <Card className="text-white">
      <CardContent>
        <h3 className="font-bold mb-4">Crescimento de clientes</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clientes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default ClientsChart