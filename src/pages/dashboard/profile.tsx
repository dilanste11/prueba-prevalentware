import React, { useState } from "react";
import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { GetServerSideProps } from "next";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Save, Trash2, AlertTriangle } from "lucide-react";
import { signOut } from "@/lib/auth-client";

interface PageProps {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    phone?: string;
  };
}

export default function ProfilePage({ user }: PageProps) {
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // FUNCIÓN ACTUALIZAR DATOS
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/update-phone", { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      if (res.ok) alert("Perfil actualizado correctamente");
      else alert("Error al actualizar");
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  // FUNCIÓN ELIMINAR CUENTA
  const handleDeleteAccount = async () => {
    if (!confirm("¿ESTÁS SEGURO? Esta acción borrará todos tus datos y transacciones permanentemente. No se puede deshacer.")) return;
    
    setDeleting(true);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (res.ok) {
        alert("Tu cuenta ha sido eliminada.");
        // Forzar cierre de sesión y redirigir
        await signOut({ fetchOptions: { onSuccess: () => {window.location.href = "/"} } });
      } else {
        alert("Error al eliminar la cuenta");
      }
    } catch (error) { console.error(error); }
    finally { setDeleting(false); }
  };

  return (
    <DashboardLayout userRole={user.role}>
      <div className="max-w-2xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mi Perfil</h1>
          <p className="text-slate-500">Administra tu información personal.</p>
        </div>

        {/* FORMULARIO DE EDICIÓN */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} /> Información Personal
            </CardTitle>
            <CardDescription>Actualiza tu nombre y teléfono de contacto.</CardDescription>
          </CardHeader>
          <form onSubmit={handleUpdate}>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Correo Electrónico (No editable)</Label>
                <Input id="email" value={user.email} disabled className="bg-slate-50 text-slate-500" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input 
                  id="phone" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="+57 300 123 4567" 
                />
              </div>
              <div className="grid gap-2">
                <Label>Rol Asignado</Label>
                <div className="flex">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold border border-blue-200">
                    {user.role}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50/50 p-4 flex justify-end">
              <Button type="submit" disabled={loading} className="flex items-center gap-2">
                <Save size={16} />
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* ZONA DE PELIGRO */}
        <Card className="border-red-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle size={20} /> Zona de Peligro
            </CardTitle>
            <CardDescription>
              Eliminar tu cuenta es irreversible. Se borrarán todos tus ingresos, gastos y datos personales.
            </CardDescription>
          </CardHeader>
          <CardFooter className="bg-red-50 p-4 flex justify-between items-center rounded-b-xl">
            <span className="text-xs text-red-600 font-bold uppercase tracking-wider">Acción Destructiva</span>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Eliminando..." : "Eliminar mi Cuenta"}
            </Button>
          </CardFooter>
        </Card>

      </div>
    </DashboardLayout>
  );
}

// SSR
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(ctx.req.headers) });
  if (!session) return { redirect: { destination: "/", permanent: false } };
  return { props: { user: JSON.parse(JSON.stringify(session.user)) } };
};