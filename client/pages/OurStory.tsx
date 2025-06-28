import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/Header";
import { Heart, Home, Users, Leaf, Quote, Star } from "lucide-react";

export default function OurStory() {
  return (
    <div className="min-h-screen bg-white">
      <Header showBackButton backButtonText="Back to Home" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-spice-cream to-spice-light py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-spice-brown mb-6 font-display">
            A Taste of Home, <br />
            <span className="text-spice-orange">A Story of Heritage</span>
          </h1>
          <p className="text-lg text-spice-muted max-w-2xl mx-auto">
            Preserving the soul of Indian kitchens, one jar at a time. This is
            our journey of bringing traditional flavors to modern families, near
            and far.
          </p>
        </div>
      </section>

      {/* Main Story */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-12">
            {/* Opening Quote */}
            <Card className="border-spice-cream bg-gradient-to-r from-spice-light to-white">
              <CardContent className="p-8 text-center">
                <Quote className="w-12 h-12 text-spice-orange mx-auto mb-6" />
                <blockquote className="text-xl md:text-2xl text-spice-brown font-display italic mb-4">
                  "The aroma of my grandmother's kitchen was not just about
                  food; it was about love, tradition, and the unbreakable bonds
                  that connect us to our roots."
                </blockquote>
                <p className="text-spice-muted">
                  — Priya Sharma, Founder of Pickle Pot
                </p>
              </CardContent>
            </Card>

            {/* The Beginning */}
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-spice-brown mb-6 font-display">
                Where It All Began
              </h2>

              <p className="text-spice-muted leading-relaxed mb-6">
                In the bustling streets of Mumbai, in a small apartment filled
                with the constant symphony of pressure cookers and the gentle
                grinding of spices, my grandmother <strong>Kamala Devi</strong>{" "}
                created magic every single day. Her hands, weathered by years of
                love and labor, would transform simple vegetables into pickles
                that could make anyone's mouth water from three houses away.
              </p>

              <p className="text-spice-muted leading-relaxed mb-6">
                As a young girl, I would sit cross-legged on the cool kitchen
                floor, watching her work. There was no recipe book, no measuring
                cups—just generations of wisdom flowing through her fingertips.
                She would tell me,
                <em>
                  "Beta, cooking is not just about feeding the body. It's about
                  nourishing the soul and keeping our culture alive."
                </em>
              </p>

              <p className="text-spice-muted leading-relaxed mb-6">
                When I moved to America in 2010, I carried with me two suitcases
                and a heart full of memories. But it wasn't until I couldn't
                find the taste of home in any store that I realized what I had
                truly left behind. The pickles here were different—lacking the
                soul, the story, the love that made my grandmother's jars so
                special.
              </p>
            </div>

            {/* Values Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-spice-cream">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-spice-orange rounded-lg flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-spice-brown mb-3">
                    Love in Every Jar
                  </h3>
                  <p className="text-spice-muted">
                    Every pickle and spice blend is made with the same care and
                    attention my grandmother put into her cooking. We believe
                    that love is the most important ingredient in any recipe.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-spice-cream">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-spice-orange rounded-lg flex items-center justify-center mb-4">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-spice-brown mb-3">
                    Connecting to Roots
                  </h3>
                  <p className="text-spice-muted">
                    For Indian families living abroad, our products are more
                    than food— they're a bridge to home, a way to share our
                    heritage with the next generation.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-spice-cream">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-spice-orange rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-spice-brown mb-3">
                    Building Community
                  </h3>
                  <p className="text-spice-muted">
                    We've created more than a business; we've built a community
                    of people who understand that food is culture, memory, and
                    connection all rolled into one.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-spice-cream">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-spice-orange rounded-lg flex items-center justify-center mb-4">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-spice-brown mb-3">
                    Natural & Pure
                  </h3>
                  <p className="text-spice-muted">
                    Just like my grandmother, we use only natural ingredients,
                    traditional methods, and time-honored techniques. No
                    shortcuts, no artificial preservatives—just pure, authentic
                    flavor.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* The Mission */}
            <div className="bg-gradient-to-r from-spice-cream to-spice-light rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-spice-brown mb-6 font-display text-center">
                Our Mission: Preserving Tradition, Creating Memories
              </h2>

              <div className="space-y-6 text-spice-muted">
                <p className="leading-relaxed">
                  Today, as I watch my own children—born and raised in
                  America—close their eyes and smile when they taste our mango
                  pickle, I know we've succeeded. They may not speak perfect
                  Hindi, they may prefer pizza to chapati sometimes, but when
                  they taste our pickles, they're connected to something deeper.
                </p>

                <p className="leading-relaxed">
                  <strong>To every Indian family reading this:</strong> Don't
                  let the flavors of your childhood become just memories. Don't
                  let your children grow up thinking that Indian food comes only
                  from restaurants. Bring these authentic tastes into your home.
                  Let them be the bridge between your past and their future.
                </p>

                <p className="leading-relaxed">
                  <strong>To our non-Indian friends:</strong> Welcome to our
                  table! These flavors tell the story of a culture that spans
                  thousands of years, of mothers and grandmothers who turned
                  simple ingredients into expressions of love. When you try our
                  products, you're not just tasting food—you're experiencing our
                  heritage.
                </p>
              </div>
            </div>

            {/* The Challenge */}
            <div>
              <h2 className="text-3xl font-bold text-spice-brown mb-6 font-display">
                A Call to Fellow Indians: Don't Let Tradition Fade
              </h2>

              <div className="space-y-6 text-spice-muted">
                <p className="leading-relaxed">
                  I've met too many Indian families where the children prefer
                  ketchup over pickle, where the spice cabinet collects dust
                  while takeout containers fill the refrigerator. I
                  understand—life is busy, cooking from scratch is
                  time-consuming, and sometimes it's easier to adapt to local
                  tastes.
                </p>

                <p className="leading-relaxed">
                  But here's what I've learned:{" "}
                  <strong>
                    traditions don't die in a day—they fade slowly, one missed
                    meal at a time.
                  </strong>{" "}
                  They disappear when we stop making time for the rituals that
                  define us, when we stop sharing the stories that give our food
                  meaning.
                </p>

                <p className="leading-relaxed">
                  Your children are watching. They're forming their
                  understanding of what "home food" means. When you serve them
                  traditional flavors, you're not just feeding their
                  bodies—you're giving them an identity, a sense of belonging to
                  something beautiful and ancient.
                </p>

                <blockquote className="border-l-4 border-spice-orange pl-6 italic text-lg">
                  "The kitchen is the heart of the Indian home. Keep it beating
                  with the rhythms of tradition, the aroma of spices, and the
                  love that transforms ingredients into memories."
                </blockquote>
              </div>
            </div>

            {/* Customer Stories */}
            <div>
              <h2 className="text-3xl font-bold text-spice-brown mb-8 font-display text-center">
                Stories From Our Family
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-spice-cream">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-spice-yellow text-spice-yellow"
                        />
                      ))}
                    </div>
                    <p className="text-spice-muted italic mb-4">
                      "My 8-year-old daughter, who usually turns her nose up at
                      anything 'Indian,' asked for seconds of rice with your
                      mango pickle. I cried happy tears seeing her connect with
                      her heritage through taste."
                    </p>
                    <p className="text-spice-brown font-medium">
                      — Anita P., California
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-spice-cream">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-spice-yellow text-spice-yellow"
                        />
                      ))}
                    </div>
                    <p className="text-spice-muted italic mb-4">
                      "Your turmeric powder reminds me exactly of what my mother
                      used to grind fresh every week in India. It's helping me
                      teach my American husband about real Indian flavors."
                    </p>
                    <p className="text-spice-brown font-medium">
                      — Rahul K., Texas
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-spice-cream">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-spice-yellow text-spice-yellow"
                        />
                      ))}
                    </div>
                    <p className="text-spice-muted italic mb-4">
                      "As a college student, your products help me feel
                      connected to home. My roommates now love Indian food
                      because of your authentic spices!"
                    </p>
                    <p className="text-spice-brown font-medium">
                      — Kavya S., New York
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-spice-cream">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-spice-yellow text-spice-yellow"
                        />
                      ))}
                    </div>
                    <p className="text-spice-muted italic mb-4">
                      "I'm not Indian, but your story and products have given me
                      such appreciation for the culture. My Indian neighbors are
                      now my cooking mentors!"
                    </p>
                    <p className="text-spice-brown font-medium">
                      — Sarah M., Illinois
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Final Message */}
            <div className="bg-spice-brown rounded-2xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-6 font-display">
                Join Our Movement
              </h2>
              <p className="text-lg mb-6 text-spice-light">
                Every jar you buy, every meal you share, every story you tell
                about our food is a vote for preserving our beautiful
                traditions. Together, we can ensure that the flavors of India
                continue to bring families together, generation after
                generation.
              </p>
              <p className="text-xl font-semibold text-spice-yellow">
                Because food is not just sustenance—it's our story, our legacy,
                our love.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-spice-light">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-spice-brown mb-6 font-display">
            Start Your Own Story
          </h2>
          <p className="text-lg text-spice-muted mb-8">
            Ready to bring authentic Indian flavors to your table? Explore our
            collection of traditional pickles and premium spice powders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-spice-orange hover:bg-spice-orange/90"
              size="lg"
              onClick={() => (window.location.href = "/pickles")}
            >
              Shop Pickles
            </Button>
            <Button
              variant="outline"
              className="border-spice-orange text-spice-orange"
              size="lg"
              onClick={() => (window.location.href = "/powders")}
            >
              Shop Spice Powders
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
