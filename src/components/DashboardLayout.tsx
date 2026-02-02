import React, { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "@/lib/auth-client";
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  LogOut, 
  Wallet,
  Home,
  User,
  ChevronRight
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole?: string;
}

export default function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const router = useRouter();

  const menuItems = [
    {
      label: "Inicio",
      href: "/dashboard",
      icon: <Home size={18} />,
      adminOnly: false,
    },
    {
      label: "Ingresos y Gastos",
      href: "/dashboard/transactions",
      icon: <LayoutDashboard size={18} />,
      adminOnly: false,
    },
    {
      label: "Mi Perfil",
      href: "/dashboard/profile",
      icon: <User size={18} />,
      adminOnly: false,
    },
    {
      label: "Gestión de Usuarios",
      href: "/dashboard/users",
      icon: <Users size={18} />,
      adminOnly: true,
    },
    {
      label: "Reportes",
      href: "/dashboard/reports",
      icon: <BarChart3 size={18} />,
      adminOnly: true,
    },
  ];

  return (
    // CONTENEDOR PRINCIPAL: Fondo gris claro para las vistas
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      
      {/* --- SIDEBAR NEGRO (Alto Contraste) --- */}
      <aside className="w-64 bg-[#09090b] border-r border-slate-800 hidden md:flex flex-col flex-shrink-0 z-20 shadow-xl text-white">
        
        {/* LOGO (Invertido para fondo negro) */}
        <div className="p-6 flex items-center gap-3">
          <div className="bg-white text-black p-2 rounded-lg shadow-md shadow-slate-900/50">
            <Wallet size={20} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            Finanzas App
          </span>
        </div>

        {/* MENÚ DE NAVEGACIÓN */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto mt-4">
          <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Menú Principal
          </p>
          
          {menuItems.map((item) => {
            if (item.adminOnly && userRole !== "ADMIN") return null;

            const isActive = router.pathname === item.href;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.1)]" // ACTIVO: Blanco brillante sobre fondo negro
                    : "text-slate-400 hover:bg-slate-800 hover:text-white" // INACTIVO: Gris oscuro que se ilumina
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {/* Flechita visible solo si está activo */}
                {isActive && <ChevronRight size={14} className="text-slate-900" />}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER DEL MENÚ */}
        <div className="p-4 border-t border-slate-800 bg-black/50">
          <button
            onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/" } } })}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* --- ÁREA DE CONTENIDO --- */}
      <main className="flex-1 overflow-y-auto relative bg-slate-50">
        <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-500">
          {children}
        </div>
      </main>

    </div>
  );
}