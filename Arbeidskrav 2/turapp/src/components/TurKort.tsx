import {
  Heart,
  ArrowUpRight,
  Clock3,
  Route,
  MapPin,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Tur } from "../data/turer";
export default function TurKort({
  tur,
  saved,
  onSave,
  onOpen,
}: {
  tur: Tur;
  saved: boolean;
  onSave: () => void;
  onOpen: () => void;
}) {
  const { t } = useTranslation();
  return (
    <article className="trip-card">
      <div className="card-image">
        <img src={tur.image} alt="" loading="lazy" />
        <span className="image-tag">
          {t(
            tur.category === "groups"
              ? tur.dates!.length > 1
                ? "flexible"
                : "fixed"
              : tur.category === "cabins"
                ? tur.staffed
                  ? "staffed"
                  : "unstaffed"
                : tur.activity,
          )}
        </span>
        <button
          className={`heart ${saved ? "is-saved" : ""}`}
          aria-label={t(saved ? "unsave" : "save")}
          aria-pressed={saved}
          onClick={onSave}
        >
          <Heart size={19} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="card-body">
        <p className="location">
          <MapPin size={13} />
          {tur.omrade}
        </p>
        <button className="card-title" onClick={onOpen}>
          {tur.tittel}
          <ArrowUpRight size={21} />
        </button>
        <div className="card-meta">
          {tur.category === "cabins" ? (
            <span>
              {tur.price} kr / {t("date") === "Startdato" ? "natt" : "night"}
            </span>
          ) : (
            <>
              <span>
                <i className={`difficulty ${tur.grad}`} />
                {t(tur.grad)}
              </span>
              <span>
                <Route size={14} />
                {tur.km} km
              </span>
              <span>
                <Clock3 size={14} />
                {tur.hours} {t("hours")}
              </span>
            </>
          )}
        </div>
        {tur.category === "groups" && (
          <p className="availability">
            <Users size={14} />
            {tur.capacity! > tur.booked!
              ? `${tur.capacity! - tur.booked!} ${t("available")}`
              : t("full")}
          </p>
        )}
      </div>
    </article>
  );
}
