# 🎓 Knowledge-Based Course Advisor

An **AI-powered Knowledge-Based Agent** that uses **Propositional Logic (Horn Clauses)** to infer which courses a student can take based on their academic backlogs.  
It functions like an intelligent academic advisor — reasoning through course dependencies to allow or block enrollment dynamically.

---

## 🔗 Live Demo  
🔗 Visit the live frontend here: [https://knowledge-based-course-advisor.vercel.app/](https://knowledge-based-course-advisor.vercel.app)

---

## 🧰 Tech Stack

### Frontend:
- React.js  
- TailwindCSS
- Axios (API communication)

### Backend:
- Python (FastAPI)  
- Logical reasoning library (Horn-clause engine)  
- CORS middleware, REST API endpoints

### Deployment:
- Frontend: Vercel  
- Backend: Render

---

## 👨‍💻 Authors
- **Dinesh Khichar**  
- **Harsh Safaya**  
- **Priyanshu Gupta**  
- **Mehak**

---

## 🚀 Run Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
