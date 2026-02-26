import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Dialog, DialogContent,DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles, Download, Trophy, AlertCircle } from "lucide-react";

interface CertificateData {
  participantName: string;
  projectName: string;
  award: string;
  eventName: string;
  eventDate: string;
  issuer: string;
  token: string;
}

export default function CertificatePage() {
  const [token, setToken] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [error, setError] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
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

  const handleVerify = async () => {
    if (!token.trim()) {
      setError("Please enter your token");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      // Call Vercel API endpoint instead of Firebase Cloud Function
      const response = await fetch("/api/generateCertificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participantName: participantName.trim() || undefined,
          token: token.toUpperCase(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as { success: boolean; certificate: CertificateData };
      
      if (data.success) {
        setCertificateData(data.certificate);
        triggerConfetti();
        toast({
          title: "🎉 Certificate Ready!",
          description: "Your certificate has been generated successfully"
        });
      }
    } catch (err: any) {
      console.error("Error generating certificate:", err);
      setError(err.message || "Invalid token or unable to generate certificate");
      toast({
        title: "Error",
        description: err.message || "Invalid token",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!certificateData) return;

    setIsGenerating(true);
    try {
      const certificateElement = document.getElementById("certificate-preview");
      if (!certificateElement) {
        throw new Error("Certificate element not found");
      }

      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`GIBC_Certificate_${certificateData.participantName.replace(/\s+/g, "_")}.pdf`);

      toast({
        title: "✅ Downloaded!",
        description: "Your certificate has been saved as PDF"
      });

      setTimeout(() => {
        setShowThankYou(true);
      }, 500);
    } catch (err: any) {
      console.error("Error generating PDF:", err);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Certificate Generator
          </h1>
          <p className="text-gray-600 text-lg">
            Global Innovation Build Challenge V1 (2026)
          </p>
        </div>

        {!certificateData ? (
          <Card className="max-w-md mx-auto border-2 border-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-purple-600" />
                Generate Your Certificate
              </CardTitle>
              <CardDescription>
                Enter your token to generate your participation certificate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="participantName">Your Full Name (Optional)</Label>
                <Input
                  id="participantName"
                  placeholder="John Doe"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  className="border-purple-200 focus:border-purple-400"
                />
                <p className="text-sm text-gray-500">
                  Leave blank to use your Devpost username
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="token">Your Token *</Label>
                <Input
                  id="token"
                  placeholder="ABC123XYZ0"
                  value={token}
                  onChange={(e) => setToken(e.target.value.toUpperCase())}
                  className="border-purple-200 focus:border-purple-400 uppercase"
                  maxLength={10}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isVerifying ? "Verifying..." : "Generate Certificate"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Download className="w-5 h-5 mr-2" />
                {isGenerating ? "Generating PDF..." : "Download Certificate"}
              </Button>
              <Button
                onClick={() => {
                  setCertificateData(null);
                  setToken("");
                  setParticipantName("");
                }}
                variant="outline"
                size="lg"
              >
                Generate Another
              </Button>
            </div>

            <div className="relative">
              <div
                id="certificate-preview"
                className="bg-white border-8 border-gradient-to-r from-purple-400 to-pink-400 rounded-lg shadow-2xl p-16 relative overflow-hidden"
                style={{
                  aspectRatio: "16/11",
                  background: "linear-gradient(135deg, #667eea15 0%, #764ba215 50%, #f093fb15 100%)"
                }}
              >
                <div className="absolute top-4 right-4 opacity-10">
                  <Sparkles className="w-32 h-32 text-purple-600" />
                </div>
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="text-center space-y-6">
                    <div className="inline-block">
                      <div className="text-6xl font-serif mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Certificate of Achievement
                      </div>
                      <div className="h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                    </div>

                    <p className="text-gray-600 text-lg">This is to certify that</p>

                    <div className="py-6">
                      <h2 className="text-5xl font-bold mb-2 text-gray-800">
                        {certificateData.participantName}
                      </h2>
                      <div className="h-0.5 bg-gray-300 max-w-md mx-auto" />
                    </div>

                    <div className="space-y-4">
                      <p className="text-gray-600 text-lg">
                        has successfully participated in
                      </p>
                      <h3 className="text-3xl font-bold text-purple-700">
                        {certificateData.eventName}
                      </h3>
                      <p className="text-gray-600">
                        with the project
                      </p>
                      <p className="text-2xl font-semibold text-gray-800">
                        "{certificateData.projectName}"
                      </p>
                    </div>

                    {certificateData.award && certificateData.award !== "Participant" && (
                      <div className="mt-6 inline-block">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-full shadow-lg">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-6 h-6" />
                            <span className="text-xl font-bold">{certificateData.award}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-end text-sm text-gray-600">
                    <div>
                      <p className="font-bold text-purple-700">{certificateData.issuer}</p>
                      <p className="mt-1">Organizer</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-700">{certificateData.eventDate}</p>
                      <p className="mt-1">Date</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-2 right-2 text-xs text-gray-400 font-mono">
                  {certificateData.token}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Thank You for Participating!
            </DialogTitle>
            <DialogDescription className="space-y-4 pt-4">
              <p className="text-base">
                Your journey as an innovator doesn't end here. We're excited to announce:
              </p>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg text-purple-700 mb-2">
                  🚀 Global Innovation Build Challenge V2
                </h3>
                <p className="text-sm text-gray-700">
                  Coming soon with bigger prizes, more categories, and global recognition!
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Stay connected for updates on V2 and continue building amazing projects!
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              onClick={() => navigate("/")}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
            >
              Back to Home
            </Button>
            <Button
              onClick={() => setShowThankYou(false)}
              variant="outline"
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
