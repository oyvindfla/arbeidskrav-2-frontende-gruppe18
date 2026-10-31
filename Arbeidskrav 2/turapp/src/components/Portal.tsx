import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Profile, Ad } from "../storage";
export function ProfilePage({
  profile,
  setProfile,
}: {
  profile: Profile | null;
  setProfile: (p: Profile | null) => void;
}) {
  const { t } = useTranslation();
  const [notice, setNotice] = useState(false);
  return (
    <section className="workspace narrow">
      <p className="eyebrow">TURLYST</p>
      <h1>{t("profile")}</h1>
      <p>{t("profileIntro")}</p>
      <form
        className="stack-form"
        key={profile?.email || "new"}
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          setProfile({
            name: String(data.get("name")).trim(),
            email: String(data.get("email")),
            role: String(data.get("role")),
          });
          setNotice(true);
        }}
      >
        <label>
          {t("name")}
          <input
            name="name"
            required
            maxLength={80}
            defaultValue={profile?.name}
          />
        </label>
        <label>
          {t("email")}
          <input
            name="email"
            required
            type="email"
            defaultValue={profile?.email}
          />
        </label>
        <label>
          {t("role")}
          <select name="role" defaultValue={profile?.role || "user"}>
            {["user", "leader", "owner", "advertiser", "editor"].map((r) => (
              <option key={r} value={r}>
                {t(r)}
              </option>
            ))}
          </select>
        </label>
        <button className="primary">{t("saveProfile")}</button>
        {notice && <p role="status">{t("savedProfile")}</p>}
      </form>
      {profile && (
        <button
          onClick={() => {
            setProfile(null);
            setNotice(false);
          }}
        >
          {t("logout")}
        </button>
      )}
    </section>
  );
}
export function AdPortal({
  profile,
  ads,
  setAds,
}: {
  profile: Profile | null;
  ads: Ad[];
  setAds: (a: Ad[]) => void;
}) {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  return (
    <section className="workspace narrow">
      <p className="eyebrow">TURLYST PARTNER</p>
      <h1>{t("ads")}</h1>
      <p>{t("adIntro")}</p>
      {!profile ? (
        <p>{t("needProfile")}</p>
      ) : (
        <form
          className="stack-form"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const from = String(data.get("from")),
              until = String(data.get("until"));
            if (until < from) {
              setError(t("datesError"));
              return;
            }
            setAds([
              ...ads,
              {
                id: crypto.randomUUID(),
                title: String(data.get("title")),
                body: String(data.get("body")),
                url: String(data.get("url")),
                image: String(data.get("image")),
                category: String(data.get("category")),
                from,
                until,
                status: "pending",
                views: 0,
                clicks: 0,
              },
            ]);
            setError("");
            e.currentTarget.reset();
          }}
        >
          <label>
            {t("adTitle")}
            <input name="title" required maxLength={100} />
          </label>
          <label>
            {t("adBody")}
            <textarea name="body" required maxLength={500} />
          </label>
          <label>
            {t("adUrl")}
            <input name="url" type="url" pattern="https://.*" required />
          </label>
          <label>
            {t("adImage")}
            <input name="image" type="url" pattern="https://.*" />
          </label>
          <label>
            {t("category")}
            <select name="category">
              {["gear", "meals", "accommodation"].map((c) => (
                <option key={c} value={c}>
                  {t(c)}
                </option>
              ))}
            </select>
          </label>
          <div className="two-col">
            <label>
              {t("from")}
              <input name="from" type="date" required />
            </label>
            <label>
              {t("until")}
              <input name="until" type="date" required />
            </label>
          </div>
          <button className="primary">{t("createAd")}</button>
          {error && <p role="alert">{error}</p>}
        </form>
      )}
      <h2>{t("ads")}</h2>
      {profile?.role === "editor" && <p>{t("editorNote")}</p>}
      {ads.length === 0 && <p>{t("noAds")}</p>}
      {ads.map((ad) => (
        <article className="ad-review" key={ad.id}>
          <strong>{ad.title}</strong>
          <p>{ad.body}</p>
          <p>
            {ad.from} – {ad.until} · {t(ad.status)}
          </p>
          <p>
            {ad.views} {t("views")} · {ad.clicks} {t("clicks")} ·{" "}
            {(ad.views * 0.05 + ad.clicks * 2).toFixed(2)} kr (demo)
          </p>
          {profile?.role === "editor" && (
            <div className="toolbar">
              <button
                onClick={() =>
                  setAds(
                    ads.map((a) =>
                      a.id === ad.id ? { ...a, status: "approved" } : a,
                    ),
                  )
                }
              >
                {t("approve")}
              </button>
              <button
                onClick={() =>
                  setAds(
                    ads.map((a) =>
                      a.id === ad.id ? { ...a, status: "rejected" } : a,
                    ),
                  )
                }
              >
                {t("reject")}
              </button>
            </div>
          )}
        </article>
      ))}
    </section>
  );
}
