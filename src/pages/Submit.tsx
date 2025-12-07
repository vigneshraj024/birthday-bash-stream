import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Star, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubmissionForm } from "@/components/SubmissionForm";

const Submit = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-6 px-4 border-b border-border">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold">Submit a Birthday</h1>
            <p className="text-sm text-muted-foreground">
              Get featured in our birthday stream!
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="max-w-md mx-auto">
          {/* Info Card */}
          <div className="bg-gradient-to-br from-primary/10 via-party-pink/10 to-accent/10 rounded-3xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg">How It Works</h2>
                <p className="text-sm text-muted-foreground">3 simple steps</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary-foreground">1</span>
                </div>
                <div>
                  <p className="font-semibold">Upload a photo</p>
                  <p className="text-sm text-muted-foreground">A clear, happy photo works best!</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-secondary-foreground">2</span>
                </div>
                <div>
                  <p className="font-semibold">Fill in the details</p>
                  <p className="text-sm text-muted-foreground">Name, email, and birthday date</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-accent-foreground">3</span>
                </div>
                <div>
                  <p className="font-semibold">Get featured!</p>
                  <p className="text-sm text-muted-foreground">We'll review & add them to the stream</p>
                </div>
              </div>
            </div>
          </div>



          {/* Form */}
          <div className="bg-card rounded-3xl p-6 shadow-card">
            <div className="flex items-center gap-2 mb-6">
              <Gift className="w-6 h-6 text-primary" />
              <h2 className="font-display font-bold text-xl">Birthday Details</h2>
            </div>
            <SubmissionForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Submit;