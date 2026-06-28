import { useState, useEffect } from "react";

export default function TaskForm({ initial, onSubmit, onClose, loading }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!initial) return;

    setForm({
      title: initial.title,
      description: initial.description || "",
      status: initial.status,
      priority: initial.priority,
      dueDate: initial.dueDate?.slice(0, 10) || "",
    });
  }, [initial]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    if (!form.title.trim())
      newErrors.title = "Title is required";

    if (form.title.length > 100)
      newErrors.title = "Maximum 100 characters";

    if (form.description.length > 500)
      newErrors.description = "Maximum 500 characters";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-body">

        <div className="form-group">
          <label>Title *</label>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Task title"
            autoFocus
          />

          {errors.title && (
            <small className="error-msg">{errors.title}</small>
          )}
        </div>

        <div className="form-group">
          <label>Description</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            placeholder="Task description"
          />

          {errors.description && (
            <small className="error-msg">{errors.description}</small>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Status</label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="form-group">
            <label>Priority</label>

            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Due Date</label>

          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
          />
        </div>

      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : initial
            ? "Save Changes"
            : "Create Task"}
        </button>
      </div>
    </form>
  );
}