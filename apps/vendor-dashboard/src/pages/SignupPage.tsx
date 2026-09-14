import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import vendorLoginImage from '@/assets/vendor-login.jpg';
import { AuthLayout } from '@/components/AuthLayout';
import { GradientButton } from '@/components/GradientButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
];

const STEP_COUNT = 7;
const MOCK_OTP = '1234';

const selectClassName =
  '[color-scheme:dark] h-10 w-full min-w-0 appearance-none rounded-lg border border-input bg-transparent bg-no-repeat py-2 pr-9 pl-3 text-base text-brand-text outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30';

const selectChevronStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%238b8d97' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundPosition: 'right 0.85rem center',
  backgroundSize: '14px',
};

const gradientTextStyle = {
  backgroundImage: 'linear-gradient(90deg, #e8c9a0 0%, #ddaba8 35%, #c6a3c9 65%, #a3b9cf 100%)',
};

const stepVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 32 : -32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -32 : 32, opacity: 0 }),
};

function StepIntro({ step, title }: { step: number; title: string }) {
  return (
    <div className="mb-5">
      <p className="text-[11px] font-bold tracking-[0.2em] text-brand-gold uppercase">
        Step {step + 1}/{STEP_COUNT}
      </p>
      <h2 className="mt-1 text-sm font-bold tracking-[0.1em] text-brand-text uppercase">{title}</h2>
    </div>
  );
}

