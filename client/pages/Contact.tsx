import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <Header showBackButton backButtonText="Back to Home" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-spice-cream to-spice-light py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-spice-brown mb-4 font-display">
            Get in Touch
          </h1>
          <p className="text-lg text-spice-muted max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have questions about our
            products, need custom orders, or want to share your pickle stories.
          </p>
        </div>
      </section>

      {/* Contact Information and Form */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-spice-brown mb-6 font-display">
                  Contact Information
                </h2>
                <p className="text-spice-muted mb-8">
                  Reach out to us through any of these channels. We're here to
                  help with your authentic spice and pickle needs.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="border-spice-cream">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-spice-orange rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-spice-brown mb-2">
                          Email Us
                        </h3>
                        <p className="text-spice-muted mb-2">
                          For general inquiries and orders
                        </p>
                        <a
                          href="mailto:hello@thepicklepot.com"
                          className="text-spice-orange hover:underline font-medium"
                        >
                          hello@thepicklepot.com
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-spice-cream">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-spice-orange rounded-lg flex items-center justify-center">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-spice-brown mb-2">
                          Call Us
                        </h3>
                        <p className="text-spice-muted mb-2">
                          For immediate assistance
                        </p>
                        <a
                          href="tel:+14082191573"
                          className="text-spice-orange hover:underline font-medium"
                        >
                          +1 408 219 1573
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-spice-cream">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-spice-orange rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-spice-brown mb-2">
                          Visit Us
                        </h3>
                        <p className="text-spice-muted mb-2">
                          Our location in the heart of Silicon Valley
                        </p>
                        <address className="text-spice-orange not-italic">
                          San Jose, CA, USA
                        </address>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-spice-cream">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-spice-orange rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-spice-brown mb-2">
                          Business Hours
                        </h3>
                        <div className="space-y-1 text-spice-muted">
                          <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                          <p>Saturday: 10:00 AM - 4:00 PM</p>
                          <p>Sunday: Closed</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="border-spice-cream">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-spice-brown font-display">
                    Send us a Message
                  </CardTitle>
                  <p className="text-spice-muted">
                    Fill out the form below and we'll get back to you within 24
                    hours.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-spice-brown mb-2"
                      >
                        First Name
                      </label>
                      <Input
                        id="firstName"
                        placeholder="Enter your first name"
                        className="border-spice-cream focus:border-spice-orange"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-spice-brown mb-2"
                      >
                        Last Name
                      </label>
                      <Input
                        id="lastName"
                        placeholder="Enter your last name"
                        className="border-spice-cream focus:border-spice-orange"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-spice-brown mb-2"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      className="border-spice-cream focus:border-spice-orange"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-spice-brown mb-2"
                    >
                      Phone Number (Optional)
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      className="border-spice-cream focus:border-spice-orange"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-spice-brown mb-2"
                    >
                      Subject
                    </label>
                    <Input
                      id="subject"
                      placeholder="What's this about?"
                      className="border-spice-cream focus:border-spice-orange"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-spice-brown mb-2"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      className="border-spice-cream focus:border-spice-orange resize-none"
                    />
                  </div>

                  <Button
                    className="w-full bg-spice-orange hover:bg-spice-orange/90"
                    size="lg"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>

                  <p className="text-xs text-spice-muted text-center">
                    By submitting this form, you agree to our privacy policy and
                    terms of service.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-spice-light">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-spice-brown mb-4 font-display">
              Frequently Asked Questions
            </h2>
            <p className="text-spice-muted">
              Quick answers to common questions about our products and services.
            </p>
          </div>

          <div className="space-y-6">
            <Card className="border-spice-cream">
              <CardContent className="p-6">
                <h3 className="font-semibold text-spice-brown mb-2">
                  What sizes do your products come in?
                </h3>
                <p className="text-spice-muted">
                  All our pickles and spice powders are available in convenient
                  6oz and 8oz glass bottles, perfect for home use.
                </p>
              </CardContent>
            </Card>

            <Card className="border-spice-cream">
              <CardContent className="p-6">
                <h3 className="font-semibold text-spice-brown mb-2">
                  How long do your pickles and powders stay fresh?
                </h3>
                <p className="text-spice-muted">
                  Our pickles have a shelf life of 12-18 months when stored
                  properly. Spice powders maintain peak flavor for 2-3 years in
                  a cool, dry place.
                </p>
              </CardContent>
            </Card>

            <Card className="border-spice-cream">
              <CardContent className="p-6">
                <h3 className="font-semibold text-spice-brown mb-2">
                  Do you offer custom spice blends?
                </h3>
                <p className="text-spice-muted">
                  Yes! We can create custom spice blends for special occasions
                  or dietary requirements. Contact us to discuss your needs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-spice-cream">
              <CardContent className="p-6">
                <h3 className="font-semibold text-spice-brown mb-2">
                  What's your shipping policy?
                </h3>
                <p className="text-spice-muted">
                  We offer free shipping on orders over $25. Most orders are
                  processed within 1-2 business days and delivered within 3-5
                  business days.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Chat Support Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Card className="border-spice-orange bg-gradient-to-r from-spice-cream to-spice-light">
            <CardContent className="p-8">
              <MessageCircle className="w-12 h-12 text-spice-orange mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-spice-brown mb-4 font-display">
                Need Immediate Help?
              </h3>
              <p className="text-spice-muted mb-6">
                Our customer support team is available during business hours to
                answer your questions about our traditional pickles and spices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="bg-spice-orange hover:bg-spice-orange/90"
                  size="lg"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
                <Button
                  variant="outline"
                  className="border-spice-orange text-spice-orange"
                  size="lg"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
