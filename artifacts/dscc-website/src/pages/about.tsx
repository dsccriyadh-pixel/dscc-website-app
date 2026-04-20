import { Link } from "wouter";
import { Seo } from "@/components/seo/Seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

const TEAMS = [
  "Architecture Team",
  "Interior Design Team",
  "Engineering Team",
  "Project Management Team",
  "Execution Team",
];

const STATS = [
  { v: "3250", k: "Total Projects" },
  { v: "425",  k: "Visionary Architects" },
  { v: "38",   k: "Company locations" },
  { v: "7430", k: "Salified Clients" },
];

const LOGO_PHILOSOPHY = [
  "the base is the earth soil, for this it should be the black color, this layer is our company land foundation and our believe seeds were planted into: contacting for empower values, more values we can add to our clients and empower them, our soil will become more rich to grow the seeds into tree the into forest",
  "second layer DSCC is in green color because we consider our company as one of the tree in the forest, if we are able to survive and live healthy, we must grow toward to the bright sunlight, means we must engage a bright legal business under the sunshine, we must absorb the positive energy and continue absorb nutritious from our land to grow bigger and bigger and become a prosperous forest in the end and contribute for the society",
  "the third layer is sunshine symbol , means bright business, positive energy, blossom future, it is made of many files and books, means we must have system work flow and always learn more, u can also consider it as stairs, we believe continuous grow and move forward practical walk steps by steps, different color means different stages, continuous land touch efforts will accumulate our power to reach our targets",
];

export default function About() {
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <>
      <Seo
        title="WHO WE ARE — DSCC"
        description="DSCC .. creativity, Functionality and architectural excellence"
        path="/about"
      />

      {/* HERO */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-24">
          <h1 className="font-serif text-5xl md:text-6xl font-semibold tracking-tight max-w-3xl">WHO WE ARE</h1>
          <p className="mt-5 max-w-2xl text-lg text-primary-foreground/85">
            DSCC .. creativity, Functionality and architectural excellence
          </p>
        </div>
      </section>

      {/* OUR MESSAGE */}
      <section className="container py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <img
          src={`${baseUrl.replace(/\/$/, "")}/assets/images/about/who_dscc.jpg`}
          alt="DSCC business"
          className="rounded-lg w-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary mb-3">OUR MESSAGE</p>
          <h2 className="font-serif text-3xl text-foreground mb-5">
            DSCC .. creativity, Functionality and architectural excellence
          </h2>
          <p className="text-foreground/85 leading-relaxed">
            Welcome to DSCC Innovative One Stop Fit Out Solutions, where we believe that One Stop Fit Out Solutions is not just about structures; it's about creating inspiring spaces that push the boundaries of design, function, and innovation. With a passion for reimagining the built environment, we are committed to crafting architectural solutions that captivate, inspire, and transform.
          </p>
        </div>
      </section>

      {/* SPECIALIZED TEAMS */}
      <section className="bg-muted/30 border-y">
        <div className="container py-16">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2">OUR TEAMS</p>
            <h2 className="font-serif text-3xl text-foreground">DSCC Specialized Teams</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {TEAMS.map((t) => (
              <Card key={t}>
                <CardContent className="p-5 text-center">
                  <div className="font-serif text-base text-foreground">{t}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* LOGO / BRAND */}
      <section className="container py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary mb-3">OUR LOGO</p>
          <h2 className="font-serif text-3xl text-foreground mb-5">Brand to reflect our Message</h2>
          <p className="text-foreground/85 mb-6">
            DSCC logo is reflection of our company philosophy and what we believe, who we are, what we bring values for the society :
          </p>
          <ul className="space-y-4">
            {LOGO_PHILOSOPHY.map((para, i) => (
              <li key={i} className="border-l-2 border-primary pl-4 text-sm text-foreground/80 leading-relaxed">
                {para}
              </li>
            ))}
          </ul>
        </div>
        <img
          src={`${baseUrl.replace(/\/$/, "")}/assets/images/about/brand.svg`}
          alt="DSCC Brand"
          className="w-full max-w-md mx-auto"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
      </section>

      {/* MISSION + APPROACH */}
      <section className="bg-muted/30 border-y">
        <div className="container py-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <img
              src={`${baseUrl.replace(/\/$/, "")}/assets/images/about/mission.jpg`}
              alt="Our Mission"
              className="rounded-lg w-full object-cover mb-6"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
            <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2">OUR MISSION</p>
            <h3 className="font-serif text-2xl text-foreground mb-3">
              to redefine the possibilities of One Stop Fit Out Solutions through innovation and creativity
            </h3>
            <p className="text-foreground/80 leading-relaxed">
              At DSCC, our mission is simple yet profound: to redefine the possibilities of One Stop fit out solution through innovation and creativity. We strive to challenge conventional norms and explore uncharted territories in architectural design, all while maintaining a deep respect for cultural heritage, sustainability, and the unique needs of each project.
            </p>
          </div>
          <div>
            <img
              src={`${baseUrl.replace(/\/$/, "")}/assets/images/about/approch.jpg`}
              alt="Our Approach"
              className="rounded-lg w-full object-cover mb-6"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
            <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2">OUR APPROACH</p>
            <h3 className="font-serif text-2xl text-foreground mb-3">
              cutting-edge technologies, collaborative thinking
            </h3>
            <p className="text-foreground/80 leading-relaxed">
              Our approach is rooted in the fusion of innovation and One Stop Fit Out Solutions. We leverage cutting-edge technologies, collaborative thinking, and a deep understanding of spatial dynamics to craft designs that are as functional as they are visually striking. From conceptualization to realization, every project is a testament to our dedication to pushing the boundaries of architectural imagination.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.k}>
                <div className="font-serif text-5xl mb-1">{s.v}</div>
                <div className="text-xs uppercase tracking-[0.16em] text-primary-foreground/80">{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN US */}
      <section className="container py-20 text-center">
        <h2 className="font-serif text-3xl md:text-4xl mb-3">Join Us on this Journey</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Connect with us today to explore how DSCC Innovative One Stop Fit Out Solutions can transform your vision into reality.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/contact">
            <Button size="lg" className="gap-2">
              Lets Contact Now <ArrowRight className="size-4" />
            </Button>
          </Link>
          <a
            href="https://api.whatsapp.com/send?phone=966559846519&text=I%27m%20looking%20for%20Solution%20Provider%20(DSCC-WebSite)"
            target="_blank"
            rel="noreferrer"
          >
            <Button size="lg" variant="outline" className="gap-2">
              <MessageCircle className="size-4" /> What's App chat
            </Button>
          </a>
        </div>
      </section>
    </>
  );
}