export function SignupPage() {
  const [[step, direction], setStepState] = useState<[number, number]>([0, 1]);

  const [storeName, setStoreName] = useState('');
  const [businessRegNumber, setBusinessRegNumber] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappOtpSent, setWhatsappOtpSent] = useState(false);
  const [whatsappOtp, setWhatsappOtp] = useState('');
  const [whatsappVerified, setWhatsappVerified] = useState(false);

  const [streetAddress, setStreetAddress] = useState('');
  const [mallName, setMallName] = useState('');
  const [shopNumber, setShopNumber] = useState('');
  const [suburb, setSuburb] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [branchCode, setBranchCode] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isFirstStep = step === 0;
  const isLastStep = step === STEP_COUNT - 1;

  const handleBack = () => setStepState(([s]) => [Math.max(s - 1, 0), -1]);

  const handleSendWhatsappOtp = () => {
    setWhatsappOtpSent(true);
    setWhatsappOtp('');
  };

  const handleVerifyWhatsappOtp = () => {
    if (whatsappOtp === MOCK_OTP) {
      setWhatsappVerified(true);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isLastStep) {
      setStepState(([s]) => [s + 1, 1]);
      return;
    }
    // No backend yet — nothing to submit to.
  };

  return (
    <AuthLayout imageSrc={vendorLoginImage}>
      <p
        className="mb-6 bg-clip-text text-center text-xl font-bold tracking-[0.2em] text-transparent uppercase min-[1300px]:text-left"
        style={gradientTextStyle}
      >
        Registration form
      </p>

      {isFirstStep ? (
        <p className="mb-6 text-center text-sm text-brand-muted min-[1300px]:text-left">
          Register your store and start selling with Kairos.
        </p>
      ) : null}

      {/* Validation temporarily disabled while reviewing the screens. */}
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {step === 0 && (
                <div className="space-y-4">
                  <StepIntro step={step} title="Store details" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="storeName">Store name</Label>
                      <Input
                        id="storeName"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="e.g. Thando's Boutique"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessRegNumber">Business reg. no.</Label>
                      <Input
                        id="businessRegNumber"
                        value={businessRegNumber}
                        onChange={(e) => setBusinessRegNumber(e.target.value)}
                        placeholder="e.g. 2021/123456/07"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <StepIntro step={step} title="Primary contact" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact name</Label>
                      <Input
                        id="contactName"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
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

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="phone">Cellphone number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 082 123 4567"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <StepIntro step={step} title="Store address" />
                  <p className="-mt-3 text-xs text-brand-muted">
                    We match orders to the closest available store, so accurate location details
                    matter.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="streetAddress">Street address</Label>
                    <Input
                      id="streetAddress"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="e.g. 12 Main Road"
                      required
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="mallName">Mall / shopping centre</Label>
                      <Input
                        id="mallName"
                        value={mallName}
                        onChange={(e) => setMallName(e.target.value)}
                        placeholder="e.g. Dragon City"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shopNumber">Shop / unit number</Label>
                      <Input
                        id="shopNumber"
                        value={shopNumber}
                        onChange={(e) => setShopNumber(e.target.value)}
                        placeholder="e.g. Shop 14, Upper Level"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <StepIntro step={step} title="Location" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="suburb">Suburb</Label>
                      <Input
                        id="suburb"
                        value={suburb}
                        onChange={(e) => setSuburb(e.target.value)}
                        placeholder="e.g. Rosebank"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City / town</Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Johannesburg"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="province">Province</Label>
                      <select
                        id="province"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        required
                        className={selectClassName}
                        style={selectChevronStyle}
                      >
                        <option value="" disabled>
                          Select a province
                        </option>
                        {PROVINCES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal code</Label>
                      <Input
                        id="postalCode"
                        inputMode="numeric"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="e.g. 2196"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <StepIntro step={step} title="Banking details" />
                  <p className="-mt-3 text-xs text-brand-muted">Where we'll pay out your sales.</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank name</Label>
                      <Input
                        id="bankName"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="e.g. Standard Bank"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountHolder">Account holder name</Label>
                      <Input
                        id="accountHolder"
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        placeholder="e.g. Sam Trading"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account number</Label>
                      <Input
                        id="accountNumber"
                        inputMode="numeric"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="1234567890"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="branchCode">Branch code</Label>
                      <Input
                        id="branchCode"
                        inputMode="numeric"
                        value={branchCode}
                        onChange={(e) => setBranchCode(e.target.value)}
                        placeholder="e.g. 051001"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <StepIntro step={step} title="WhatsApp verification" />
                  <p className="-mt-3 text-xs text-brand-muted">
                    We'll send order updates to this number.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="whatsappNumber">WhatsApp number</Label>
                    <div className="flex gap-2">
                      <Input
                        id="whatsappNumber"
                        type="tel"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="e.g. 082 123 4567"
                        required
                        disabled={whatsappVerified}
                        className="min-w-0 flex-1"
                      />
                      <button
                        type="button"
                        onClick={handleSendWhatsappOtp}
                        disabled={whatsappVerified}
                        className="shrink-0 rounded-lg border border-brand-gold/25 bg-white/[0.04] px-4 text-xs font-bold tracking-wide text-brand-gold uppercase disabled:opacity-60"
                      >
                        {whatsappVerified ? 'Verified ✓' : whatsappOtpSent ? 'Resend' : 'Send code'}
                      </button>
                    </div>

                    {whatsappOtpSent && !whatsappVerified ? (
                      <div className="space-y-2 pt-1">
                        <Label htmlFor="whatsappOtp">Enter code</Label>
                        <div className="flex gap-2">
                          <Input
                            id="whatsappOtp"
                            value={whatsappOtp}
                            onChange={(e) => setWhatsappOtp(e.target.value)}
                            placeholder="Enter code"
                            inputMode="numeric"
                            className="min-w-0 flex-1"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyWhatsappOtp}
                            className="shrink-0 rounded-lg border border-brand-gold/25 bg-white/[0.04] px-4 text-xs font-bold tracking-wide text-brand-text uppercase"
                          >
                            Verify
                          </button>
                        </div>
                        <p className="text-xs text-brand-muted">
                          Enter the code sent to WhatsApp (use {MOCK_OTP} for testing).
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-4">
                  <StepIntro step={step} title="Account security" />
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex gap-2.5">
          {!isFirstStep && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 rounded-lg border border-brand-gold/25 bg-white/[0.04] py-3 text-sm font-bold tracking-wide text-brand-text uppercase"
            >
              Back
            </button>
          )}
          <GradientButton type="submit" className="flex-1">
            {isLastStep ? 'Create' : 'Next'}
          </GradientButton>
        </div>
      </form>

      {!isLastStep ? (
        <p className="mt-6 text-center text-xs text-brand-muted min-[1300px]:text-left">
          Already have an account?{' '}
          <Link to="/" className="font-semibold text-brand-gold underline underline-offset-2">
            Log in
          </Link>
        </p>
      ) : null}
    </AuthLayout>
  );
}
