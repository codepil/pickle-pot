import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, Mail, Phone, MapPin, AlertTriangle } from "lucide-react";

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-white">
      <Header showBackButton backButtonText="Back to Home" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-spice-cream to-spice-light py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-spice-orange rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-spice-brown mb-4 font-display">
            Terms & Conditions
          </h1>
          <p className="text-lg text-spice-muted max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using our
            website and services.
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
                1. Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-spice-muted">
              <p>
                By accessing and using the Pickle Pot website ("Service"), you
                accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do
                not use this service.
              </p>
              <p>
                These Terms of Service constitute a legally binding agreement
                between you and Pickle Pot regarding your use of our website and
                services.
              </p>
            </CardContent>
          </Card>

          <Card className="border-spice-cream">
            <CardHeader>
              <CardTitle className="text-spice-brown font-display">
                2. Use License
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-spice-muted">
              <p>
                Permission is granted to temporarily download one copy of the
                materials on Pickle Pot's website for personal, non-commercial
                transitory viewing only. This is the grant of a license, not a
                transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>modify or copy the materials</li>
                <li>
                  use the materials for any commercial purpose or for any public
                  display
                </li>
                <li>
                  attempt to reverse engineer any software contained on the
                  website
                </li>
                <li>
                  remove any copyright or other proprietary notations from the
                  materials
                </li>
              </ul>
              <p className="mt-4">
                This license shall automatically terminate if you violate any of
                these restrictions and may be terminated by Pickle Pot at any
                time.
              </p>
            </CardContent>
          </Card>

          <Card className="border-spice-cream">
            <CardHeader>
              <CardTitle className="text-spice-brown font-display">
                3. Product Information and Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-spice-muted">
              <div>
                <h4 className="font-semibold text-spice-brown mb-2">
                  Product Descriptions
                </h4>
                <p>
                  We strive to provide accurate product descriptions,
                  ingredients, and nutritional information. However, we do not
                  warrant that product descriptions or other content is
                  accurate, complete, reliable, current, or error-free.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-spice-brown mb-2">
                  Order Acceptance
                </h4>
                <p>
                  All orders are subject to acceptance by Pickle Pot. We reserve
                  the right to refuse or cancel any order for any reason,
                  including but not limited to product availability, errors in
                  product information, or suspected fraudulent activity.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-spice-brown mb-2">Pricing</h4>
                <p>
                  All prices are listed in USD and are subject to change without
                  notice. We reserve the right to correct pricing errors and
                  will contact you if a pricing error affects your order.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-spice-cream">
            <CardHeader>
              <CardTitle className="text-spice-brown font-display">
                4. Payment Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-spice-muted">
              <p>
                Payment is due at the time of purchase. We accept major credit
                cards, debit cards, and other payment methods as indicated on
                our website. By providing payment information, you represent and
                warrant that:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You are legally authorized to use the payment method</li>
                <li>
                  The payment information you provide is true and accurate
                </li>
                <li>
                  You will pay all charges incurred by you or any user of your
                  account
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-spice-cream">
            <CardHeader>
              <CardTitle className="text-spice-brown font-display">
                5. Shipping and Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-spice-muted">
              <div>
                <h4 className="font-semibold text-spice-brown mb-2">
                  Shipping Policy
                </h4>
                <p>
                  We ship to addresses within the United States. Shipping costs
                  and delivery times vary based on your location and selected
                  shipping method. Free shipping is available on orders over
                  $25.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-spice-brown mb-2">
                  Delivery
                </h4>
                <p>
                  Delivery dates are estimates and not guaranteed. We are not
                  responsible for delays caused by shipping carriers, weather
                  conditions, or other circumstances beyond our control.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-spice-brown mb-2">
                  Risk of Loss
                </h4>
                <p>
                  Risk of loss and title for products purchased on our website
                  pass to you upon delivery to the carrier.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-spice-cream">
            <CardHeader>
              <CardTitle className="text-spice-brown font-display">
                6. Return and Refund Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-spice-muted">
              <p>
                We want you to be completely satisfied with your purchase. If
                you're not happy with your order, please contact us within 30
                days of delivery.
              </p>

              <div>
                <h4 className="font-semibold text-spice-brown mb-2">Returns</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Items must be unopened and in original packaging</li>
                  <li>
                    Perishable items cannot be returned for safety reasons
                  </li>
                  <li>
                    Return shipping costs are the responsibility of the customer
                    unless the return is due to our error
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-spice-brown mb-2">Refunds</h4>
                <p>
                  Approved refunds will be processed within 5-7 business days to
                  the original payment method.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-spice-cream">
            <CardHeader>
              <CardTitle className="text-spice-brown font-display">
                7. Food Safety and Allergens
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-spice-muted">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-2">
                      Important Allergen Information
                    </h4>
                    <p className="text-yellow-700">
                      Our products may contain or be processed in facilities
                      that handle common allergens including nuts, sesame,
                      mustard, and other spices. Please read ingredient lists
                      carefully and consult with a healthcare provider if you
                      have food allergies.
                    </p>
                  </div>
                </div>
              </div>

              <p>
                We take food safety seriously and follow proper handling and
                storage procedures. However, we cannot guarantee that our
                products are free from all allergens or contaminants.
              </p>
            </CardContent>
          </Card>

          <Card className="border-spice-cream">
            <CardHeader>
              <CardTitle className="text-spice-brown font-display">
                8. Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-spice-muted">
              <p>
                The information on this website is provided on an "as is" basis.
                To the fullest extent permitted by law, Pickle Pot excludes all
                representations, warranties, conditions and terms express or
                implied.
              </p>
              <p>
                In no event shall Pickle Pot or its suppliers be liable for any
                damages (including, without limitation, damages for loss of data
                or profit, or due to business interruption) arising out of the
                use or inability to use the materials on our website.
              </p>
            </CardContent>
          </Card>

          <Card className="border-spice-cream">
            <CardHeader>
              <CardTitle className="text-spice-brown font-display">
                9. User Accounts and Conduct
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-spice-muted">
              <div>
                <h4 className="font-semibold text-spice-brown mb-2">
                  Account Responsibility
                </h4>
                <p>
                  You are responsible for maintaining the confidentiality of
                  your account credentials and for all activities that occur
                  under your account.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-spice-brown mb-2">
                  Prohibited Uses
                </h4>
                <p>
                  You agree not to use our website for any unlawful purpose or
                  in any way that could damage our reputation or business.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-spice-cream">
            <CardHeader>
              <CardTitle className="text-spice-brown font-display">
                10. Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-spice-muted">
              <p>
                Our total liability to you for any claims arising from your use
                of our website or products shall not exceed the amount you paid
                for the specific product that gave rise to the claim.
              </p>
              <p>
                We shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages, including without limitation
                loss of profits, data, use, goodwill, or other intangible
                losses.
              </p>
            </CardContent>
          </Card>

          <Card className="border-spice-cream">
            <CardHeader>
              <CardTitle className="text-spice-brown font-display">
                11. Governing Law
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-spice-muted">
              <p>
                These terms and conditions are governed by and construed in
                accordance with the laws of California, United States. Any
                disputes relating to these terms will be subject to the
                exclusive jurisdiction of the courts of California.
              </p>
            </CardContent>
          </Card>

          <Card className="border-spice-cream">
            <CardHeader>
              <CardTitle className="text-spice-brown font-display">
                12. Changes to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-spice-muted">
              <p>
                We reserve the right to revise these terms and conditions at any
                time. Material changes will be effective immediately upon
                posting on this website. Your continued use of our website after
                any changes constitutes acceptance of the new terms.
              </p>
            </CardContent>
          </Card>

          <Card className="border-spice-orange bg-gradient-to-r from-spice-cream to-spice-light">
            <CardHeader>
              <CardTitle className="text-spice-brown font-display flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-spice-muted">
                If you have any questions about these Terms and Conditions,
                please contact us:
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
