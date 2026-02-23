import PlansCarousel from "./subcomponents/PlansCarrosel";

const stats = [
  { value: "10k+", label: "Clientes Ativos" },
  { value: "98%", label: "Satisfação" },
  { value: "24/7", label: "Suporte" },
  { value: "50M+", label: "Leads Gerados" },
];

export default function Plans() {
  return (
    <section
      id="plans"
      className="py-24 text-white bg-blue-950 overflow-hidden"
    >
      <div className="justify-center items-center text-center">
        <p className="text-white py-4 text-5xl font-serif">PLANOS</p>
      </div>

      <PlansCarousel />

      <br />
      <br />
      <br />

      <div className="justify-center items-center text-center">
        <p className="text-white py-4 text-5xl font-serif">STATUS</p>
      </div>

      <br />
      <br />
      <br />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-blue-950 pb-16 mb-20">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">
              {stat.value}
            </div>
            <div className="text-gray-400 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
