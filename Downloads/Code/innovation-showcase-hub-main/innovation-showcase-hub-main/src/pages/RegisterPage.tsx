import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { 
  Sparkles, 
  UserPlus, 
  Mail, 
  Code2, 
  FolderGit2, 
  Link2, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  Copy
} from "lucide-react";

interface RegistrationResponse {
  success: boolean;
  participantId: string;
  status: "approved" | "pending";
  autoApproved: boolean;
  token?: string;
  message?: string;
  validationResults?: {
    projectNameValid: boolean;
    devpostLinkValid: boolean;
    agreementValid: boolean;
  };
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    devpostUsername: "",
    projectName: "",
    projectLink: "",
    agreement: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<"idle" | "approved" | "pending">("idle");
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.devpostUsername.trim()) {
      setError("Devpost username is required");
      return false;
    }
    if (!formData.projectName.trim()) {
      setError("Project name is required");
      return false;
    }
    if (!formData.projectLink.trim()) {
      setError("Devpost project link is required");
      return false;
    }
    if (!formData.agreement) {
      setError("You must agree to the terms and conditions");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Call Vercel API endpoint instead of Firebase Cloud Function
      const response = await fetch("/api/submitRegistration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          devpostUsername: formData.devpostUsername.trim(),
          projectName: formData.projectName.trim(),
          projectLink: formData.projectLink.trim(),
          agreement: formData.agreement,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as RegistrationResponse;
      
      if (data.success) {
        if (data.status === "approved" && data.token) {
          // Auto-approved! 🎉
          setRegistrationStatus("approved");
          setToken(data.token);
          triggerConfetti();
          
          // Check if this is a returning participant
          const isReturning = data.message && data.message.includes("Welcome back");
          
          toast({
            title: isReturning ? "🎉 Welcome Back!" : "🎉 Registration Approved!",
            description: data.message || (isReturning 
              ? "Your existing token is ready to use!" 
              : "Your registration has been automatically approved. Save your token!"),
          });
        } else {
          // Pending review
          setRegistrationStatus("pending");
          
          toast({
            title: "Registration Received",
            description: data.message || "Your registration is pending review. You'll be notified once approved.",
          });
        }
      }
    } catch (err: any) {
      console.error("Error submitting registration:", err);
      
      // Handle specific error codes
      if (err.code === "invalid-argument") {
        setError(err.message || "Please check your input and try again");
      } else {
        setError(err.message || "An error occurred during registration. Please try again.");
      }
      
      toast({
        title: "Registration Error",
        description: err.message || "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      toast({
        title: "Token Copied!",
        description: "Your token has been copied to clipboard",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      devpostUsername: "",
      projectName: "",
      projectLink: "",
      agreement: false
    });
    setRegistrationStatus("idle");
    setToken(null);
    setError("");
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SUCCESS STATE - AUTO-APPROVED
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  if (registrationStatus === "approved" && token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="border-2 border-green-500 shadow-2xl">
            <CardHeader className="text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
              <div className="flex justify-center mb-4">
                <div className="bg-white rounded-full p-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold">
                🎉 Registration Approved!
              </CardTitle>
              <CardDescription className="text-green-50 text-lg mt-2">
                Your registration has been automatically approved
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6 space-y-6">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Congratulations! Your project meets all criteria for automatic approval.
                </AlertDescription>
              </Alert>

              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6 border-2 border-purple-300">
                <h3 className="text-lg font-semibold mb-3 text-purple-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Your Unique Token
                </h3>
                <div className="bg-white rounded-lg p-4 border-2 border-purple-400 mb-4">
                  <code className="text-2xl font-mono font-bold text-purple-700 tracking-wider">
                    {token}
                  </code>
                </div>
                <Button 
                  onClick={copyToken}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  size="lg"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Token
                </Button>
              </div>

              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Important:</strong> Save this token! You'll need it to generate your certificate.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700">Next Steps:</h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                  <li>Save your token in a secure location</li>
                  <li>Complete your project on Devpost</li>
                  <li>Use your token to claim your certificate</li>
                  <li>Check your email for additional details</li>
                </ol>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => navigate("/certificate")}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  Generate Certificate
                </Button>
                <Button 
                  onClick={() => navigate("/dashboard")}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  View Dashboard
                </Button>
              </div>

              <Button 
                onClick={resetForm}
                variant="ghost"
                className="w-full"
              >
                Register Another Participant
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PENDING STATE - MANUAL REVIEW NEEDED
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  if (registrationStatus === "pending") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="border-2 border-orange-400 shadow-2xl">
            <CardHeader className="text-center bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-t-lg">
              <div className="flex justify-center mb-4">
                <div className="bg-white rounded-full p-4">
                  <Clock className="h-16 w-16 text-orange-500" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold">
                Registration Received
              </CardTitle>
              <CardDescription className="text-orange-50 text-lg mt-2">
                Your submission is pending review
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6 space-y-6">
              <Alert className="bg-orange-50 border-orange-200">
                <Clock className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  Your registration has been received and is under review by our team.
                </AlertDescription>
              </Alert>

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold mb-3 text-blue-900">What happens next?</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Our team will review your registration within 24-48 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>You'll receive an email notification once approved</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Your unique token will be provided after approval</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Make sure to check your spam folder</span>
                  </li>
                </ul>
              </div>

              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Note:</strong> If you don't hear from us within 48 hours, please contact support.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button 
                  onClick={() => navigate("/dashboard")}
                  className="flex-1"
                  size="lg"
                >
                  View Dashboard
                </Button>
                <Button 
                  onClick={resetForm}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  Register Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // REGISTRATION FORM
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Register for GIBC V1
          </h1>
          <p className="text-gray-600 text-lg">
            Global Innovation Build Challenge V1 (2026)
          </p>
        </div>

        <Card className="shadow-2xl border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <UserPlus className="h-6 w-6 text-blue-600" />
              Participant Registration
            </CardTitle>
            <CardDescription>
              Fill in all required fields. Submissions meeting all criteria will be auto-approved!
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-blue-600" />
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  disabled={isSubmitting}
                  className="text-lg"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={isSubmitting}
                  className="text-lg"
                  required
                />
              </div>

              {/* Devpost Username */}
              <div className="space-y-2">
                <Label htmlFor="devpostUsername" className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-purple-600" />
                  Devpost Username *
                </Label>
                <Input
                  id="devpostUsername"
                  type="text"
                  placeholder="johndoe123"
                  value={formData.devpostUsername}
                  onChange={(e) => handleInputChange("devpostUsername", e.target.value)}
                  disabled={isSubmitting}
                  className="text-lg"
                  required
                />
                <p className="text-sm text-gray-500">
                  Your username on devpost.com
                </p>
              </div>

              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor="projectName" className="flex items-center gap-2">
                  <FolderGit2 className="h-4 w-4 text-green-600" />
                  Project Name *
                </Label>
                <Input
                  id="projectName"
                  type="text"
                  placeholder="My Awesome Innovation"
                  value={formData.projectName}
                  onChange={(e) => handleInputChange("projectName", e.target.value)}
                  disabled={isSubmitting}
                  className="text-lg"
                  required
                />
                <p className="text-sm text-gray-500">
                  Must be more than 3 characters for auto-approval
                </p>
              </div>

              {/* Devpost Project Link */}
              <div className="space-y-2">
                <Label htmlFor="projectLink" className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-orange-600" />
                  Devpost Project Link *
                </Label>
                <Input
                  id="projectLink"
                  type="url"
                  placeholder="https://devpost.com/software/my-project"
                  value={formData.projectLink}
                  onChange={(e) => handleInputChange("projectLink", e.target.value)}
                  disabled={isSubmitting}
                  className="text-lg"
                  required
                />
                <p className="text-sm text-gray-500">
                  Must contain "devpost.com" for auto-approval
                </p>
              </div>

              {/* Agreement Checkbox */}
              <div className="space-y-3 bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreement"
                    checked={formData.agreement}
                    onCheckedChange={(checked) => 
                      handleInputChange("agreement", checked === true)
                    }
                    disabled={isSubmitting}
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <Label 
                      htmlFor="agreement" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      I agree to the terms and conditions *
                    </Label>
                    <p className="text-sm text-gray-600">
                      By checking this box, you confirm that all information provided is accurate and 
                      you agree to abide by the hackathon rules and code of conduct.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Auto-Approval Info */}
              <Alert className="bg-blue-50 border-blue-200">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Auto-Approval:</strong> Registrations meeting all criteria will be instantly approved 
                  and you'll receive your token immediately!
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting Registration...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Submit Registration
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-600">
          Already registered?{" "}
          <button
            onClick={() => navigate("/certificate")}
            className="text-blue-600 hover:text-blue-700 font-medium underline"
          >
            Generate your certificate
          </button>
        </p>
      </div>
    </div>
  );
}
