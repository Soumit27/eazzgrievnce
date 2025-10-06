import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Users,
  Clock,
  CheckCircle,
  FileText,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Star
} from "lucide-react";

const Landing = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure & Transparent",
      description: "OTP-based authentication ensures secure complaint submission with complete transparency in the resolution process."
    },
    {
      icon: Clock,
      title: "SLA Compliance",
      description: "Strict Service Level Agreements ensure timely resolution with automatic escalation mechanisms."
    },
    {
      icon: Users,
      title: "Multi-Role Management",
      description: "Structured workflow from Citizens to Workers, Contractors, and Administrative oversight."
    },
    {
      icon: CheckCircle,
      title: "Real-time Tracking",
      description: "Live updates on complaint status with SMS, email, and app notifications at every step."
    },
    {
      icon: FileText,
      title: "Evidence Upload",
      description: "Attach photos, videos, and documents with geo-tagging for accurate complaint documentation."
    },
    {
      icon: MessageSquare,
      title: "Feedback System",
      description: "Rate and review the resolution process to ensure continuous improvement in service quality."
    }
  ];

  const stats = [
    { value: "50K+", label: "Complaints Resolved" },
    { value: "98%", label: "SLA Compliance" },
    { value: "24/7", label: "Support Available" },
    { value: "15+", label: "Government Departments" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="government-gradient p-2 rounded-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Sujal Sewa Portal</h1>
              <p className="text-sm text-muted-foreground">Government Complaint Management System</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/login" className="text-foreground hover:text-primary transition-colors">
              Login
            </Link>
            <Link to="/complaint/new" className="text-foreground hover:text-primary transition-colors">
              Register Complaint
            </Link>
            <Link to="/track" className="text-foreground hover:text-primary transition-colors">
              Track Status
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-secondary/20 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section with Animated Marquee */}
      <section className="hero-gradient text-white py-20 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Digital Governance
              <br />
              <span className="bg-gradient-to-r from-blue-700 via-blue-700 to-blue-700 bg-clip-text text-transparent font-bold">
                Made Simple
              </span>


            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Streamlined complaint management with transparent processes, SLA compliance, and citizen-centric solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/complaint/new">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                  <FileText className="w-5 h-5 mr-2" />
                  Submit Complaint
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/track">
                {/* <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Track Status
                </Button> */}
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-white bg-white/10 text-white hover:bg-white hover:text-primary"
                >
                  Track Status
                </Button>
              </Link>
            </div>
          </div>

          {/* Animated Marquee Text */}
          <div className="border-t border-b border-white/20 py-4 mb-8">
            <div className="overflow-hidden whitespace-nowrap">
              <div className="marquee text-white/80 text-lg font-medium">
                🏛️ Government of India Initiative • Transparent Governance • SLA Driven Process • 24/7 Support • Multi-Language Support • Geo-Tagged Complaints • Real-Time Updates • Secure Authentication •
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Comprehensive Grievance Management
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for transparency, accountability, and efficient resolution of citizen complaints
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="government-gradient p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Flow Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple, structured process from complaint to resolution</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center font-bold text-xl">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Submit Complaint</h3>
              <p className="text-muted-foreground">Register your complaint with photo/video evidence and location</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center font-bold text-xl">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Validation & Assignment</h3>
              <p className="text-muted-foreground">Complaint validated and assigned to appropriate team within SLA</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center font-bold text-xl">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Resolution & Updates</h3>
              <p className="text-muted-foreground">Real-time updates as work progresses with proof of completion</p>
            </div>
            <div className="text-center">
              <div className="bg-success text-white p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center font-bold text-xl">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Closure & Feedback</h3>
              <p className="text-muted-foreground">OTP-verified closure with opportunity to rate the service</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 government-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-white/90">Join thousands of citizens using Eazz Grievance for faster resolution</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/complaint/new">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Submit Your First Complaint
              </Button>
            </Link>
            <Link to="/track">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-white bg-white/10 text-white hover:bg-white hover:text-primary"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-8 h-8" />
                <span className="text-xl font-bold">Eazz Grievance</span>
              </div>
              <p className="text-white/80 mb-4">
                Digital India initiative for transparent and efficient citizen complaint management.
              </p>
              <div className="flex space-x-4">
                <Star className="w-5 h-5" />
                <Star className="w-5 h-5" />
                <Star className="w-5 h-5" />
                <Star className="w-5 h-5" />
                <Star className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-white/80">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/help" className="hover:text-white transition-colors">Help & Support</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-white/80">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>1800-XXX-XXXX</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>support@eazzgrievance.gov.in</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>New Delhi, India</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 Government of India. All rights reserved. | Eazz Grievance System</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;