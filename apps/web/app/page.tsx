import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

export default async function Home() {
  const health = await trpc.health.check.query().catch(() => null);

  return (
    <main className='min-h-dvh bg-[radial-gradient(circle_at_top,_hsl(240_10%_12%)_0%,_hsl(240_10%_10%)_45%,_hsl(240_11%_8%)_100%)] px-4 py-10 sm:px-6'>
      <section className='mx-auto w-full max-w-2xl'>
        <Card className='border-white/10 bg-card/95 backdrop-blur'>
          <CardHeader>
            <CardTitle className='text-3xl'>Spinn Auth</CardTitle>
            <CardDescription>
              Simple, clean and responsive authentication flow powered by Better
              Auth.
            </CardDescription>
            <CardDescription>
              API health: {health?.status ?? "unavailable"}
              {health?.timestamp ? ` (${health.timestamp})` : ""}
            </CardDescription>
          </CardHeader>

          <CardContent className='flex flex-col gap-3 sm:flex-row'>
            <Button asChild className='sm:flex-1'>
              <Link href='/auth/signin'>
                Go to Sign in
                <ArrowRight className='h-4 w-4' />
              </Link>
            </Button>

            <Button asChild variant='secondary' className='sm:flex-1'>
              <Link href='/auth/signup'>Create account</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
