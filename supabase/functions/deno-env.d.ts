// Minimal runtime globals for the local TypeScript check; Deno supplies these at deployment.
declare namespace Deno {
  namespace env { function get(name: string): string | undefined; }
  function serve(handler: (request: Request) => Promise<Response>): void;
}
