import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, UserCog } from "lucide-react";

// --- TIPOS ---
interface UserData {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  phone: string | null;
  createdAt: string;
}

interface PageProps {
  user: { role: string }; 
}

export default function UsersPage({ user }: PageProps) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para Edición
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Cargar Usuarios al iniciar
  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) setUsers(await res.json());
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  // Abrir Modal de Edición
  const handleEditClick = (userToEdit: UserData) => {
    setEditingUser(userToEdit);
    setIsDialogOpen(true);
  };

  // Guardar Cambios
  const handleSaveUser = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: editingUser.id,
          name: editingUser.name,
          role: editingUser.role,
          phone: editingUser.phone
        }),
      });

      if (res.ok) {
        setIsDialogOpen(false);
        fetchUsers(); // Recargar tabla
        alert("Usuario actualizado");
      } else {
        alert("Error al actualizar");
      }
    } catch (error) { console.error(error); }
    finally { setSaving(false); }
  };

  return (
    <DashboardLayout userRole={user.role}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Gestión de Usuarios</h1>
        <p className="text-slate-500">Administra los accesos y roles de la plataforma.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog size={20} /> Lista de Usuarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center h-24">Cargando...</TableCell></TableRow>
              ) : users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.phone || "---"}</TableCell>
                  <TableCell>
                    <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditClick(u)}
                    >
                      <Pencil size={16} className="text-blue-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- MODAL DE EDICIÓN --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          
          {editingUser && (
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label>Nombre Completo</Label>
                <Input 
                  value={editingUser.name} 
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Teléfono</Label>
                <Input 
                  value={editingUser.phone || ""} 
                  onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                />
              </div>

              <div className="grid gap-2">
                <Label>Rol del Sistema</Label>
                <Select 
                  value={editingUser.role} 
                  onValueChange={(val) => setEditingUser({...editingUser, role: val as "ADMIN" | "USER"})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">Usuario (Estándar)</SelectItem>
                    <SelectItem value="ADMIN">Administrador (Total)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveUser} disabled={saving}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  );
}

// --- SSR: PROTECCIÓN DE RUTA (SOLO ADMIN) ---
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(ctx.req.headers),
  });

  if (!session || !session.user) {
    return { redirect: { destination: "/", permanent: false } };
  }

  // SI NO ES ADMIN, LO SACAMOS AL DASHBOARD NORMAL
  if (session.user.role !== "ADMIN") {
    return { redirect: { destination: "/dashboard/transactions", permanent: false } };
  }

  return {
    props: {
      user: JSON.parse(JSON.stringify(session.user)),
    },
  };
};