from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Set, Tuple
from .models import BackReq, ExplainReq
from .rules import PREREQ_GRAPH, DISPLAY_NAME, SECTION_BY_TIER, all_courses, section_of

app = FastAPI(title="Backlog-Based Course Advisor")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"]
)

def build_reverse_graph() -> Dict[str, List[str]]:
    rev: Dict[str, List[str]] = {c: [] for c in all_courses()}
    for course, deps in PREREQ_GRAPH.items():
        for d in deps:
            rev[d].append(course)
    return rev

REV = build_reverse_graph()

from collections import deque
def closure_blocked(backs: Set[str]) -> Tuple[Set[str], Dict[str, List[str]]]:
    blocked: Set[str] = set(backs)
    explain: Dict[str, List[str]] = {b: [f"Backlog in {b}"] for b in backs}
    q = deque(backs)
    while q:
        a = q.popleft()
        for dep in REV.get(a, []):
            if dep not in blocked:
                blocked.add(dep)
                explain.setdefault(dep, []).append(f"Requires {a}")
                q.append(dep)
    return blocked, explain

@app.get("/catalog")
def catalog():
    def item(cid: str):
        return {"id": cid, "name": DISPLAY_NAME.get(cid, cid), "section": section_of(cid)}
    # sections in order A→B→C→D
    sections = []
    for sec in ["A","B","C","D"]:
        sections.append({
            "section": sec,
            "title": f"Section {sec}",
            "courses": [item(c) for c in SECTION_BY_TIER[sec]]
        })
    return {
        "sections": sections,
        "rules_note": "Backlog in a course blocks all dependents in later sections."
    }

@app.post("/decide")
def decide(req: BackReq):
    backs = set(req.backs)
    cs = set(all_courses())
    blocked, explain = closure_blocked(backs)
    allowed = sorted(list(cs - blocked), key=lambda x: (section_of(x), x))
    blocked_list = sorted(list(blocked), key=lambda x: (section_of(x), x))
    pretty_explain = {k: explain[k] for k in blocked_list}
    return {"allowed": allowed, "blocked": blocked_list, "explain": pretty_explain}

@app.post("/why")
def why(req: ExplainReq):
    backs = set(req.backs)
    blocked, explain = closure_blocked(backs)
    reason = explain.get(req.course, [])
    return {"course": req.course, "blocked": req.course in blocked, "reasons": reason}
