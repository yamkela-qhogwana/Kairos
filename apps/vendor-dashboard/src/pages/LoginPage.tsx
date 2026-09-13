import { useState } from 'react';
import { Link } from 'react-router-dom';
import vendorLoginImage from '@/assets/vendor-login.jpg';
import { AuthLayout } from '@/components/AuthLayout';
import { GradientButton } from '@/components/GradientButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <AuthLayout imageSrc={vendorLoginImage}>
      <p className="mb-6 text-center text-sm text-brand-muted md:text-base min-[1300px]:text-left min-[1300px]:text-sm">
        Log in to manage your store, products, and orders.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="min-[1300px]:text-xs">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourstore.co.za"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="password" className="min-[1300px]:text-xs">
              Password
            </Label>
            <button
              type="button"
              className="text-xs font-semibold uppercase tracking-wide text-brand-gold underline underline-offset-2"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="pr-16"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-wide text-brand-muted"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <GradientButton type="submit" className="mt-2 min-[1300px]:py-3 min-[1300px]:text-sm">
          Log in
        </GradientButton>
      </form>

      <p className="mt-6 text-center text-xs text-brand-muted min-[1300px]:text-left">
        New to Kairos?{' '}
        <Link to="/signup" className="font-semibold text-brand-gold underline underline-offset-2">
          Register your store
        </Link>{' '}
        to start selling with Kairos.
      </p>
    </AuthLayout>
  );
}
