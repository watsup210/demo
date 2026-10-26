import { useEffect, useRef, useState } from "react";
import Icon from "./components/Icon";
import type { IconName } from "./components/Icon";
import { inspiration, locations } from "./data/locations";

type Tab = "Explore" | "Saved trips" | "History" | "Preferences";
const tabs: { name: Tab; icon: IconName }[] = [
  { name: "Explore", icon: "Compass" },
  { name: "Saved trips", icon: "Bookmark" },
  { name: "History", icon: "History" },
  { name: "Preferences", icon: "Settings2" },
];
export default function App() {
  const [tab, setTab] = useState<Tab>("Explore");
  const [origin, setOrigin] = useState("District 1, Ho Chi Minh City");
  const [destination, setDestination] = useState("");
  const [timing, setTiming] = useState("now");
  const [date, setDate] = useState("");
  const [personalized, setPersonalized] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(false);
  const [menu, setMenu] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (summary) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [summary]);
  const chooseDestination = (value: string) => {
    setDestination(value);
    setTab("Explore");
    setError("");
    document.getElementById("destination")?.focus();
  };
  const search = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!origin.trim() || !destination.trim()) {
      setError("Add both your starting point and destination.");
      return;
    }
    if (
      !locations.some((l) => l.name === origin) ||
      !locations.some((l) => l.name === destination)
    ) {
      setError("Choose a location from the demo suggestions below each field.");
      return;
    }
    if (origin === destination) {
      setError("Choose a destination different from your starting point.");
      return;
    }
    if (timing !== "now" && !date) {
      setError("Choose a date and time for your journey.");
      return;
    }
    setError("");
    setSummary(true);
  };
  return (
    <div className="app-shell">
      <aside className={`sidebar ${menu ? "is-open" : ""}`}>
        <a
          className="brand"
          href="#"
          onClick={() => {
            setTab("Explore");
            setMenu(false);
          }}
          aria-label="Travel Hub home"
        >
          <span className="brand-symbol">
            <Icon name="Route" size={27} />
          </span>
          <span>
            travel<span className="brand-light">hub</span>
            <span className="brand-dot">.</span>
          </span>
        </a>
        <div className="workspace-label">YOUR NEXT CHAPTER</div>
        <nav aria-label="Main navigation">
          {tabs.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setTab(item.name);
                setMenu(false);
              }}
              className={`nav-item ${tab === item.name ? "active" : ""}`}
            >
              <Icon name={item.icon} />
              {item.name}
              {item.name === "Explore" && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="small-illustration">
            <Icon name="Leaf" size={28} />
            <span className="dashed-path" />
            <Icon name="BusFront" size={28} />
          </div>
          <h3>A better way to get there.</h3>
          <p>
            More ways to move.
            <br />
            More possibilities to explore.
          </p>
          <span className="demo-label">
            <span /> SIMULATED DEMO
          </span>
        </div>
        <div className="profile">
          <span className="avatar">T</span>
          <div>
            <strong>Traveller</strong>
            <small>Your adventure starts here</small>
          </div>
          <Icon name="ChevronDown" size={16} />
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <button
            className="mobile-menu icon-button"
            aria-label="Toggle navigation"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            <Icon name="Menu" />
          </button>
          <span className="breadcrumb">
            Your everyday, a little further <span>✦</span>
          </span>
          <div className="topbar-right">
            <span className="location-tag">
              <Icon name="MapPin" size={15} /> Vietnam
            </span>
            <span className="demo-pill">Demo workspace</span>
          </div>
        </header>
        <main>
          {tab === "Explore" ? (
            <>
              <div className="page-heading">
                <div className="eyebrow">
                  <span /> LESS PLANNING. MORE LIVING.
                </div>
                <h1>
                  Good things are
                  <br className="mobile-break" /> a journey away<span>.</span>
                </h1>
                <p>
                  From your doorstep to your next adventure. Let’s find your
                  way.
                </p>
              </div>
              <div className="hero-grid">
                <section className="search-card" aria-labelledby="search-title">
                  <div className="card-title">
                    <span className="icon-tile">
                      <Icon name="Route" />
                    </span>
                    <div>
                      <h2 id="search-title">Where are we going?</h2>
                      <p>One search. Every way to get there.</p>
                    </div>
                  </div>
                  <form onSubmit={search}>
                    <div className="location-fields">
                      <div className="field-line">
                        <span className="origin-marker" />
                        <label htmlFor="origin">
                          FROM
                          <input
                            id="origin"
                            list="demo-locations"
                            value={origin}
                            onChange={(e) => {
                              setOrigin(e.target.value);
                              setError("");
                            }}
                            placeholder="Your starting point"
                            autoComplete="off"
                            required
                          />
                        </label>
                      </div>
                      <div className="field-divider" />
                      <button
                        className="swap-button"
                        type="button"
                        aria-label="Swap origin and destination"
                        onClick={() => {
                          setOrigin(destination);
                          setDestination(origin);
                          setError("");
                        }}
                      >
                        <Icon name="ArrowDownUp" size={17} />
                      </button>
                      <div className="field-line">
                        <Icon name="MapPin" size={19} />
                        <label htmlFor="destination">
                          TO
                          <input
                            id="destination"
                            list="demo-locations"
                            value={destination}
                            onChange={(e) => {
                              setDestination(e.target.value);
                              setError("");
                            }}
                            placeholder="Where do you want to go?"
                            autoComplete="off"
                            required
                          />
                        </label>
                      </div>
                    </div>
                    <datalist id="demo-locations">
                      {locations.map((l) => (
                        <option key={l.id} value={l.name}>
                          {l.detail}
                        </option>
                      ))}
                    </datalist>
                    <div className="time-row">
                      <Icon name="Clock3" size={18} />
                      <label className="sr-only" htmlFor="timing">
                        Journey timing
                      </label>
                      <select
                        id="timing"
                        value={timing}
                        onChange={(e) => setTiming(e.target.value)}
                      >
                        <option value="now">Leave now</option>
                        <option value="depart">Depart at</option>
                        <option value="arrive">Arrive by</option>
                      </select>
                      <span>Plan at your pace</span>
                    </div>
                    {timing !== "now" && (
                      <label className="datetime-label">
                        {timing === "depart" ? "Departure" : "Arrival"} date and
                        time
                        <input
                          type="datetime-local"
                          required
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </label>
                    )}
                    {error && (
                      <p role="alert" className="error">
                        {error}
                      </p>
                    )}
                    <button className="search-button" type="submit">
                      <Icon name="Search" size={19} />
                      Find my journey
                      <Icon name="ArrowRight" size={20} />
                    </button>
                    <div className="search-footnote">
                      <Icon name="Sparkles" size={14} /> Buses, ride-hailing &
                      coaches. Connected.
                    </div>
                  </form>
                </section>
                <section
                  className="journey-art"
                  aria-label="Illustration of a connected journey through a green landscape"
                >
                  <div className="art-grain" />
                  <div className="art-top">
                    <span className="art-kicker">GO YOUR OWN WAY</span>
                    <span className="art-compass">
                      <Icon name="Navigation" size={20} />
                    </span>
                  </div>
                  <h2>
                    A thousand places.
                    <br />
                    Your kind of journey.
                  </h2>
                  <p>The best route is the one that fits you.</p>
                  <svg
                    className="landscape"
                    viewBox="0 0 600 350"
                    aria-hidden="true"
                  >
                    <circle cx="470" cy="69" r="34" fill="#edd77c" />
                    <path
                      d="M0 220 Q90 63 230 184 Q355 41 600 155 L600 350 H0Z"
                      fill="#adc3a1"
                    />
                    <path
                      d="M0 256 Q133 124 296 220 Q450 110 600 201 L600 350 H0Z"
                      fill="#769d7d"
                    />
                    <path
                      d="M0 290 Q137 225 300 274 Q461 187 600 253 L600 350 H0Z"
                      fill="#326f59"
                    />
                    <path
                      d="M112 350 C80 278 356 300 343 228 S447 200 447 171"
                      fill="none"
                      stroke="#e4dfb8"
                      strokeWidth="29"
                    />
                    <path
                      d="M112 350 C80 278 356 300 343 228 S447 200 447 171"
                      fill="none"
                      stroke="#fff9d9"
                      strokeWidth="2"
                      strokeDasharray="8 8"
                    />
                    <g fill="#265d49">
                      <path d="M75 236l15-53 15 53z" />
                      <rect x="88" y="232" width="4" height="15" />
                      <path d="M510 267l19-67 19 67z" />
                      <rect x="526" y="260" width="5" height="24" />
                    </g>
                  </svg>
                  <div className="map-label map-start">
                    <span>
                      <Icon name="MapPin" size={17} />
                    </span>
                    Your start
                  </div>
                  <div className="map-label map-bus">
                    <span>
                      <Icon name="BusFront" size={19} />
                    </span>
                    A better connection
                  </div>
                  <div className="art-bottom">
                    <span>
                      <span className="live-dot" /> Made for the way you move
                    </span>
                    <Icon name="ArrowUpRight" size={18} />
                  </div>
                </section>
              </div>
              <section
                className="modes-strip"
                aria-label="Supported transportation categories"
              >
                <div className="modes-intro">
                  ALL YOUR OPTIONS.
                  <br />
                  <strong>One connected journey.</strong>
                </div>
                {(
                  [
                    {
                      icon: "BusFront",
                      title: "Public buses",
                      sub: "Everyday, made easy",
                    },
                    {
                      icon: "CarFront",
                      title: "Ride-hailing",
                      sub: "Your first & last mile",
                    },
                    {
                      icon: "TramFront",
                      title: "Coaches & shuttles",
                      sub: "A little further afield",
                    },
                  ] as { icon: IconName; title: string; sub: string }[]
                ).map((m) => (
                  <div className="mode" key={m.title}>
                    <span>
                      <Icon name={m.icon} size={24} />
                    </span>
                    <div>
                      <h3>{m.title}</h3>
                      <p>{m.sub}</p>
                    </div>
                  </div>
                ))}
              </section>
              <section className="inspiration-section">
                <div className="section-heading">
                  <div>
                    <div className="eyebrow">A CHANGE OF SCENERY</div>
                    <h2>Where to next?</h2>
                  </div>
                  <span className="section-note">
                    A little inspiration for the road{" "}
                    <Icon name="ArrowDownUp" size={15} />
                  </span>
                </div>
                <div className="destination-grid">
                  {inspiration.map((place) => (
                    <button
                      className={`destination-card ${place.type}`}
                      key={place.destination}
                      onClick={() => chooseDestination(place.destination)}
                    >
                      <div className="mini-landscape">
                        <span className="mini-sun" />
                        <span className="mini-hill one" />
                        <span className="mini-hill two" />
                        <span className="mini-hill three" />
                      </div>
                      <div className="destination-copy">
                        <span className="destination-label">{place.label}</span>
                        <h3>{place.name}</h3>
                        <p>{place.subtitle}</p>
                      </div>
                      <span className="destination-arrow">
                        <Icon name="ArrowUpRight" />
                      </span>
                    </button>
                  ))}
                </div>
              </section>
              <div className="trust-note">
                <Icon name="Leaf" size={17} />
                <p>A little less hassle. A lot more possibility.</p>
                <span>All transport data in this demo is simulated.</span>
              </div>
            </>
          ) : (
            <section className="secondary-page">
              <div className="eyebrow">YOUR TRAVEL HUB</div>
              <h1>{tab}</h1>
              {tab === "Preferences" ? (
                <div className="settings-card">
                  <div>
                    <h2>Personalized recommendations</h2>
                    <p>
                      Allow future recommendations to be reordered using
                      simulated journey history. All valid alternatives will
                      remain available.
                    </p>
                    <p className="muted">
                      Planned for Phase 3: explainable rules, not machine
                      learning.
                    </p>
                  </div>
                  <button
                    className={`toggle ${personalized ? "on" : ""}`}
                    role="switch"
                    aria-checked={personalized}
                    aria-label="Personalized recommendations"
                    onClick={() => setPersonalized(!personalized)}
                  >
                    <span />
                  </button>
                </div>
              ) : (
                <div className="empty-state">
                  <Icon
                    name={tab === "History" ? "History" : "Bookmark"}
                    size={38}
                  />
                  <h2>
                    {tab === "History"
                      ? "Your story starts with a journey"
                      : "A place for your favourite journeys"}
                  </h2>
                  <p>
                    {tab === "History"
                      ? "Journey history will arrive in Phase 5."
                      : "Saving journeys will arrive in Phase 5."}
                  </p>
                  <button
                    className="search-button"
                    onClick={() => setTab("Explore")}
                  >
                    Explore destinations
                    <Icon name="ArrowRight" />
                  </button>
                </div>
              )}
            </section>
          )}
          <footer>
            <span>
              travelhub. <span>Move with possibility.</span>
            </span>
            <span>
              PHASE 01 <span className="footer-dot">•</span> CONCEPT DEMO
            </span>
          </footer>
        </main>
      </div>
      <nav className="bottom-nav" aria-label="Mobile navigation">
        {tabs.map((item) => (
          <button
            key={item.name}
            className={tab === item.name ? "active" : ""}
            onClick={() => setTab(item.name)}
          >
            <Icon name={item.icon} />
            <span>{item.name === "Saved trips" ? "Saved" : item.name}</span>
          </button>
        ))}
      </nav>
      <dialog
        ref={dialogRef}
        className="modal"
        aria-labelledby="confirmation-title"
        onCancel={() => setSummary(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSummary(false);
        }}
      >
        <button
          autoFocus
          className="close-button icon-button"
          aria-label="Close search confirmation"
          onClick={() => setSummary(false)}
        >
          <Icon name="X" />
        </button>
        <span className="confirmation-icon">
          <Icon name="Check" size={30} />
        </span>
        <div className="eyebrow">PHASE 1 · SEARCH PREVIEW</div>
        <h2 id="confirmation-title">Your next journey starts here.</h2>
        <p>
          <strong>{origin}</strong>
          <br />
          to <strong>{destination}</strong>
        </p>
        <p>
          {timing === "now"
            ? "Leave now"
            : `${timing === "depart" ? "Depart at" : "Arrive by"} ${date.replace("T", " · ")}`}
        </p>
        <div className="preview-note">
          Your search form is working. Simulated routes, prices and travel times
          will arrive in Phase 2, after you review this version.
        </div>
        <button className="search-button" onClick={() => setSummary(false)}>
          Back to exploring
          <Icon name="ArrowRight" />
        </button>
      </dialog>
    </div>
  );
}
