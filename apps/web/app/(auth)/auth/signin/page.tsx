"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { signIn, signOut, useSession } from "../../../../lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SignInPage() {
  const { data: session, isPending } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (response.error) {
        setError(response.error.message || "Sign in failed");
      }
    } catch {
      setError("Unable to sign in right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const response = await signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (response.error) {
        setError(response.error.message || "Google sign in failed");
      }
    } catch {
      setError("Unable to continue with Google.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <main className='min-h-dvh bg-[radial-gradient(circle_at_top,_hsl(240_10%_12%)_0%,_hsl(240_10%_10%)_45%,_hsl(240_11%_8%)_100%)] px-4 py-10 sm:px-6'>
      <section className='mx-auto flex w-full max-w-md items-center justify-center'>
        <Card className='w-full border-white/10 bg-card/95 backdrop-blur'>
          <CardHeader className='space-y-2'>
            <CardTitle className='text-2xl'>Welcome back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>

          <CardContent className='space-y-5'>
            {isPending ? (
              <p className='text-sm text-muted-foreground'>
                Checking session...
              </p>
            ) : session?.user ? (
              <div className='space-y-4'>
                <div className='flex items-start gap-3 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200'>
                  <CheckCircle2 className='mt-0.5 h-4 w-4' />
                  <div>
                    <p className='font-medium'>You&apos;re signed in</p>
                    <p className='text-emerald-300/90'>{session.user.email}</p>
                  </div>
                </div>

                <Button className='w-full' onClick={handleSignOut}>
                  Sign out
                </Button>
              </div>
            ) : (
              <>
                <form className='space-y-4' onSubmit={handleEmailSignIn}>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      id='email'
                      type='email'
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      autoComplete='email'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='password'>Password</Label>
                    <Input
                      id='password'
                      type='password'
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      minLength={8}
                      autoComplete='current-password'
                    />
                  </div>

                  <Button
                    className='w-full'
                    disabled={isSubmitting}
                    type='submit'>
                    {isSubmitting ? "Signing in..." : "Sign in"}
                  </Button>
                </form>

                <div className='flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground'>
                  <Separator className='flex-1' />
                  <span>or</span>
                  <Separator className='flex-1' />
                </div>

                <Button
                  variant='secondary'
                  className='w-full'
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  type='button'>
                  Continue with Google
                </Button>

                {error ? (
                  <div className='flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200'>
                    <AlertCircle className='mt-0.5 h-4 w-4' />
                    <p>{error}</p>
                  </div>
                ) : null}

                <p className='text-center text-sm text-muted-foreground'>
                  New here?{" "}
                  <Link
                    className='text-primary hover:underline'
                    href='/auth/signup'>
                    Create an account
                  </Link>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
