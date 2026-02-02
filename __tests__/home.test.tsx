import { render, screen } from '@testing-library/react'
import Home from '@/pages/index'
import '@testing-library/jest-dom'

// --- MOCKS (Simulaciones) ---
jest.mock('@/lib/auth-client', () => ({
  signIn: {
    social: jest.fn(),
  },
}));

jest.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: jest.fn(() => Promise.resolve(null)),
    },
  },
}));

jest.mock("better-auth/node", () => ({
  fromNodeHeaders: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
    };
  },
}));

describe('Página de Inicio (Login)', () => {
  
  // Prueba 1: El título en tu diseño actual es "Finanzas App"
  it('Debe mostrar el título "Finanzas App"', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { name: /Finanzas App/i })
    expect(heading).toBeInTheDocument()
  })

  // Prueba 2: El botón dice "Ingresar con GitHub"
  it('Debe tener un botón para Ingresar con GitHub', () => {
    render(<Home />)
    const button = screen.getByRole('button', { name: /Ingresar con GitHub/i })
    expect(button).toBeInTheDocument()
  })

  // Prueba 3: El footer dice "Prueba Técnica Frontend"
  it('Debe mostrar el texto del footer', () => {
    render(<Home />)
    const footerText = screen.getByText(/Prueba Técnica Frontend/i)
    expect(footerText).toBeInTheDocument()
  })
})