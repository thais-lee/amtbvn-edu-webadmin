import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/_auth/register')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/auth/_auth/register"!</div>;
}
