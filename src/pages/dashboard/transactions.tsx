import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Search, CalendarIcon } from "lucide-react"; // Importamos icono calendario

// --- TIPOS ---
interface Transaction {
  id: string;
  amount: number;
  type: "INGRESO" | "EGRESO";
  date: string;
  concept: string;
  user?: { name: string | null }; 
}

interface PageProps {
  user: {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "USER";
  };
}

export default function TransactionsPage({ user }: PageProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado para el Modal
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Datos del Formulario (AHORA CON FECHA)
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    concept: "",
    type: "INGRESO" as "INGRESO" | "EGRESO",
    date: new Date().toISOString().split('T')[0] // Fecha de hoy por defecto (formato YYYY-MM-DD)
  });

  const [errors, setErrors] = useState({
    amount: "",
    concept: "",
    date: ""
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions/list");
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error("Error cargando transacciones", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTransaction = async () => {
    setErrors({ amount: "", concept: "", date: "" });
    let hasError = false;
    const newErrors = { amount: "", concept: "", date: "" };

    if (!newTransaction.amount || Number(newTransaction.amount) <= 0) {
      newErrors.amount = "El monto es obligatorio y debe ser mayor a 0.";
      hasError = true;
    }

    if (!newTransaction.concept.trim()) {
      newErrors.concept = "El concepto no puede estar vacío.";
      hasError = true;
    }

    if (!newTransaction.date) {
      newErrors.date = "La fecha es obligatoria.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/transactions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(newTransaction.amount),
          concept: newTransaction.concept,
          type: newTransaction.type,
          date: new Date(newTransaction.date).toISOString(), // Enviamos ISO string al backend
        }),
      });

      if (res.ok) {
        setIsDialogOpen(false);
        // Reset form al día de hoy
        setNewTransaction({ 
          amount: "", 
          concept: "", 
          type: "INGRESO", 
          date: new Date().toISOString().split('T')[0] 
        });
        fetchTransactions();
      } else {
        alert("Error al guardar la transacción");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const conceptSafe = t.concept ? t.concept.toLowerCase() : "";
    const userNameSafe = t.user?.name ? t.user.name.toLowerCase() : "";
    const term = searchTerm.toLowerCase();
    return conceptSafe.includes(term) || userNameSafe.includes(term);
  });

  return (
    <DashboardLayout userRole={user.role}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ingresos y Gastos</h1>
          <p className="text-slate-500">Gestiona los movimientos financieros.</p>
        </div>
        
        {user.role === "ADMIN" && (
          <Button onClick={() => setIsDialogOpen(true)} className="bg-black text-white gap-2 hover:bg-slate-800">
            <PlusCircle size={20} /> Nuevo Movimiento
          </Button>
        )}
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Buscar por concepto o usuario..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-slate-500">
                    Cargando movimientos...
                  </TableCell>
                </TableRow>
              ) : filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-slate-500">
                    No se encontraron transacciones.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((t) => (
                  <TableRow key={t.id}>
                    {/* Formateamos la fecha visualmente para que se vea bien (dd/mm/aaaa) */}
                    <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{t.concept}</TableCell>
                    <TableCell>{t.user?.name || "Desconocido"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        t.type === "INGRESO" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {t.type}
                      </span>
                    </TableCell>
                    <TableCell className={`text-right font-bold ${
                      t.type === "INGRESO" ? "text-green-600" : "text-red-600"
                    }`}>
                      {t.type === "INGRESO" ? "+" : "-"}${t.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setErrors({ amount: "", concept: "", date: "" });
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Movimiento</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* TIPO */}
            <div className="grid gap-2">
              <Label>Tipo de Movimiento</Label>
              <Select 
                value={newTransaction.type} 
                onValueChange={(val) => setNewTransaction({...newTransaction, type: val as "INGRESO" | "EGRESO"})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INGRESO">Ingreso (Dinero entra)</SelectItem>
                  <SelectItem value="EGRESO">Egreso (Dinero sale)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* FECHA */}
            <div className="grid gap-2">
              <Label htmlFor="date" className={errors.date ? "text-red-500" : ""}>
                Fecha
              </Label>
              <div className="relative">
                <Input 
                  id="date"
                  type="date"
                  className={errors.date ? "border-red-500 ring-red-500" : ""}
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                  style={{ colorScheme: "dark" }}
                />                
              </div>
              {errors.date && <p className="text-xs text-red-500 font-medium">{errors.date}</p>}
            </div>

            {/* MONTO */}
            <div className="grid gap-2">
              <Label htmlFor="amount" className={errors.amount ? "text-red-500" : ""}>
                Monto
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                <Input 
                  id="amount"
                  type="number" 
                  className={`pl-7 ${errors.amount ? "border-red-500 ring-red-500" : ""}`}
                  placeholder="0.00"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                />
              </div>
              {errors.amount && <p className="text-xs text-red-500 font-medium">{errors.amount}</p>}
            </div>

            {/* CONCEPTO */}
            <div className="grid gap-2">
              <Label htmlFor="concept" className={errors.concept ? "text-red-500" : ""}>
                Concepto
              </Label>
              <Input 
                id="concept"
                placeholder="Ej: Pago de nómina, Venta de producto..." 
                className={errors.concept ? "border-red-500 ring-red-500" : ""}
                value={newTransaction.concept}
                onChange={(e) => setNewTransaction({...newTransaction, concept: e.target.value})}
              />
              {errors.concept && <p className="text-xs text-red-500 font-medium">{errors.concept}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveTransaction} disabled={saving} className="bg-black text-white hover:bg-slate-800">
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(ctx.req.headers),
  });

  if (!session) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return { props: { user: JSON.parse(JSON.stringify(session.user)) } };
};