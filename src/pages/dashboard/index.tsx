import React from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  User, 
  ArrowRight 
} from "lucide-react";

interface PageProps {
  user: {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "USER";
  };
}

export default function DashboardHome({ user }: PageProps) {
  
  // Definimos las tarjetas disponibles
  const actions = [
    {
      title: "Ingresos y Gastos",
      desc: "Registra movimientos y consulta tu historial.",
      href: "/dashboard/transactions",
      icon: <LayoutDashboard className="h-8 w-8 text-green-600" />,
      color: "hover:border-green-200 hover:bg-green-50",
      adminOnly: false
    },
    {
      title: "Mi Perfil",
      desc: "Actualiza tus datos o gestiona tu cuenta.",
      href: "/dashboard/profile",
      icon: <User className="h-8 w-8 text-blue-600" />,
      color: "hover:border-blue-200 hover:bg-blue-50",
      adminOnly: false
    },
    {
      title: "Gestión de Usuarios",
      desc: "Administra roles y accesos a la plataforma.",
      href: "/dashboard/users",
      icon: <Users className="h-8 w-8 text-purple-600" />,
      color: "hover:border-purple-200 hover:bg-purple-50",
      adminOnly: true
    },
    {
      title: "Reportes Financieros",
      desc: "Visualiza gráficas y descarga balances.",
      href: "/dashboard/reports",
      icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
      color: "hover:border-orange-200 hover:bg-orange-50",
      adminOnly: true
    }
  ];

  return (
    <DashboardLayout userRole={user.role}>
      <div className="space-y-8">
        
        {/* ENCABEZADO DE BIENVENIDA */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            ¡Bienvenido de nuevo, {user.name}! 👋
          </h1>
          <p className="text-slate-500 text-lg">
            Panel de control principal. Tienes acceso de tipo <span className="font-bold text-black bg-slate-100 px-2 py-0.5 rounded-md text-sm uppercase">{user.role}</span>.
          </p>
        </div>

        {/* GRID DE TARJETAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action, index) => {
            // Si la tarjeta es solo para Admin y el usuario no lo es, no la mostramos
            if (action.adminOnly && user.role !== "ADMIN") return null;

            return (
              <Link key={index} href={action.href} className="block group">
                <Card className={`h-full transition-all duration-300 border-slate-200 group-hover:shadow-lg ${action.color} group-hover:-translate-y-1`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                        {action.icon}
                      </div>
                      <ArrowRight className="text-slate-300 group-hover:text-slate-600 transition-colors" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="mb-2 text-xl font-bold text-slate-800">
                      {action.title}
                    </CardTitle>
                    <CardDescription className="text-slate-500 font-medium">
                      {action.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

      </div>
    </DashboardLayout>
  );
}

// SSR PROTECTIVO
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(ctx.req.headers),
  });

  if (!session) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return {
    props: {
      user: JSON.parse(JSON.stringify(session.user)),
    },
  };
};