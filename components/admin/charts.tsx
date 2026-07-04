"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const TEAL = "#1C7293";
const GOLD = "#D4AF37";
const PIE_COLORS = ["#1A6B5C", "#1C7293", "#D4AF37", "#9FC9C1"];

export function RevenueTrendChart({ data }: { data: { month: string; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#DCE6E4" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#5B6B6B" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#5B6B6B" }} axisLine={false} tickLine={false} width={40} />
        <Tooltip
          contentStyle={{ borderRadius: 12, borderColor: "#DCE6E4", fontSize: 12 }}
          formatter={(v: number) => [`GHS ${v.toLocaleString()}`, "Revenue"]}
        />
        <Line type="monotone" dataKey="revenue" stroke={TEAL} strokeWidth={3} dot={{ r: 4, fill: TEAL }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function BranchDistributionChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          iconType="circle"
          wrapperStyle={{ fontSize: 12, color: "#16302E" }}
        />
        <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#DCE6E4", fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
