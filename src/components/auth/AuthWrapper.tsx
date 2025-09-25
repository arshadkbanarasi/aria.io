import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { VerifyOtpForm } from './VerifyOtpForm';

type AuthView = 'login' | 'signup' | 'forgot-password' | 'verify-otp';

export function AuthWrapper() {
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [otpType, setOtpType] = useState<'signup' | 'recovery'>('signup');

  const switchToSignup = () => setCurrentView('signup');
  const switchToLogin = () => setCurrentView('login');
  const switchToForgotPassword = () => setCurrentView('forgot-password');
  
  const switchToVerifyOtp = (userEmail: string, type: 'signup' | 'recovery' = 'signup') => {
    setEmail(userEmail);
    setOtpType(type);
    setCurrentView('verify-otp');
  };

  const goBack = () => {
    switch (currentView) {
      case 'verify-otp':
        setCurrentView(otpType === 'signup' ? 'signup' : 'forgot-password');
        break;
      case 'forgot-password':
        setCurrentView('login');
        break;
      default:
        setCurrentView('login');
    }
  };

  switch (currentView) {
    case 'signup':
      return (
        <SignupForm
          onSwitchToLogin={switchToLogin}
          onSwitchToVerifyOtp={(email) => switchToVerifyOtp(email, 'signup')}
        />
      );
    case 'forgot-password':
      return (
        <ForgotPasswordForm
          onSwitchToLogin={switchToLogin}
          onSwitchToVerifyOtp={(email) => switchToVerifyOtp(email, 'recovery')}
        />
      );
    case 'verify-otp':
      return (
        <VerifyOtpForm
          email={email}
          type={otpType}
          onSwitchToLogin={switchToLogin}
          onBack={goBack}
        />
      );
    default:
      return (
        <LoginForm
          onSwitchToSignup={switchToSignup}
          onSwitchToForgotPassword={switchToForgotPassword}
        />
      );
  }
}