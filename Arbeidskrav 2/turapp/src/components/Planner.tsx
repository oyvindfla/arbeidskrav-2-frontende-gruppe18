import { useState } from "react";
import { useTranslation } from "react-i18next";
import MapView from "./MapView";
import { useStored, type SavedRoute } from "../storage";
export default function Planner() {
  const { t } = useTranslation();
  const [points, setPoints] = useState<[number, number][]>([]);
  const [drawing, setDrawing] = useState(true);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [routes, setRoutes] = useStored<SavedRoute[]>("turlyst-routes", []);
  async function importGpx(file?: File) {
    if (!file) return;
    try {
      const doc = new DOMParser().parseFromString(
        await file.text(),
        "application/xml",
      );
      if (doc.querySelector("parsererror")) throw Error();
      const result = Array.from(doc.querySelectorAll("trkpt,rtept")).map(
        (p) =>
          [Number(p.getAttribute("lat")), Number(p.getAttribute("lon"))] as [
            number,
            number,
          ],
      );
      if (
        result.length < 2 ||
        result.length > 20000 ||
        result.some(
          (p) =>
            !Number.isFinite(p[0]) ||
            !Number.isFinite(p[1]) ||
            Math.abs(p[0]) > 90 ||
            Math.abs(p[1]) > 180,
        )
      )
        throw Error();
      setPoints(result);
      setDrawing(false);
      setError("");
    } catch {
      setError(t("invalidGpx"));
    }
  }
  function download() {
    const xml = `<?xml version="1.0"?><gpx version="1.1" creator="Turlyst" xmlns="http://www.topografix.com/GPX/1/1"><trk><trkseg>${points.map((p) => `<trkpt lat="${p[0]}" lon="${p[1]}"/>`).join("")}</trkseg></trk></gpx>`;
    const url = URL.createObjectURL(
      new Blob([xml], { type: "application/gpx+xml" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "turlyst.gpx";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <section className="workspace">
      <h1>{t("planner")}</h1>
      <p>{t("plannerIntro")}</p>
      <div className="toolbar">
        <label className="check">
          <input
            type="checkbox"
            checked={drawing}
            onChange={(e) => setDrawing(e.target.checked)}
          />
          {t("drawing")}
        </label>
        <label className="file-button">
          {t("import")}
          <input
            type="file"
            accept=".gpx"
            onChange={(e) => void importGpx(e.target.files?.[0])}
          />
        </label>
        <button onClick={() => setPoints([])}>{t("clear")}</button>
        <button disabled={points.length < 2} onClick={download}>
          {t("export")}
        </button>
        <span>
          {points.length} {t("routePoints")}
        </span>
      </div>
      {error && <p role="alert">{error}</p>}
      <MapView
        items={[]}
        onSelect={() => {}}
        points={points}
        drawing={drawing}
        onPoint={(p) => setPoints((v) => [...v, p])}
      />
      <form
        className="inline-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (points.length > 1 && name.trim()) {
            setRoutes((v) => [
              ...v,
              { id: crypto.randomUUID(), name: name.trim(), points },
            ]);
            setName("");
          }
        }}
      >
        <label>
          {t("routeName")}
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <button className="primary" disabled={points.length < 2}>
          {t("saveRoute")}
        </button>
      </form>
      <h2>{t("localRoutes")}</h2>
      {routes.map((r) => (
        <div className="saved-row" key={r.id}>
          <button
            onClick={() => {
              setPoints(r.points);
              setName(r.name);
              setDrawing(false);
            }}
          >
            {r.name} · {r.points.length} {t("routePoints")}
          </button>
          <button
            onClick={() => setRoutes((v) => v.filter((x) => x.id !== r.id))}
          >
            {t("delete")}
          </button>
        </div>
      ))}
    </section>
  );
}
