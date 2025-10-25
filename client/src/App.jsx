import { useEffect, useState } from "react";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000" });

export default function App() {
  const [catalog, setCatalog] = useState({ sections: [] });
  const [backs, setBacks] = useState([]);
  const [res, setRes] = useState(null);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    API.get("/catalog").then((r) => setCatalog(r.data));
  }, []);

  const toggle = (id) => {
    setRes(null);
    setInfo(null);
    setBacks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const decide = async () => {
    const r = await API.post("/decide", { backs });
    setRes(r.data);
    setInfo(null);
  };

  const why = async (course) => {
    const r = await API.post("/why", { course, backs });
    setInfo(r.data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/60 ring-1 ring-slate-700 px-3 py-1 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Advisor
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Backlog-Based Course Advisor
          </h1>
          <p className="mt-2 max-w-3xl text-slate-300">
            Select courses where you have a backlog. Sections follow real study
            order: <span className="font-semibold">A (first)</span> → B → C → D.
          </p>
        </header>

        {/* Grid: Left (inputs), Right (rule card) */}
        <section className="grid gap-6 md:grid-cols-2">
          {/* Inputs */}
          <div className="rounded-2xl bg-slate-900/60 ring-1 ring-slate-800/80 shadow-xl shadow-black/30">
            {catalog.sections.map((sec) => (
              <div key={sec.section} className="border-b border-slate-800/60 last:border-none">
                <div className="flex items-center justify-between px-5 pt-5">
                  <h3 className="text-lg font-semibold">
                    Section {sec.section}
                  </h3>
                  <span className="rounded-full bg-slate-800/80 ring-1 ring-slate-700 px-2.5 py-1 text-xs text-slate-300">
                    {sec.courses.length} courses
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
                  {sec.courses.map((c) => (
                    <label
                      key={c.id}
                      className={[
                        "group flex items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-900/70 px-4 py-3 transition",
                        backs.includes(c.id)
                          ? "ring-1 ring-rose-500/40 bg-gradient-to-r from-rose-500/10 to-transparent"
                          : "hover:border-slate-700 hover:bg-slate-900",
                      ].join(" ")}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-rose-500 focus:ring-rose-500/40"
                        checked={backs.includes(c.id)}
                        onChange={() => toggle(c.id)}
                      />
                      <span className="text-sm text-slate-200">{c.name}</span>
                      {backs.includes(c.id) && (
                        <span className="ml-auto rounded-md bg-rose-500/15 px-2 py-0.5 text-[10px] font-semibold text-rose-300 ring-1 ring-rose-500/30">
                          backlog
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between gap-3 border-t border-slate-800/60 px-5 py-4">
              <button
                onClick={decide}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 active:scale-[0.99] transition"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 12l2 2 4-4 1.5 1.5L11 17 7.5 13.5 9 12zm11-8H4a2 2 0 00-2 2v14l4-4h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
                </svg>
                Decide Eligible Courses
              </button>

              <div className="text-xs text-slate-400 hidden sm:block">
                Tip: backlog in A blocks all dependents.
              </div>
            </div>
          </div>

          {/* Rules Card */}
          <div className="rounded-2xl bg-slate-900/60 ring-1 ring-slate-800/80 p-6 shadow-xl shadow-black/30">
            <h3 className="text-lg font-semibold">Rule</h3>
            <p className="mt-2 text-slate-300">
              If you have a backlog in <b>A</b>, you cannot take any course that{" "}
              <b>requires A</b> (directly or indirectly). Sections ensure proper
              order.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>Section A: Foundations (studied first)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                <span>Section B: Core built on A</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                <span>Section C: Advanced core built on B</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
                <span>Section D: Specialized/advanced built on C/B</span>
              </li>
            </ul>
            <div className="mt-6 rounded-xl bg-slate-950/60 ring-1 ring-slate-800 p-4 text-xs text-slate-300">
              Examples:
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>
                  Backlog in <b>DSA</b> → blocks <i>DAA</i>, <i>AI</i>,{" "}
                  <i>Operating Systems</i>, <i>Computer Networks</i>,{" "}
                  <i>Machine Learning</i>…
                </li>
                <li>
                  Backlog in <b>OOP/Java</b> → blocks <i>Advanced Java</i>.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Results */}
        {res && (
          <section className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Allowed */}
            <div className="rounded-2xl bg-slate-900/60 ring-1 ring-slate-800/80 p-6 shadow-xl shadow-black/30">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">✅ You can take</h3>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
                  {res.allowed.length}
                </span>
              </div>

              {res.allowed.length === 0 ? (
                <p className="text-slate-300">None</p>
              ) : (
                <ul className="space-y-2">
                  {res.allowed.map((c) => (
                    <li
                      key={c}
                      className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-950/50 px-3 py-2 text-sm"
                    >
                      <span>{c}</span>
                      <button
                        onClick={() => why(c)}
                        className="text-xs text-slate-300 hover:text-white underline decoration-slate-600 hover:decoration-slate-300"
                      >
                        why?
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Blocked */}
            <div className="rounded-2xl bg-slate-900/60 ring-1 ring-slate-800/80 p-6 shadow-xl shadow-black/30">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">⛔ Blocked</h3>
                <span className="rounded-full bg-rose-500/15 px-2.5 py-0.5 text-xs font-semibold text-rose-300 ring-1 ring-rose-500/30">
                  {res.blocked.length}
                </span>
              </div>

              {res.blocked.length === 0 ? (
                <p className="text-slate-300">None</p>
              ) : (
                <ul className="space-y-2">
                  {res.blocked.map((c) => (
                    <li
                      key={c}
                      className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-950/50 px-3 py-2 text-sm"
                    >
                      <span>{c}</span>
                      <button
                        onClick={() => why(c)}
                        className="text-xs text-slate-300 hover:text-white underline decoration-slate-600 hover:decoration-slate-300"
                      >
                        why?
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {/* Explanation Drawer */}
        {info && (
          <section className="mt-6">
            <div className="rounded-2xl bg-slate-900/60 ring-1 ring-slate-800/80 p-6 shadow-xl shadow-black/30">
              <h3 className="text-lg font-semibold">
                Explanation:{" "}
                <span className="text-slate-200">{info.course}</span>
              </h3>
              <p className="mt-1 text-sm">
                Status:{" "}
                {info.blocked ? (
                  <span className="font-semibold text-rose-300">⛔ Blocked</span>
                ) : (
                  <span className="font-semibold text-emerald-300">
                    ✅ Allowed
                  </span>
                )}
              </p>

              {info.reasons?.length ? (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
                  {info.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-slate-300">No blocking reasons.</p>
              )}
            </div>
          </section>
        )}

        {/* Footer */}
<footer className="mt-16 border-t border-slate-800/70 bg-gradient-to-b from-slate-900/80 via-slate-950 to-black text-slate-400">
  <div className="mx-auto max-w-7xl px-6 py-10">
    {/* Upper section */}
    <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
      {/* Column 1 - Logo / Description */}
      <div>
        <h2 className="text-xl font-bold text-slate-100">Course Advisor</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          A smart AI-powered advisor that helps students check course
          eligibility based on their previous semester backlogs. Built with
          modern web technologies for speed and clarity.
        </p>
      </div>

      {/* Column 2 - Quick Links */}
      <div className="flex flex-col">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">
          Technologies
        </h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Python (FastAPI)
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            React.js
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            TailwindCSS
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-violet-400" />
            Axios + REST API
          </li>
        </ul>
      </div>

      {/* Column 3 - Team */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">
          Built by
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="hover:text-emerald-400 transition">
            Dinesh Khichar
          </li>
          <li className="hover:text-emerald-400 transition">
            Harsh Safaya
          </li>
          <li className="hover:text-emerald-400 transition">
            Priyanshu Gupta
          </li>
          <li className="hover:text-emerald-400 transition">
            Mehak
          </li>
        </ul>
      </div>
    </div>

    {/* Divider */}
    <div className="my-8 h-px w-full bg-slate-800/70" />

    {/* Lower section */}
    <div className="flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
      <p className="text-slate-500">
        © {new Date().getFullYear()} Course Advisor. All rights reserved.
      </p>
      <div className="flex items-center gap-4 text-slate-400">
        <span className="text-xs uppercase tracking-wide text-slate-500">
          Built with ❤️ using
        </span>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="font-semibold">Python</span>
          <span className="text-slate-500">+</span>
          <span className="font-semibold">React</span>
          <span className="text-slate-500">+</span>
          <span className="font-semibold">TailwindCSS</span>
        </div>
      </div>
    </div>
  </div>
</footer>

      </div>
    </div>
  );
}
