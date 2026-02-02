import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

// --- 1. DEFINIMOS LOS TIPOS CORRECTOS ---
interface Transaction {
  id: string;
  amount: number;
  type: "INGRESO" | "EGRESO";
  date: string;
  concept: string;
  user: { name: string; email: string };
}

interface ReportData {
  stats: { totalIncome: number; totalExpense: number; balance: number };
  transactions: Transaction[];
}

// Tipo estricto para las Props de la página (Adiós 'any')
interface ReportsPageProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function ReportsPage({ user }: ReportsPageProps) {
  const [data, setData] = useState<ReportData | null>(null);

  useEffect(() => {
    fetch("/api/admin/reports")
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const downloadCSV = () => {
    if (!data) return;
    const headers = ["ID,Fecha,Usuario,Concepto,Tipo,Monto"];
    const rows = data.transactions.map(t => 
      `${t.id},${new Date(t.date).toISOString().split('T')[0]},"${t.user.name}",${t.concept},${t.type},${t.amount}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reporte_financiero.csv");
    document.body.appendChild(link);
    link.click();
  };

  const chartData = [
    { name: 'Ingresos', valor: data?.stats.totalIncome || 0, fill: '#16a34a' },
    { name: 'Egresos', valor: data?.stats.totalExpense || 0, fill: '#dc2626' },
  ];

  if (!data) return (
    <DashboardLayout userRole={user.role}>
        <div className="p-10 text-center text-slate-500">Cargando reportes...</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout userRole={user.role}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reportes Financieros</h1>
          <p className="text-slate-500">Vista global del estado del sistema.</p>
        </div>
        <Button onClick={downloadCSV} className="bg-black text-white gap-2 hover:bg-slate-800">
          <Download size={18} /> Descargar CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <TrendingUp className="text-green-500" size={20}/>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">${data.stats.totalIncome.toLocaleString()}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Egresos Totales</CardTitle>
            <TrendingDown className="text-red-500" size={20}/>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-600">${data.stats.totalExpense.toLocaleString()}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Balance Neto</CardTitle>
            <DollarSign className="text-blue-500" size={20}/>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-blue-600">${data.stats.balance.toLocaleString()}</div></CardContent>
        </Card>
      </div>

      <Card className="h-96">
        <CardHeader><CardTitle>Comparativa Global</CardTitle></CardHeader>
        <CardContent className="h-full pb-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number | undefined) => [`$${Number(value || 0).toLocaleString()}`, "Monto"]} />
              <Legend />
              <Bar dataKey="valor" radius={[4, 4, 0, 0]} barSize={100} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(ctx.req.headers) });
  if (!session || session.user.role !== "ADMIN") {
    return { redirect: { destination: "/dashboard/transactions", permanent: false } };
  }
  return { props: { user: JSON.parse(JSON.stringify(session.user)) } };
};