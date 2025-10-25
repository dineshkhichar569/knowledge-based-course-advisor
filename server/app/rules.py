# === Sections (tiers) ===
# A = studied first (foundations) → B → C → D
SECTION_BY_TIER = {
    "A": [
        "Math-I",
        "Programming Fundamentals",
        "Discrete Mathematics",
        "Digital Logic"
    ],
    "B": [
        "DSA",
        "OOP/Java",
        "DBMS",
        "Computer Organization"
    ],
    "C": [
        "Operating Systems",
        "Computer Networks",
        "DAA",
        "Advanced Java"
    ],
    "D": [
        "AI",
        "Machine Learning"
    ]
}

# Friendly names
DISPLAY_NAME = {
    "Math-I": "Mathematics I",
    "Programming Fundamentals": "Programming Fundamentals",
    "Discrete Mathematics": "Discrete Mathematics",
    "Digital Logic": "Digital Logic & Computer Design",

    "DSA": "Data Structures & Algorithms",
    "OOP/Java": "Object-Oriented Programming (Java)",
    "DBMS": "Database Management Systems",
    "Computer Organization": "Computer Organization",

    "Operating Systems": "Operating Systems",
    "Computer Networks": "Computer Networks",
    "DAA": "Design & Analysis of Algorithms",
    "Advanced Java": "Advanced Java",

    "AI": "Artificial Intelligence",
    "Machine Learning": "Machine Learning",
}

# === Prerequisites (direct edges) ===
# Edge A -> B means: B REQUIRES A (so backlog in A blocks B)
PREREQ_GRAPH = {
    # A-tier have no prereqs (foundation)
    "Math-I": [],
    "Programming Fundamentals": [],
    "Discrete Mathematics": [],
    "Digital Logic": [],

    # B-tier (built on A)
    "DSA": ["Programming Fundamentals", "Discrete Mathematics"],
    "OOP/Java": ["Programming Fundamentals"],
    "DBMS": ["Programming Fundamentals"],
    "Computer Organization": ["Digital Logic"],

    # C-tier (built on B)
    "Operating Systems": ["DSA", "Computer Organization"],
    "Computer Networks": ["DSA"],
    "DAA": ["DSA"],
    "Advanced Java": ["OOP/Java"],

    # D-tier (built on C/B)
    "AI": ["DSA"],
    "Machine Learning": ["AI", "DAA"],  # needs AI + DAA
}

def all_courses():
    courses = set()
    for _, arr in SECTION_BY_TIER.items():
        courses.update(arr)
    # include any that are only in prereqs (safety)
    for k, deps in PREREQ_GRAPH.items():
        courses.add(k)
        for d in deps:
            courses.add(d)
    return sorted(courses)

def section_of(course_id: str) -> str:
    for sec, arr in SECTION_BY_TIER.items():
        if course_id in arr:
            return sec
    return "Z"  # unknown (last)
