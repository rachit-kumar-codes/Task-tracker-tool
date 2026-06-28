import { useState, useEffect } from "react";
import TaskCard from "./components/TaskCard";
import TaskForm from "./components/TaskForm";
import Toast from "./components/Toast";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");

  const addToast = (message, type = "success") => {
    setToasts((prev) => [...prev, { id: Date.now(), message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (priority) params.append("priority", priority);

      const res = await fetch(`${API}?${params}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setTasks(data.data);
    } catch (err) {
      addToast(err.message || "Failed to fetch tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [status, priority]);

  const handleCreate = async (form) => {
    setSaving(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setTasks([data.data, ...tasks]);
      setModal(null);
      addToast("Task created!");
    } catch (err) {
      addToast(err.message || "Failed to create task", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (form) => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/${modal._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setTasks(tasks.map((t) => (t._id === data.data._id ? data.data : t)));
      setModal(null);
      addToast("Task updated!");
    } catch (err) {
      addToast(err.message || "Failed to update task", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setTasks(tasks.filter((t) => t._id !== id));
      addToast("Task deleted!");
    } catch (err) {
      addToast(err.message || "Failed to delete task", "error");
    }
  };

  const handleToggleDone = async (task) => {
    const newStatus = task.status === "done" ? "todo" : "done";
    try {
      const res = await fetch(`${API}/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setTasks(tasks.map((t) => (t._id === data.data._id ? data.data : t)));
    } catch (err) {
      addToast(err.message || "Failed to update task", "error");
    }
  };

  const visibleTasks = !search
    ? tasks
    : tasks.filter((task) => {
        const text = search.toLowerCase();

        return (
          task.title.toLowerCase().includes(text) ||
          task.description?.toLowerCase().includes(text)
        );
      });

  const stats = {
    total: tasks.length,
    todo: 0,
    inProgress: 0,
    done: 0,
  };

  tasks.forEach((task) => {
    if (task.status === "todo") stats.todo++;
    if (task.status === "in-progress") stats.inProgress++;
    if (task.status === "done") stats.done++;
  });

  const isEditing = modal && typeof modal === "object";

  return (
    <div className="app">
      <header>
        <div className="logo">
          <h3>
            myTASK <span>tracker</span>
          </h3>
          <em
            style={{
              color: "gray",
              fontSize: "10px",
              letterSpacing: "2px",
              fontFamily: "cursive",
            }}
          >
            A student friendly solution
          </em>
        </div>
        <button className="btn btn-primary" onClick={() => setModal("create")}>
          + New Task
        </button>
      </header>

      <main>
        <div className="stats">
          <div className="stat-card stat-total">
            <div className="stat-num">{stats.total}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card stat-todo">
            <div className="stat-num">{stats.todo}</div>
            <div className="stat-label">To Do</div>
          </div>
          <div className="stat-card stat-progress">
            <div className="stat-num">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card stat-done">
            <div className="stat-num">{stats.done}</div>
            <div className="stat-label">Done</div>
          </div>
        </div>

        <div className="controls">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          {(status || priority || search) && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setStatus("");
                setPriority("");
                setSearch("");
              }}
            >
              Clear
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
          </div>
        ) : visibleTasks.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📋</div>
            <h3>{tasks.length === 0 ? "No tasks yet" : "No matching tasks"}</h3>
            <p>
              {tasks.length === 0
                ? "Create your first task to get started."
                : "Try adjusting your filters."}
            </p>
          </div>
        ) : (
          <div className="task-list">
            {visibleTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={setModal}
                onDelete={handleDelete}
                onToggleDone={handleToggleDone}
              />
            ))}
          </div>
        )}
      </main>

      {modal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setModal(null)}
        >
          <div className="modal">
            <div className="modal-header">
              <h2>{isEditing ? "Edit Task" : "New Task"}</h2>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => setModal(null)}
              >
                ✕
              </button>
            </div>
            <TaskForm
              initial={isEditing ? modal : null}
              onSubmit={isEditing ? handleUpdate : handleCreate}
              onClose={() => setModal(null)}
              loading={saving}
            />
          </div>
        </div>
      )}

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
