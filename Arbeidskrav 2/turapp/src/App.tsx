import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Mountain,
  Search,
  Heart,
  Map,
  LayoutGrid,
  ArrowRight,
  SlidersHorizontal,
  Trees,
  House,
  Flag,
  Users,
  Menu,
} from "lucide-react";
import "./i18n";
import TurKort from "./components/TurKort";
import MapView from "./components/MapView";
import Details from "./components/Details";
import Planner from "./components/Planner";
import { ProfilePage, AdPortal } from "./components/Portal";
import { turer, type Category, type Tur } from "./data/turer";
import { useStored, type Booking, type Profile, type Ad } from "./storage";
type Page = "explore" | "saved" | "mine" | "profile" | "ads" | "planner";
function AdBanner({
  ad,
  onView,
  onClick,
}: {
  ad: Ad;
  onView: (id: string) => void;
  onClick: (id: string) => void;
}) {
  const { t } = useTranslation();
  const viewed = useRef<string | null>(null);
  useEffect(() => {
    if (viewed.current !== ad.id) {
      viewed.current = ad.id;
      onView(ad.id);
    }
  }, [ad.id, onView]);
  return (
    <aside className="ad-banner">
      <span>
        {t("adLabel")} · {t(ad.category)}
      </span>
      <a
        href={ad.url}
        target="_blank"
        rel="noreferrer sponsored"
        onClick={() => onClick(ad.id)}
      >
        <strong>{ad.title}</strong>
        <p>{ad.body}</p>
        <ArrowRight size={20} />
      </a>
    </aside>
  );
}
export default function App() {
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState<Page>("explore");
  const [category, setCategory] = useState<Category>("trips");
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("");
  const [staffed, setStaffed] = useState("");
  const [price, setPrice] = useState("");
  const [facility, setFacility] = useState("");
  const [from, setFrom] = useState("");
  const [until, setUntil] = useState("");
  const [available, setAvailable] = useState(false);
  const [map, setMap] = useState(false);
  const [selected, setSelected] = useState<Tur | null>(null);
  const [menu, setMenu] = useState(false);
  const [saved, setSaved] = useStored<number[]>("turlyst-favourites", []);
  const [profile, setProfile] = useStored<Profile | null>(
    "turlyst-profile",
    null,
  );
  const [bookings, setBookings] = useStored<Booking[]>("turlyst-bookings", []);
  const [ads, setAds] = useStored<Ad[]>("turlyst-ads", []);
  const toggleSave = (id: number) =>
    setSaved((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]));
  function reset() {
    setQuery("");
    setDifficulty("");
    setActivity("");
    setDuration("");
    setStaffed("");
    setPrice("");
    setFacility("");
    setFrom("");
    setUntil("");
    setAvailable(false);
  }
  const filtered = useMemo(
    () =>
      turer.filter(
        (item) =>
          (page === "saved"
            ? saved.includes(item.id)
            : page === "mine"
              ? bookings.some((b) => b.trip === item.id)
              : item.category === category) &&
          `${item.tittel} ${item.omrade}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (!difficulty || item.grad === difficulty) &&
          (!activity || item.activity === activity) &&
          (!duration || item.hours <= Number(duration)) &&
          (!staffed || String(item.staffed) === staffed) &&
          (!price || (item.price || 0) <= Number(price)) &&
          (!facility || item.facilities?.includes(facility)) &&
          (!available ||
            item.capacity! >
              item.booked! +
                (bookings.find((b) => b.trip === item.id)?.status === "joined"
                  ? 1
                  : 0)) &&
          (!(from || until) ||
            item.dates?.some(
              (d) => (!from || d >= from) && (!until || d <= until),
            )),
      ),
    [
      page,
      category,
      query,
      difficulty,
      activity,
      duration,
      staffed,
      price,
      facility,
      available,
      from,
      until,
      saved,
      bookings,
    ],
  );
  const today = new Date().toISOString().slice(0, 10);
  const activeAd = ads.find(
    (a) =>
      a.status === "approved" &&
      a.from <= today &&
      a.until >= today &&
      a.url.startsWith("https://"),
  );
  function navigate(p: Page) {
    setPage(p);
    setMenu(false);
    reset();
  }
  const icons = { trips: Trees, cabins: House, places: Flag, groups: Users };
  return (
    <>
      <div className="student-banner">
        {t("banner")}
        <span>APP2000 / 2025–2026</span>
      </div>
      <header className="site-header">
        <button
          className="brand"
          onClick={() => navigate("explore")}
          aria-label="Turlyst"
        >
          <Mountain size={34} strokeWidth={1.7} />
          <span>
            turlyst<span className="brand-dot">.</span>
          </span>
        </button>
        <button
          className="mobile-menu"
          onClick={() => setMenu(!menu)}
          aria-expanded={menu}
          aria-label="Menu"
        >
          <Menu />
        </button>
        <nav className={menu ? "open" : ""}>
          {(["explore", "saved", "mine", "planner"] as Page[]).map((p) => (
            <button
              key={p}
              className={page === p ? "active" : ""}
              onClick={() => navigate(p)}
            >
              {p === "saved" && <Heart size={15} />}
              {t(p)}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <select
            aria-label="Språk / Language"
            value={i18n.language}
            onChange={(e) => void i18n.changeLanguage(e.target.value)}
          >
            <option value="no">NO</option>
            <option value="en">EN</option>
          </select>
          <button
            className="profile-button"
            onClick={() => navigate("profile")}
          >
            {profile ? profile.name.split(" ")[0] : t("profile")}
            <span aria-hidden="true">
              {profile?.name.charAt(0).toUpperCase() || "↗"}
            </span>
          </button>
        </div>
      </header>
      {page === "explore" || page === "saved" || page === "mine" ? (
        <>
          <section className={`hero ${page !== "explore" ? "compact" : ""}`}>
            <div className="hero-content">
              <p className="eyebrow">{t("eyebrow")}</p>
              <h1>{page === "explore" ? t("title") : t(page)}</h1>
              <p>{t("intro")}</p>
              <div className="search-box">
                <Search size={21} />
                <input
                  aria-label={t("search")}
                  placeholder={t("search")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <span>
                  <ArrowRight size={21} />
                </span>
              </div>
            </div>
            <div className="hero-caption">
              61°29′ N 8°48′ E <span>JOTUNHEIMEN, UTOPIA</span>
            </div>
          </section>
          <main className="explorer">
            {page === "explore" && (
              <div className="category-tabs">
                {(["trips", "cabins", "places", "groups"] as Category[]).map(
                  (c) => {
                    const Icon = icons[c];
                    return (
                      <button
                        key={c}
                        onClick={() => {
                          setCategory(c);
                          reset();
                        }}
                        className={category === c ? "selected" : ""}
                      >
                        <Icon size={20} />
                        {t(c)}
                        <span>
                          {turer.filter((x) => x.category === c).length}
                        </span>
                      </button>
                    );
                  },
                )}
              </div>
            )}
            <div className="section-title">
              <div>
                <p className="eyebrow">{t("explore")} UTOPIA</p>
                <h2>{t(page === "explore" ? category : page)}</h2>
              </div>
              <div className="view-switch">
                <button
                  className={!map ? "selected" : ""}
                  onClick={() => setMap(false)}
                  aria-pressed={!map}
                >
                  <LayoutGrid size={16} />
                  {t("list")}
                </button>
                <button
                  className={map ? "selected" : ""}
                  onClick={() => setMap(true)}
                  aria-pressed={map}
                >
                  <Map size={16} />
                  {t("map")}
                </button>
              </div>
            </div>
            <div className="filters">
              <SlidersHorizontal size={18} />
              {category !== "cabins" && (
                <>
                  <label className="sr-only" htmlFor="difficulty">
                    {t("difficulty")}
                  </label>
                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="">{t("difficulty")}</option>
                    {["Enkel", "Middels", "Krevende"].map((d) => (
                      <option key={d} value={d}>
                        {t(d)}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label={t("activity")}
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                  >
                    <option value="">{t("activity")}</option>
                    {["walk", "bike", "ski"].map((a) => (
                      <option key={a} value={a}>
                        {t(a)}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label={t("duration")}
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    <option value="">{t("duration")}</option>
                    {[2, 4, 8].map((n) => (
                      <option key={n} value={n}>
                        ≤ {n} {t("hours")}
                      </option>
                    ))}
                  </select>
                </>
              )}
              {category === "cabins" && (
                <>
                  <select
                    aria-label={t("staffed")}
                    value={staffed}
                    onChange={(e) => setStaffed(e.target.value)}
                  >
                    <option value="">
                      {t("staffed")} / {t("unstaffed")}
                    </option>
                    <option value="true">{t("staffed")}</option>
                    <option value="false">{t("unstaffed")}</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    aria-label={t("price")}
                    placeholder={t("price")}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <select
                    aria-label={t("facilities")}
                    value={facility}
                    onChange={(e) => setFacility(e.target.value)}
                  >
                    <option value="">{t("facilities")}</option>
                    {["food", "shower", "electricity", "fireplace"].map((f) => (
                      <option key={f} value={f}>
                        {t(f)}
                      </option>
                    ))}
                  </select>
                </>
              )}
              {category === "groups" && (
                <>
                  <label>
                    {t("from")}
                    <input
                      type="date"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                    />
                  </label>
                  <label>
                    {t("until")}
                    <input
                      type="date"
                      value={until}
                      min={from}
                      onChange={(e) => setUntil(e.target.value)}
                    />
                  </label>
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={available}
                      onChange={(e) => setAvailable(e.target.checked)}
                    />
                    {t("onlyAvailable")}
                  </label>
                </>
              )}
              <button className="reset" onClick={reset}>
                {t("reset")}
              </button>
            </div>
            <div className="result-line">
              <p>
                <strong>{filtered.length}</strong> {t("results")}
              </p>
              <span>
                TiU · {t("explore")} {t("all").toLowerCase()}
              </span>
            </div>
            {filtered.length === 0 ? (
              <div className="empty">
                <Mountain size={38} />
                <h3>
                  {t(
                    page === "saved"
                      ? "noSaved"
                      : page === "mine"
                        ? "noTrips"
                        : "empty",
                  )}
                </h3>
                <button onClick={reset}>{t("reset")}</button>
              </div>
            ) : map ? (
              <MapView items={filtered} onSelect={setSelected} />
            ) : (
              <div className="card-grid">
                {filtered.map((item) => (
                  <TurKort
                    key={item.id}
                    tur={item}
                    saved={saved.includes(item.id)}
                    onSave={() => toggleSave(item.id)}
                    onOpen={() => setSelected(item)}
                  />
                ))}
              </div>
            )}
            {activeAd && (
              <AdBanner
                ad={activeAd}
                onView={(id) =>
                  setAds((v) =>
                    v.map((a) =>
                      a.id === id ? { ...a, views: a.views + 1 } : a,
                    ),
                  )
                }
                onClick={(id) =>
                  setAds((v) =>
                    v.map((a) =>
                      a.id === id ? { ...a, clicks: a.clicks + 1 } : a,
                    ),
                  )
                }
              />
            )}
          </main>
        </>
      ) : page === "profile" ? (
        <ProfilePage profile={profile} setProfile={setProfile} />
      ) : page === "ads" ? (
        <AdPortal profile={profile} ads={ads} setAds={setAds} />
      ) : (
        <Planner />
      )}
      <footer>
        <div>
          <span className="footer-brand">
            <Mountain /> turlyst.
          </span>
          <p>{t("footer")}</p>
        </div>
        <div>
          <button onClick={() => navigate("ads")}>{t("ads")} ↗</button>
          <p>© TiU · USN 2026</p>
        </div>
      </footer>
      <div className="demo-notice">{t("demo")}</div>
      {selected && (
        <Details
          key={selected.id}
          item={selected}
          onClose={() => setSelected(null)}
          saved={saved.includes(selected.id)}
          onSave={() => toggleSave(selected.id)}
          profile={profile}
          bookings={bookings}
          setBookings={setBookings}
        />
      )}
    </>
  );
}
