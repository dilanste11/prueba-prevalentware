import { formatCurrency, validateTransaction } from '@/lib/utils';

describe('Lógica de Negocio Financiera', () => {

  // PRUEBA 1: Formato de Moneda
  it('Debe formatear correctamente pesos colombianos', () => {
    const valor = 1500000;
    const resultado = formatCurrency(valor);
    // Esperamos que contenga el símbolo $ y los separadores de miles
    // Nota: El espacio entre $ y el número puede variar según nodo, usamos regex flexible
    expect(resultado).toMatch(/\$\s?1\.500\.000/);
  });

  // PRUEBA 2: Validación de Monto Negativo
  it('Debe rechazar montos negativos o cero', () => {
    const error1 = validateTransaction(0, "Pago");
    const error2 = validateTransaction(-500, "Pago");
    
    expect(error1).toBe("El monto debe ser mayor a 0");
    expect(error2).toBe("El monto debe ser mayor a 0");
  });

  // PRUEBA 3: Validación de Concepto Vacío
  it('Debe rechazar conceptos vacíos', () => {
    const error = validateTransaction(10000, "   "); // Solo espacios
    expect(error).toBe("El concepto es obligatorio");
  });

  // PRUEBA 4: Transacción Válida
  it('Debe aceptar una transacción correcta', () => {
    const error = validateTransaction(50000, "Compra de prueba");
    expect(error).toBeNull(); // Null significa éxito
  });

});