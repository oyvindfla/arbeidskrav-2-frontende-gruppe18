import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Heart, ExternalLink } from "lucide-react";
import type { Tur } from "../data/turer";
import { useStored, type Profile, type Booking, type Post } from "../storage";
import MapView from "./MapView";
export default function Details({
  item,
  onClose,
  saved,
  onSave,
  profile,
  bookings,
  setBookings,
}: {
  item: Tur;
  onClose: () => void;
  saved: boolean;
  onSave: () => void;
  profile: Profile | null;
  bookings: Booking[];
  setBookings: (v: Booking[]) => void;
}) {
  const { t, i18n } = useTranslation();
  const dialog = useRef<HTMLDialogElement>(null);
  const [date, setDate] = useState(item.dates?.[0] || "");
  const [notice, setNotice] = useState("");
  const [reviews, setReviews] = useStored<Post[]>("turlyst-reviews", []);
  const [messages, setMessages] = useStored<Post[]>("turlyst-messages", []);
  useEffect(() => {
    const el = dialog.current;
    el?.showModal();
    return () => el?.close();
  }, []);
  const booking = bookings.find((b) => b.trip === item.id);
  const full =
    item.capacity !== undefined &&
    item.booked! +
      bookings.filter((b) => b.trip === item.id && b.status === "joined")
        .length >=
      item.capacity;
  function book(status: Booking["status"]) {
    if (!profile) {
      setNotice(t("needProfile"));
      return;
    }
    if (status === "joined" && full) return;
    if (
      status === "joined" &&
      bookings.some(
        (b) => b.trip !== item.id && b.date === date && b.status === "joined",
      )
    ) {
      setNotice(t("overlap"));
      return;
    }
    setBookings([
      ...bookings.filter((b) => b.trip !== item.id),
      { trip: item.id, date, status },
    ]);
    setNotice("");
  }
  return (
    <dialog
      ref={dialog}
      className="detail-dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="detail-head">
        <span>Turlyst / {t(item.category)}</span>
        <button onClick={onClose} aria-label={t("close")}>
          <X />
        </button>
      </div>
      <img className="detail-image" src={item.image} alt="" />
      <div className="detail-content">
        <p className="eyebrow">{item.omrade}</p>
        <h1>{item.tittel}</h1>
        <button className="save-detail" onClick={onSave}>
          <Heart size={17} fill={saved ? "currentColor" : "none"} />
          {t(saved ? "unsave" : "save")}
        </button>
        <h2>{t("about")}</h2>
        <p>{item.description}</p>
        <p>
          {t(item.grad)} · {item.km} km · {item.hours} {t("hours")}
        </p>
        {item.facilities && (
          <p>
            {t("facilities")}: {item.facilities.map((f) => t(f)).join(", ")}
          </p>
        )}
        {item.category === "groups" && (
          <section className="booking-box">
            <h2>{t(item.dates!.length > 1 ? "flexible" : "fixed")}</h2>
            <p>{t("capacityNote")}</p>
            <label>
              {t("date")}
              <select value={date} onChange={(e) => setDate(e.target.value)}>
                {item.dates!.map((d) => (
                  <option key={d} value={d}>
                    {new Date(d + "T12:00:00").toLocaleDateString(
                      i18n.language === "en" ? "en-GB" : "nb-NO",
                      { dateStyle: "long" },
                    )}
                  </option>
                ))}
              </select>
            </label>
            <p>
              {full
                ? t("full")
                : `${item.capacity! - item.booked! - (booking?.status === "joined" ? 1 : 0)} ${t("available")}`}
            </p>
            {booking && (
              <p className="status">
                {t(booking.status === "joined" ? "joined" : "interested")} ·{" "}
                {booking.date}
              </p>
            )}
            <div className="toolbar">
              <button onClick={() => book("interest")}>{t("interest")}</button>
              <button
                className="primary"
                disabled={full || booking?.status === "joined"}
                onClick={() => book("joined")}
              >
                {t("join")}
              </button>
              {booking && (
                <button
                  onClick={() =>
                    setBookings(bookings.filter((b) => b.trip !== item.id))
                  }
                >
                  {t("cancel")}
                </button>
              )}
            </div>
            {notice && <p role="alert">{notice}</p>}
          </section>
        )}
        <h2>{t("route")}</h2>
        <p>{t("routeNote")}</p>
        <MapView items={[item]} onSelect={() => {}} />
        <h2>{t("weather")}</h2>
        <p>{t("weatherNote")}</p>
        <a
          className="external"
          target="_blank"
          rel="noreferrer"
          href={`https://www.yr.no/${i18n.language === "en" ? "en" : "nb"}/værvarsel/daglig-tabell/${item.lat},${item.lng}`}
        >
          {t("weatherLink")}
          <ExternalLink size={15} />
        </a>
        <h2>{t("review")}</h2>
        {reviews.filter((r) => r.trip === item.id).length === 0 && (
          <p>{t("noReviews")}</p>
        )}
        {reviews
          .filter((r) => r.trip === item.id)
          .map((r) => (
            <div className="post" key={r.id}>
              <strong>
                {r.name} · {"★".repeat(r.stars || 0)}
              </strong>
              <p>{r.text}</p>
            </div>
          ))}
        <form
          className="stack-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!profile) {
              setNotice(t("needProfile"));
              return;
            }
            const data = new FormData(e.currentTarget);
            setReviews((v) => [
              ...v,
              {
                id: crypto.randomUUID(),
                trip: item.id,
                name: profile.name,
                text: String(data.get("text")).trim(),
                stars: Number(data.get("stars")),
              },
            ]);
            e.currentTarget.reset();
          }}
        >
          <label>
            {t("stars")}
            <select name="stars">
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
          <label>
            {t("reviewText")}
            <textarea name="text" required maxLength={1000} />
          </label>
          <button className="primary" disabled={!profile}>
            {t("submit")}
          </button>
          {!profile && <p>{t("needProfile")}</p>}
        </form>
        {item.category === "groups" && (
          <>
            <h2>{t("chat")}</h2>
            <p>{t("noMessages")}</p>
            {messages
              .filter((m) => m.trip === item.id)
              .map((m) => (
                <div key={m.id} className="post">
                  <strong>{m.name}</strong>
                  <p>{m.text}</p>
                </div>
              ))}
            <form
              className="stack-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!profile) return;
                const data = new FormData(e.currentTarget);
                const text = String(data.get("message")).trim();
                if (text)
                  setMessages((v) => [
                    ...v,
                    {
                      id: crypto.randomUUID(),
                      trip: item.id,
                      name: profile.name,
                      text,
                    },
                  ]);
                e.currentTarget.reset();
              }}
            >
              <label>
                {t("message")}
                <textarea name="message" required maxLength={2000} />
              </label>
              <button disabled={!profile} className="primary">
                {t("send")}
              </button>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
