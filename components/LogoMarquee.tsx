"use client";

const logos = [
  "Workers' Comp",
  "MedImpact",
  "Tredium",
  "Viatris Copay Card",
  "Independent Health",
  "MeridianRx",
  "NaviClaim Rx",
  "Cervey LLC",
  "NetCard System",
];

const LogoMarquee = () => {
  return (
    <section className="py-8 border-b border-border bg-background">
      <div className="overflow-hidden">
        <div 
          className="flex whitespace-nowrap"
          style={{
            animation: "marquee 25s linear infinite",
            width: "200%",
          }}
        >
          {[...logos, ...logos].map((logo, index) => (
            <span
              key={index}
              className="mx-8 text-muted-foreground text-sm font-medium flex-shrink-0"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoMarquee;