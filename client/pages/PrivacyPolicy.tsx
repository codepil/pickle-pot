import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Mail, Phone, MapPin, Calendar } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Header showBackButton backButtonText="Back to Home" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-spice-cream to-spice-light py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-spice-orange rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-spice-brown mb-4 font-display">
            Privacy Policy
          </h1>
          <p className="text-lg text-spice-muted max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we
            collect, use, and protect your personal information.
          </p>
          <p className="text-sm text-spice-muted mt-4">
            Last updated: January 15, 2025
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <Card className="border-spice-cream">
            <CardHeader>
              <CardTitle className="text-spice-brown font-display">
                1. Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-spice-muted">
              <div>
                <h4 className="font-semibold text-spice-brown mb-2">
                  Personal Information
                </h4>
                <p>When you create an account or place an order, we collect:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li>Name, email address, and phone number</li>
                  <li>Billing and shipping addresses</li>
                  <li>
                    Payment information (processed securely by our payment
                    partners)
                  </li>
                  <li>Date of birth for age verification</li>
                  <li>Communication preferences</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-spice-brown mb-2">
                  Usage Information
                </h4>
                <p>
                  We automatically collect information about how you use our
                  website:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li>Pages visited and time spent on our site</li>
                  <li>Products viewed and purchased</li>
                  <li>Device information and IP address</li>
                  <li>Browser type and operating system</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-spice-cream">
            <CardHeader>
              <CardTitle className="text-spice-brown font-display">
                2. How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-spice-muted">
              <p>We use your information to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Process Orders:</strong> To fulfill your purchases and
                  communicate about order status
                </li>
                <li>
                  <strong>Customer Service:</strong> To respond to your
                  inquiries and provide support
                </li>
                <li>
                  <strong>Marketing:</strong> To send you promotional emails
                  (with your consent)
                </li>
                <li>
                  <strong>Personalization:</strong> To recommend products and
                  improve your shopping experience
                </li>
                <li>
                  <strong>Security:</strong> To prevent fraud and protect our
                  website
                </li>
                <li>
                  <strong>Legal Compliance:</strong> To comply with applicable
                  laws and regulations
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-spice-cream">
            <CardHeader>
              <CardTitle className="text-spice-brown font-display">
                3. Information Sharing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-spice-muted">
              <p>
                We do not sell your personal information. We may share your
                information with:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Service Providers:</strong> Payment processors,
                  shipping companies, and email service providers
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or
                  to protect our rights
                </li>
                <li>
                  <strong>Business Transfers:</strong> In the event of a merger,
                  sale, or acquisition
                </li>
              </ul>
              <p className="mt-4">
                All third-party service providers are required to maintain the
                confidentiality of your information.
              </p>
            </CardContent>
          </Card>

          <Card className="border-spice-cream">
            <CardHeader>
              <CardTitle className="text-spice-brown font-display">
                4. Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-spice-muted">
              <p>
                We implement appropriate security measures to protect your
                personal information:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>SSL encryption for all data transmission</li>
                <li>
                  Secure payment processing through PCI-compliant providers
                </li>
                <li>Regular security audits and updates</li>
                <li>
                  Limited access to personal information on a need-to-know basis
                </li>
                <li>Secure data storage with regular backups</li>
              </ul>
              <p className="mt-4">
                While we strive to protect your information, no method of
                transmission over the internet is 100% secure.
              </p>
            </CardContent>
          </Card>

          <Card className="border-spice-cream">
            <CardHeader>
              <CardTitle className="text-spice-brown font-display">
                5. Your Rights and Choices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-spice-muted">
              <p>
                You have the following rights regarding your personal
                information:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Access:</strong> Request a copy of the personal
                  information we have about you
                </li>
                <li>
                  <strong>Correction:</strong> Update or correct inaccurate
                  information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal
                  information
                </li>
                <li>
                  <strong>Opt-out:</strong> Unsubscribe from marketing emails at
                  any time
                </li>
                <li>
                  <strong>Portability:</strong> Request your data in a portable
                  format
                </li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us using the
                information provided below.
              </p>
            </CardContent>
          </Card>

          <Card className="border-spice-cream">
            <CardHeader>
              <CardTitle className="text-spice-brown font-display">
                6. Cookies and Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-spice-muted">
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Remember your preferences and shopping cart items</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Provide personalized content and recommendations</li>
                <li>Enable social media features</li>
              </ul>
              <p className="mt-4">
                You can control cookies through your browser settings, but some
                features may not function properly if cookies are disabled.
              </p>
            </CardContent>
          </Card>

          <Card className="border-spice-cream">
            <CardHeader>
              <CardTitle className="text-spice-brown font-display">
                7. Children's Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-spice-muted">
              <p>
                Our website is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13. If you are a parent and believe your child has
                provided us with personal information, please contact us
                immediately.
              </p>
            </CardContent>
          </Card>

          <Card className="border-spice-cream">
            <CardHeader>
              <CardTitle className="text-spice-brown font-display">
                8. Changes to This Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-spice-muted">
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by posting the new policy on
                this page and updating the "Last updated" date. We encourage you
                to review this policy periodically.
              </p>
            </CardContent>
          </Card>

          <Card className="border-spice-orange bg-gradient-to-r from-spice-cream to-spice-light">
            <CardHeader>
              <CardTitle className="text-spice-brown font-display flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-spice-muted">
                If you have any questions about this Privacy Policy or our
                privacy practices, please contact us:
              </p>
              <div className="space-y-2 text-spice-brown">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-spice-orange" />
                  <span>hello@thepicklepot.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-spice-orange" />
                  <span>+1 408 219 1573</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-spice-orange" />
                  <span>San Jose, CA, USA</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
