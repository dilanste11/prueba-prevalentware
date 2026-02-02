declare module 'swagger-ui-react' {
  import React from 'react';

  interface SwaggerUIProps {
    spec?: object;
    url?: string;
    layout?: string;
    docExpansion?: "list" | "full" | "none";
  }

  class SwaggerUI extends React.Component<SwaggerUIProps> {}
  export default SwaggerUI;
}