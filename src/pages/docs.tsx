import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import { apiSpec } from "@/lib/swagger-spec";
import { GetServerSideProps } from "next";

// Importamos SwaggerUI de forma dinámica para evitar errores de SSR (Server Side Rendering)
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocs() {
  return (
    <div className="bg-white min-h-screen">
      <SwaggerUI spec={apiSpec} />
    </div>
  );
}

// Opcional: Proteger la documentación para que solo admins la vean (o dejarla pública)
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};