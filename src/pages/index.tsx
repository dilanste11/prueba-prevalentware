import { auth } from "@/lib/auth";
import { signIn } from "@/lib/auth-client";
import { fromNodeHeaders } from "better-auth/node";
import { GetServerSideProps } from "next";
import { Github, Wallet, ArrowRight, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    // FONDO: Gradiente radial oscuro y moderno
    <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black text-white p-6 relative overflow-hidden">
      
      {/* ELEMENTOS DECORATIVOS DE FONDO (Orbes de luz) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      {/* TARJETA PRINCIPAL (Efecto Cristal/Glassmorphism) */}
      <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 relative z-10 text-center">
        
        {/* LOGO ANIMADO */}
        <div className="mx-auto bg-gradient-to-tr from-blue-600 to-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-900/40 group hover:scale-105 transition-transform duration-300">
          <Wallet className="text-white w-10 h-10 group-hover:rotate-12 transition-transform duration-300" />
        </div>

        {/* TÍTULO CON GRADIENTE */}
        <h1 className="text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-white via-blue-100 to-slate-400 bg-clip-text text-transparent">
          Finanzas App
        </h1>
        
        <p className="text-slate-400 mb-8 text-lg leading-relaxed font-light">
          Control total de tu dinero.<br/>
          <span className="text-sm flex items-center justify-center gap-2 mt-2 text-slate-500">
            <ShieldCheck size={14} /> Seguro. Rápido. Simple.
          </span>
        </p>

        {/* BOTÓN DE LOGIN MEJORADO */}
        <button
          onClick={() => signIn.social({
            provider: "github",
            callbackURL: "/dashboard"
          })}
          className="w-full group flex items-center justify-center gap-3 bg-white text-black font-bold py-4 px-6 rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0"
        >
          <Github size={22} />
          <span>Ingresar con GitHub</span>
          {/* Flecha que aparece al pasar el mouse */}
          <ArrowRight size={18} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-blue-600" />
        </button>

        {/* FOOTER DISCRETO */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-1">
          <p className="text-xs text-slate-600 font-medium uppercase tracking-widest">
            Prueba Técnica Frontend
          </p>
          <p className="text-[10px] text-slate-700">
            Desarrollado con Next.js & Better Auth
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * ----------------------------------------------------------------
 * PROTECCIÓN INVERSA (Server Side)
 * ----------------------------------------------------------------
 */
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(ctx.req.headers),
  });

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};