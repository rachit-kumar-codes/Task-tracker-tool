export default function TaskCard({ task, onEdit, onDelete, onToggleDone }) {
  const overdue =
    task.dueDate &&
    task.status !== "done" &&
    new Date(task.dueDate) < new Date();

  return (
    <div className={`task-card ${task.status === "done" ? "done-card" : ""}`}>
      <button
        className={`status-toggle ${task.status === "done" ? "checked" : ""}`}
        onClick={() => onToggleDone(task)}
      >
        {task.status}
      </button>

      <div className="task-left">
        <h3>{task.title}</h3>

        {task.description && <p>{task.description}</p>}

        <div className="task-meta">
          <span className={`badge badge-${task.status}`}>{task.status}</span>

          <span className={`badge badge-${task.priority}`}>
            {task.priority}
          </span>

          {task.dueDate && (
            <span className={overdue ? "due-date overdue" : "due-date"}>
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button className="btn btn-ghost" onClick={() => onEdit(task)}>
          Edit
        </button>

        <button className="btn btn-danger" onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
