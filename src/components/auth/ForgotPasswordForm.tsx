import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Mail, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
  onSwitchToVerifyOtp: (email: string) => void;
}

export function ForgotPasswordForm({ onSwitchToLogin, onSwitchToVerifyOtp }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await resetPassword(email);
      if (error) {
        toast.error(error.message);
      } else {
        setSent(true);
        toast.success('Password reset email sent!');
        onSwitchToVerifyOtp(email);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-teal-50/50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <Card className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-border/50">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Reset your password
            </CardTitle>
            <CardDescription>
              {sent 
                ? `We've sent a password reset link to ${email}`
                : 'Enter your email address and we\'ll send you a reset link'
              }
            </CardDescription>
          </div>
        </CardHeader>

        {!sent ? (
          <>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send reset link'}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                onClick={onSwitchToLogin}
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to sign in
              </Button>
            </CardFooter>
          </>
        ) : (
          <CardContent className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Check your email</h3>
              <p className="text-sm text-muted-foreground mt-2">
                We've sent a password reset link to your email address. Click the link to reset your password.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setSent(false)}
              className="w-full"
            >
              Didn't receive the email? Try again
            </Button>
            <Button
              variant="ghost"
              onClick={onSwitchToLogin}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}