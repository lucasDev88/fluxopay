import { Card } from "../utils/Card";
import { CardContent } from "../utils/CardContent";

interface PlanBoxProps {
  name: string;
  features: string[];
}

function PlanBox({ name, features }: PlanBoxProps) {
  return (
    <Card className="text-white">
      <CardContent>
        <h3 className="text-lg font-bold mb-4">Plano {name}</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          {features.map((f: string, i: number) => (
            <li key={i}>• {f}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default PlanBox