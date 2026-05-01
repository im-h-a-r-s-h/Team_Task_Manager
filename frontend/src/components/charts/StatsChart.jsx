import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#f97316", "#a855f7"];

const StatsChart = ({ data = [] }) => {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 10, right: 20, left: 30, bottom: 10 }}
          barCategoryGap={20}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={110} />

          <Tooltip />

          <Bar
            dataKey="value"
            barSize={18}   // 🔥 KEY FIX (controls thickness)
            radius={[0, 6, 6, 0]}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;