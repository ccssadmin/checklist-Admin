import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Edit, Eye, Send } from "lucide-react";

import { fetchChecklistTemplates } from "../redux/Action/templateActions";
import ViewTemplateModal from "../components/Viewtemplatemodal";
import EditTemplateModal from "../components/Edittemplatemodal";
import "../style/AllTemplates.css";

export default function AllTemplates() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewTemplate, setViewTemplate] = useState(null);
  const [editTemplate, setEditTemplate] = useState(null);

  const { templates, loading } = useSelector((state) => state.template);

  useEffect(() => {
    dispatch(fetchChecklistTemplates());
  }, [dispatch]);

  const filteredTemplates =
    statusFilter === "ALL"
      ? [...templates].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        )
      : [...templates]
          .filter((tpl) => tpl.status.toUpperCase() === statusFilter)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="templates-page">
      {/* HEADER */}
      <div className="templates-header">
        <div>
          <h1 className="page-title">All Templates</h1>

          {/* FILTER */}
          <div className="template-filters">
            {["ALL", "DRAFT", "COMPLETED"].map((status) => (
              <button
                key={status}
                className={`filter-btn ${
                  statusFilter === status ? "active" : ""
                }`}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={() =>
            navigate("/checklists/create", { state: { mode: "create" } })
          }
        >
          <Plus size={16} />
          Create Template
        </button>
      </div>

      {/* LOADING */}
      {loading && <div className="template-empty">Loading templates…</div>}

      {/* TABLE */}
      {!loading && (
        <table className="templates-table">
          <thead>
            <tr>
              <th>Template</th>
              <th>Checklist Type</th>
              <th>Version</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTemplates.length === 0 && (
              <tr>
                <td colSpan="6" className="template-empty">
                  No templates found
                </td>
              </tr>
            )}

            {filteredTemplates.map((tpl) => (
              <tr key={tpl.template_id}>
                <td>{tpl.template_name}</td>
                <td>{tpl.checklist_type || "—"}</td>
                <td>v{tpl.version}</td>
                <td>
                  <span
                    className={`template-status template-status-${tpl.status.toLowerCase()}`}
                  >
                    {tpl.status}
                  </span>
                </td>
                <td>{new Date(tpl.created_at).toLocaleDateString()}</td>
                <td className="template-actions">
                  <button onClick={() => setEditTemplate(tpl)}>
                    <Edit size={14} /> Edit
                  </button>

                  <button onClick={() => setViewTemplate(tpl)}>
                    <Eye size={14} /> View
                  </button>

                  <button
                    className="assign-btn"
                    onClick={() =>
                      navigate("/checklists/assign-checklists", {
                        state: {
                          mode: "assign",
                          templateId: tpl.template_id,
                        },
                      })
                    }
                  >
                    <Send size={14} /> Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* VIEW MODAL */}
      {viewTemplate && (
        <ViewTemplateModal
          template={viewTemplate}
          onClose={() => setViewTemplate(null)}
        />
      )}

      {/* EDIT MODAL */}
      {editTemplate && (
        <EditTemplateModal
          template={editTemplate}
          onClose={() => setEditTemplate(null)}
          onEdit={() =>
            navigate("/checklists/create", {
              state: {
                mode: "edit",
                templateId: editTemplate.template_id,
              },
            })
          }
        />
      )}
    </div>
  );
}
