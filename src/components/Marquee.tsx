import { site } from '../data/site';

export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((set) => (
          <div className="marquee__set" key={set}>
            {site.marquee.map((item) => (
              <span className="marquee__item" key={`${set}-${item}`}>
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
