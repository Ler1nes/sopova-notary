import { site } from '../data/site';

export function About() {
  const [titleLead, titleAccent] = site.about.title.split('—');

  return (
    <section className="section about" id="about">
      <div className="container about__grid">
        <div className="about__left">
          <p className="kicker" data-reveal>
            {site.about.kicker}
          </p>
          <h2 className="h2" data-split>
            {titleLead}
            {titleAccent ? <em>—{titleAccent}</em> : null}
          </h2>
          <p className="lead" data-reveal>
            {site.about.lead}
          </p>

          <div className="signature" data-reveal>
            <span className="signature__seal" aria-hidden="true">
              С
            </span>
            <span>
              <span className="signature__name">{site.about.signature}</span>
              <span className="signature__role">{site.about.signatureRole}</span>
            </span>
          </div>
        </div>

        <div className="about__right">
          <p className="about__body" data-reveal>
            {site.about.body}
          </p>

          <div className="pillars" data-reveal-group>
            {site.about.pillars.map((pillar, index) => (
              <div className="pillar" key={pillar.title}>
                <span className="pillar__num">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <div className="pillar__title">{pillar.title}</div>
                  <p className="pillar__text">{pillar.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="about__facts" data-reveal>
            {site.about.facts.map((fact) => (
              <span className="fact" key={fact}>
                {fact}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
