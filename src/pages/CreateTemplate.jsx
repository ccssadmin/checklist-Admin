import { useEffect, useState } from "react";
import "../style/CreateTemplate.css";
import { Copy, Upload, Eye, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import VersionHistoryModal from "../components/VersionHistoryModal";
import CloneChecklistModal from "../components/CloneChecklistModal";
import ImportChecklistModal from "../components/ImportChecklistModal";
import PreviewChecklistModal from "../components/PreviewChecklistModal";
import { useDispatch, useSelector } from "react-redux";
import { saveChecklistTemplate } from "../redux/Action/templateActions";
import { useLocation } from "react-router-dom";
import { fetchChecklistTemplateById } from "../redux/Action/templateActions";
import { resetTemplateState } from "../redux/slices/templateSlice";
import axiosInstance from "../api/axiosinstance";
import {
  fetchChecklistTypes,
  createChecklistType,
} from "../redux/Action/masterAction";
import imageCompression from "browser-image-compression";

export default function CreateCheckList() {
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedMetaCategory, setSelectedMetaCategory] = useState("");
  const [showAddMetaCategory, setShowAddMetaCategory] = useState(false);
  const [newMetaCategoryName, setNewMetaCategoryName] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [showClone, setShowClone] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [version, setVersion] = useState(1);
  const dispatch = useDispatch();
  const location = useLocation();
  const isEditMode = location.state?.mode === "edit";
  const editTemplateId = location.state?.templateId;
  const { templateById } = useSelector((state) => state.template);
  const { checklistTypes } = useSelector((state) => state.master);
  const [categories, setCategories] = useState([
    "Label",
    "Yes/No",
    "Numeric",
    "Text",
    "Photo",
    "Barcode",
  ]);

  useEffect(() => {
    dispatch(fetchChecklistTypes());
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode && editTemplateId) {
      dispatch(fetchChecklistTemplateById(editTemplateId));
    }
  }, [isEditMode, editTemplateId, dispatch]);

  useEffect(() => {
    return () => {
      // clear redux template state when leaving page
      dispatch(resetTemplateState());

      // also clear local form
      resetForm();
    };
  }, [dispatch]);
  useEffect(() => {
    if (!templateById || !isEditMode) return; // 🔥 ensure sections JSON is parsed
    let parsedSections = templateById.sections;

    if (typeof parsedSections === "string") {
      try {
        parsedSections = JSON.parse(parsedSections);
      } catch {
        parsedSections = [];
      }
    }
    // 🔹 BASIC FIELDS
    setTemplateName(templateById.template_name || "");
    setSelectedMetaCategory(templateById.checklist_type || "");
    if (isEditMode) {
      setVersion((templateById.version || 1) + 1);
    } else {
      setVersion(1);
    }

    const sourceType = templateById.source_type;

    /* =====================================================
     CANVAS RESTORE
  ===================================================== */
    if (sourceType === "CANVAS") {
      setViewMode("canvas");

      const restoredQuestions = [];

      parsedSections?.forEach((section) => {
        section.items?.forEach((item) => {
          const field = item.fields?.[0];

          restoredQuestions.push({
            id: Date.now() + Math.random(),
            type: reverseMapQuestionType(field?.field_type),
            label: item.label || field?.field_name,
            required: false,
            min: field?.min || "",
            max: field?.max || "",
            category: section.section_name,
          });
        });
      });

      setQuestions(restoredQuestions);
    }

    /* =====================================================
     EXCEL RESTORE
  ===================================================== */
    if (sourceType === "EXCEL") {
      setViewMode("excel");
      setChecklistType("task"); // adjust if needed

      const rows = parsedSections?.[0]?.items || [];
      if (rows.length === 0) return;

      const columnOrder = [];

      rows.forEach((row) => {
        row.fields?.forEach((field) => {
          if (!columnOrder.find((c) => c.name === field.field_name)) {
            columnOrder.push({
              name: field.field_name,
              type: field.field_type?.toLowerCase() || "text",
            });
          }
        });
      });

      // 🔹 Build dynamic columns
      const dynamicColumns = [
        { id: 1, name: "S.No", type: "number", width: "60px", editable: false },
      ];

      columnOrder.forEach((col, index) => {
        dynamicColumns.push({
          id: index + 2,
          name: col.name,
          type:
            col.type === "yesno"
              ? "yesno"
              : col.type === "checkbox"
                ? "checkbox"
                : col.type === "photo"
                  ? "photo"
                  : col.type === "barcode"
                    ? "barcode"
                    : col.type === "number"
                      ? "number"
                      : col.type === "label"
                        ? "label"
                        : "text",
          width: "150px",
          editable: true,
        });
      });

      setExcelColumns(dynamicColumns);

      // 🔹 Restore row values correctly
      const restoredRows = rows.map((row, rowIndex) => {
        const rowData = {};

        row.fields?.forEach((field, index) => {
          const columnId = field.sequence + 1;
          // PHOTO COLUMN
          if (field.field_type === "PHOTO") {
            if (index === 0 && row.image_url) {
              rowData[columnId] = {
                url: row.image_url,
              };
            } else {
              rowData[columnId] = null;
            }
          }

          // YES / NO
          else if (field.field_type === "YESNO") {
            rowData[columnId] =
              field.field_value === true
                ? true
                : field.field_value === false
                  ? false
                  : "";
          }

          // CHECKBOX
          else if (field.field_type === "CHECKBOX") {
            rowData[columnId] = field.field_value ?? false;
          }

          // TEXT / NUMERIC / BARCODE
          else {
            rowData[columnId] = field.field_value ?? "";
          }
        });

        return {
          id: Date.now() + rowIndex,
          sno: rowIndex + 1,
          data: rowData,
        };
      });

      setExcelTableRows(restoredRows);
    }
  }, [templateById, isEditMode]);

  const { loading, success, error, message } = useSelector(
    (state) => state.template,
  );

  useEffect(() => {
    if (success) {
      toast.success(message || "Checklist saved successfully ✅");

      resetForm();
      setViewMode(null); // 🔥 clear builder mode

      dispatch(resetTemplateState());
    }

    if (error) {
      toast.error(
        typeof error === "string" ? error : "Failed to save checklist ❌",
      );

      dispatch(resetTemplateState()); // 🔥 CLEAR ERROR STATE
    }
  }, [success, error, message, dispatch]);

  useSelector((state) => state.master || {});

  // Category management

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // View Mode State
  const [viewMode, setViewMode] = useState(null); // null, 'canvas', or 'excel'

  // NEW: Checklist Type (Daily vs Task-based)
  const [checklistType, setChecklistType] = useState(null); // null, "daily" or "task"

  // Excel Table Section State
  const [excelTableRows, setExcelTableRows] = useState([]);
  const [excelColumns, setExcelColumns] = useState([
    { id: 1, name: "S.No", type: "number", width: "60px", editable: false },
    {
      id: 2,
      name: "Points For Checking",
      type: "text",
      width: "200px",
      editable: true,
    },
    {
      id: 3,
      name: "Photo for references",
      type: "photo",
      width: "120px",
      editable: true,
    },
    {
      id: 4,
      name: "Judgement Criteria",
      type: "text",
      width: "150px",
      editable: true,
    },
    {
      id: 5,
      name: "Checking Method",
      type: "text",
      width: "150px",
      editable: true,
    },
  ]);
  const [dailyCheckDays, setDailyCheckDays] = useState(31);
  const [selectedExcelItem, setSelectedExcelItem] = useState(null); // { type: 'column' | 'row', data: object }

  // Excel Configuration
  const [showExcelConfig, setShowExcelConfig] = useState(false);
  const [tempRowCount, setTempRowCount] = useState(5);
  const [tempColCount, setTempColCount] = useState(5);
  const resetForm = () => {
    // metadata
    setTemplateName("");
    setSelectedMetaCategory("");
    setVersion(1);

    // canvas
    setQuestions([]);
    setSelected(null);

    // excel
    setChecklistType(null);
    setExcelTableRows([]);
    setExcelColumns([
      { id: 1, name: "S.No", type: "number", width: "60px", editable: false },
      {
        id: 2,
        name: "Points For Checking",
        type: "text",
        width: "200px",
        editable: true,
      },
      {
        id: 3,
        name: "Photo for references",
        type: "photo",
        width: "120px",
        editable: true,
      },
      {
        id: 4,
        name: "Judgement Criteria",
        type: "text",
        width: "150px",
        editable: true,
      },
      {
        id: 5,
        name: "Checking Method",
        type: "text",
        width: "150px",
        editable: true,
      },
    ]);
    setDailyCheckDays(31);
    setSelectedExcelItem(null);
    setShowExcelConfig(false);

    // builder mode
    setViewMode(null);

    // modals
    setShowPreview(false);
    setShowClone(false);
    setShowImport(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");
    if (!type) return;

    const newQ = {
      id: Date.now(),
      type,
      label: `${type} question`,
      required: false,
      min: "",
      max: "",
      category: "",
    };

    setQuestions((prev) => [...prev, newQ]);
    setSelected(newQ);
  };

  const updateQuestion = (field, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === selected.id ? { ...q, [field]: value } : q)),
    );
    setSelected({ ...selected, [field]: value });
  };

  const deleteQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  // Unified Add Category Handler - Used for both metadata categories and question types
  const handleAddCategory = () => {
    if (
      newCategoryName.trim() &&
      !categories.includes(newCategoryName.trim())
    ) {
      setCategories([...categories, newCategoryName.trim()]);
      setNewCategoryName("");
      setShowAddCategory(false);
    }
  };

  // Unified Add Meta Category Handler
  const handleAddMetaCategory = async () => {
    if (!newMetaCategoryName.trim()) return;

    const payload = {
      typeCode: newMetaCategoryName.trim().toUpperCase().replace(/\s/g, "_"),
      typeName: newMetaCategoryName.trim(),
      description: "",
    };

    const result = await dispatch(createChecklistType(payload));

    if (createChecklistType.fulfilled.match(result)) {
      toast.success("Checklist type created ✅");

      setSelectedMetaCategory(newMetaCategoryName.trim());
      setNewMetaCategoryName("");
      setShowAddMetaCategory(false);

      dispatch(fetchChecklistTypes()); // optional refresh
    } else {
      toast.error(result.payload || "Failed to create checklist type ❌");
    }
  };

  // Excel Table Functions
  const generateExcelTable = () => {
    // Generate columns
    const cols = [
      { id: 1, name: "S.No", type: "number", width: "60px", editable: false },
    ];
    for (let i = 2; i <= tempColCount; i++) {
      cols.push({
        id: i,
        name: `Column ${i}`,
        type: "text",
        width: "150px",
        editable: true,
      });
    }
    setExcelColumns(cols);

    // Generate rows
    const rows = [];
    for (let i = 1; i <= tempRowCount; i++) {
      rows.push({
        id: Date.now() + i,
        sno: i,
        data: {},
      });
    }
    setExcelTableRows(rows);
    setShowExcelConfig(false);
  };

  const addExcelColumn = () => {
    const newColumn = {
      id: Date.now(),
      name: `Column ${excelColumns.length}`,
      type: "text",
      width: "150px",
      editable: true,
    };
    setExcelColumns([...excelColumns, newColumn]);
  };

  const updateExcelColumn = (columnId, field, value) => {
    const updatedColumns = excelColumns.map((col) =>
      col.id === columnId ? { ...col, [field]: value } : col,
    );
    setExcelColumns(updatedColumns);

    // Update selected item if it's the current column
    if (
      selectedExcelItem?.type === "column" &&
      selectedExcelItem.data.id === columnId
    ) {
      setSelectedExcelItem({
        ...selectedExcelItem,
        data: { ...selectedExcelItem.data, [field]: value },
      });
    }
  };

  const deleteExcelColumn = (columnId) => {
    setExcelColumns((prev) => prev.filter((col) => col.id !== columnId));
    if (
      selectedExcelItem?.type === "column" &&
      selectedExcelItem.data.id === columnId
    ) {
      setSelectedExcelItem(null);
    }
  };

  const addExcelRow = () => {
    const newRow = {
      id: Date.now(),
      sno: excelTableRows.length + 1,
      data: {},
    };
    setExcelTableRows([...excelTableRows, newRow]);
  };

  const updateExcelRow = (rowId, columnId, value) => {
    const updatedRows = excelTableRows.map((row) =>
      row.id === rowId
        ? { ...row, data: { ...row.data, [columnId]: value } }
        : row,
    );
    setExcelTableRows(updatedRows);

    // Update selected item if it's the current row
    if (
      selectedExcelItem?.type === "row" &&
      selectedExcelItem.data.id === rowId
    ) {
      setSelectedExcelItem({
        ...selectedExcelItem,
        data: {
          ...selectedExcelItem.data,
          data: { ...selectedExcelItem.data.data, [columnId]: value },
        },
      });
    }
  };

  const deleteExcelRow = (rowId) => {
    setExcelTableRows((prev) => {
      const filtered = prev.filter((row) => row.id !== rowId);
      return filtered.map((row, index) => ({ ...row, sno: index + 1 }));
    });
    if (
      selectedExcelItem?.type === "row" &&
      selectedExcelItem.data.id === rowId
    ) {
      setSelectedExcelItem(null);
    }
  };

  const handleColumnClick = (column) => {
    setSelectedExcelItem({ type: "column", data: column });
  };

  const handleRowClick = (row) => {
    setSelectedExcelItem({ type: "row", data: row });
  };

  const handlePhotoUpload = async (rowId, columnId, file) => {
    if (!(file instanceof File)) return;

    try {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      const formData = new FormData();
      formData.append("file", compressedFile, compressedFile.name); // send as image

      const response = await axiosInstance.post(
        "/checklist-upload/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const imageUrl = response.data.imageUrl;

      setExcelTableRows((prev) =>
        prev.map((row) =>
          row.id === rowId
            ? {
                ...row,
                data: {
                  ...row.data,
                  [columnId]: {
                    url: imageUrl,
                  },
                },
              }
            : row,
        ),
      );
    } catch (error) {
      toast.error("Image upload failed");
    }
  };

  // Handle Checklist Type Selection - AUTO TRIGGER CONFIG
  const handleChecklistTypeSelect = (type) => {
    setChecklistType(type);
    setShowExcelConfig(true); // Auto show config after type selection
  };

  const buildCanvasSectionsJson = () => {
    const sections = {};

    questions.forEach((q) => {
      const sectionName = q.category || "General";

      if (!sections[sectionName]) {
        sections[sectionName] = {
          section_name: sectionName,
          section_description: "",
          sequence: Object.keys(sections).length + 1,
          items: [],
        };
      }

      const fieldType = mapQuestionType(q.type);

      const item = {
        label: q.label,
        sequence: sections[sectionName].items.length + 1,
        image_url: null,
        fields: [
          {
            field_name: q.label,
            field_type: fieldType,
            field_value: null,
            min: fieldType === "NUMERIC" ? Number(q.min) || null : null,
            max: fieldType === "NUMERIC" ? Number(q.max) || null : null,
            requires_photo: fieldType === "PHOTO",
            sequence: 1,
          },
        ],
      };

      sections[sectionName].items.push(item);
    });

    return Object.values(sections);
  };

  const buildExcelSectionsJson = () => {
    return [
      {
        section_name:
          checklistType === "daily" ? "Daily Checklist" : "Task Checklist",
        section_description: "",
        sequence: 1,

        items: excelTableRows.map((row, rowIndex) => {
          let imageUrl = null;

          const fields = excelColumns
            .filter((col) => col.id !== 1)
            .map((col, colIndex) => {
              let min = null;
              let max = null;
              let requiresPhoto = false;
              let fieldValue = row.data[col.id] || null;

              // 📷 PHOTO HANDLING
              if (col.type === "photo") {
                requiresPhoto = true;

                if (col.type === "photo" && fieldValue?.url) {
                  imageUrl = fieldValue.url;
                }

                fieldValue = null; // don't send photo object in field_value
              }

              if (col.type === "number") {
                min = col.min || null;
                max = col.max || null;
              }

              return {
                field_name: col.name,
                field_type: col.type.toUpperCase(),
                field_value: fieldValue,
                min,
                max,
                requires_photo: requiresPhoto,
                sequence: colIndex + 1,
              };
            });

          return {
            label: `Row ${rowIndex + 1}`,
            sequence: rowIndex + 1,
            image_url: imageUrl, // ✅ send image here
            fields,
          };
        }),
      },
    ];
  };
  const getSourceType = () => {
    if (viewMode === "canvas") return "CANVAS";
    if (viewMode === "excel") return "EXCEL";
    return null;
  };

  const handleSaveTemplate = (status) => {
    console.log(`🔥 Save clicked with status: ${status}`);

    let sectionsJson = [];

    if (viewMode === "canvas") {
      sectionsJson = buildCanvasSectionsJson();
    } else if (viewMode === "excel") {
      sectionsJson = buildExcelSectionsJson();
    } else {
      alert("Please select a builder mode");
      return;
    }

    if (!Array.isArray(sectionsJson) || sectionsJson.length === 0) {
      alert("No sections found");
      return;
    }

    const payload = {
      templateId: null, // 🔥 always create new template version

      templateName,

      checklistType: selectedMetaCategory,

      version: isEditMode
        ? status === "COMPLETED"
          ? version
          : templateById?.version
        : 1,

      sourceType: getSourceType(),

      status,

      sectionsJson: JSON.stringify(sectionsJson),
    };

    console.log("🚀 FINAL PAYLOAD", payload);

    dispatch(saveChecklistTemplate(payload));
  };

  const mapQuestionType = (uiType) => {
    switch (uiType) {
      case "Label":
        return "LABEL";
      case "Yes/No":
        return "YESNO";
      case "Numeric":
        return "NUMBER";
      case "Text":
        return "TEXT";
      case "Photo":
        return "PHOTO";
      case "Barcode":
        return "BARCODE";
      default:
        return "TEXT";
    }
  };
  const reverseMapQuestionType = (apiType) => {
    switch (apiType) {
      case "LABEL":
        return "Label";
      case "YESNO":
        return "Yes/No";
      case "Numeric":
        return "NUMBER";
      case "TEXT":
        return "Text";
      case "PHOTO":
        return "Photo";
      case "BARCODE":
        return "Barcode";
      default:
        return "Text";
    }
  };

  return (
    <div className="templates-page">
      {/* HEADER */}
      <div className="templates-header">
        <div>
          <h1 className="templates-title">Create -Templates </h1>
        </div>
      </div>
      {/* INFO BOX */}
      <div className="info-box horizontal">
        <span className="info-icon">ℹ️</span>
        <div className="info-text">
          <strong>Checklist Creation Instructions:</strong>
          <span>
            <strong>Step 1:</strong> Select Category, Frequency, and Department.
            <strong> Step 2:</strong> Add checklist questions and validation
            rules.
            <strong> Step 3:</strong> Assign operators and schedule execution.
          </span>
        </div>
      </div>
      {/* METADATA + SCHEDULING */}
      <div className="card unified-card">
        <h4 className="section-title">
          Checklist Metadata <span className="muted">(Required)</span>
        </h4>

        <div className="metadata-3col">
          <div className="field">
            <label>
              Template Name <span className="req">*</span>
            </label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>

          <div className="field">
            <label>
              CheckList Type <span className="req">*</span>
            </label>

            <div className="category-selector-wrapper">
              <select
                value={selectedMetaCategory}
                onChange={(e) => setSelectedMetaCategory(e.target.value)}
                className="category-select"
              >
                <option value="">Select CheckList Type</option>
                {checklistTypes?.map((type) => (
                  <option key={type.checklistTypeId} value={type.typeName}>
                    {type.typeName}
                  </option>
                ))}
              </select>

              <button
                className="add-category-btn"
                onClick={() => setShowAddMetaCategory(!showAddMetaCategory)}
                title="Add Category"
              >
                <Plus size={16} />
              </button>
            </div>

            {showAddMetaCategory && (
              <div className="add-category-form">
                <input
                  type="text"
                  value={newMetaCategoryName}
                  onChange={(e) => setNewMetaCategoryName(e.target.value)}
                  placeholder="Enter new category"
                  className="new-category-input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddMetaCategory();
                  }}
                  autoFocus
                />

                <div className="add-category-actions">
                  <button
                    className="add-category-save"
                    onClick={handleAddMetaCategory}
                  >
                    Add
                  </button>
                  <button
                    className="add-category-cancel"
                    onClick={() => {
                      setShowAddMetaCategory(false);
                      setNewMetaCategoryName("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="field">
            <label>
              Version <span className="req">*</span>
            </label>
            <input type="number" value={version} readOnly />

            <small>Version Of the Checklist Template</small>
          </div>
        </div>
      </div>

      {/* BUILDER MODE SELECTOR */}
      <div className="builder-controls">
        <div className="card mode-selector-card">
          <h4>Select Builder Mode</h4>
          <p className="mode-desc">
            Choose which type of checklist you want to create
          </p>

          <div className="mode-buttons">
            <button
              className={`mode-button ${viewMode === "canvas" ? "active" : ""}`}
              onClick={() => {
                const nextMode = viewMode === "canvas" ? null : "canvas";
                setViewMode(nextMode);

                if (nextMode === "canvas") {
                  // clear excel builder
                  setChecklistType(null);
                  setExcelTableRows([]);
                  setExcelColumns([]);
                  setShowExcelConfig(false);
                } else {
                  // clear canvas builder
                  setQuestions([]);
                  setSelected(null);
                }
              }}
            >
              <div className="mode-icon">📋</div>
              <div className="mode-content">
                <h5>Canvas Questions</h5>
                <p>Drag & drop simple questions</p>
              </div>
            </button>

            <button
              className={`mode-button ${viewMode === "excel" ? "active" : ""}`}
              onClick={() => {
                const nextMode = viewMode === "excel" ? null : "excel";
                setViewMode(nextMode);

                if (nextMode === "excel") {
                  // clear canvas builder
                  setQuestions([]);
                  setSelected(null);
                } else {
                  // clear excel builder
                  setChecklistType(null);
                  setExcelTableRows([]);
                  setExcelColumns([]);
                  setShowExcelConfig(false);
                }
              }}
            >
              <div className="mode-icon">📊</div>
              <div className="mode-content">
                <h5>Excel Table</h5>
                <p>Daily or task-based checklist</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* CANVAS BUILDER */}
      {viewMode === "canvas" && (
        <div className="builder">
          <div className="card">
            <h4>Component Palette</h4>
            {[
              { type: "Label", icon: "🏷" },
              { type: "Yes/No", icon: "✔" },
              { type: "Numeric", icon: "🔢" },
              { type: "Text", icon: "📝" },
              { type: "Photo", icon: "📷" },
              { type: "Barcode", icon: "📦" },
            ].map((item) => (
              <div
                key={item.type}
                className="palette-item"
                draggable
                onDragStart={(e) => e.dataTransfer.setData("type", item.type)}
              >
                <span className="palette-icon">{item.icon}</span>
                {item.type}
              </div>
            ))}
          </div>

          <div
            className="canvas"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {questions.length === 0 && (
              <div className="empty">
                <div className="empty-text">
                  Drag components from the palette to start building
                </div>
              </div>
            )}

            {questions.map((q, i) => (
              <div
                key={q.id}
                className={`question ${selected?.id === q.id ? "active" : ""}`}
                onClick={() => setSelected(q)}
              >
                <div className="question-content">
                  <div>
                    {q.type === "Label" ? (
                      <b className="label-question">{q.label}</b>
                    ) : (
                      <b>
                        {i + 1}. {q.label}
                      </b>
                    )}
                    <div className="muted">Type: {q.type}</div>
                  </div>

                  <span
                    className="delete-bin"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteQuestion(q.id);
                    }}
                  >
                    🗑
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="card properties-card">
            <h4>Properties</h4>

            {!selected ? (
              <div className="empty">Select a question</div>
            ) : (
              <>
                <div className="properties-field">
                  <label>Question Type</label>

                  <div className="category-selector-wrapper">
                    <select
                      value={selected.type}
                      onChange={(e) => {
                        updateQuestion("type", e.target.value);
                        updateQuestion("category", e.target.value); // 🔥 sync category
                      }}
                      className="category-select"
                    >
                      {categories.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>

                    <button
                      className="add-category-btn"
                      onClick={() => setShowAddCategory(!showAddCategory)}
                      title="Add question type"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {showAddCategory && (
                    <div className="add-category-form">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Enter new question type"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleAddCategory();
                          }
                        }}
                        className="new-category-input"
                        autoFocus
                      />
                      <div className="add-category-actions">
                        <button
                          className="add-category-save"
                          onClick={handleAddCategory}
                        >
                          Add
                        </button>
                        <button
                          className="add-category-cancel"
                          onClick={() => {
                            setShowAddCategory(false);
                            setNewCategoryName("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="properties-field">
                  <label>Question</label>
                  <input
                    type="text"
                    value={selected.label}
                    placeholder="Enter question text"
                    onChange={(e) => updateQuestion("label", e.target.value)}
                  />
                </div>

                {selected.type !== "Label" && (
                  <label className="properties-checkbox">
                    <input
                      type="checkbox"
                      checked={selected.required}
                      onChange={(e) =>
                        updateQuestion("required", e.target.checked)
                      }
                    />
                    Required
                  </label>
                )}

                {selected.type === "Numeric" && (
                  <>
                    <div className="properties-field">
                      <label>Minimum Value</label>
                      <input
                        type="number"
                        value={selected.min}
                        placeholder="Enter minimum value"
                        onChange={(e) => updateQuestion("min", e.target.value)}
                      />
                    </div>

                    <div className="properties-field">
                      <label>Maximum Value</label>
                      <input
                        type="number"
                        value={selected.max}
                        placeholder="Enter maximum value"
                        onChange={(e) => updateQuestion("max", e.target.value)}
                      />
                    </div>
                  </>
                )}

                <button
                  className="properties-save"
                  onClick={() => console.log("Saved", selected)}
                >
                  Save Question
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* EXCEL TABLE BUILDER */}
      {viewMode === "excel" && (
        <>
          {/* STEP 1: Checklist Type Selector - Show only when no type is selected */}
          {checklistType === null && excelTableRows.length === 0 && (
            <div className="card checklist-type-card">
              <h4>Step 1: Select Checklist Type</h4>
              <p className="mode-desc">
                Choose whether this checklist requires daily tracking or is
                task-based
              </p>

              <div className="checklist-type-buttons">
                <button
                  className="type-button"
                  onClick={() => handleChecklistTypeSelect("daily")}
                >
                  <div className="type-icon">📅</div>
                  <div className="type-content">
                    <h5>Daily Checklist</h5>
                    <p>Track with daily columns (1-31 days)</p>
                  </div>
                </button>

                <button
                  className="type-button"
                  onClick={() => handleChecklistTypeSelect("task")}
                >
                  <div className="type-icon">✓</div>
                  <div className="type-content">
                    <h5>Task Checklist</h5>
                    <p>Simple checklist without daily tracking</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Excel Configuration Modal */}
          {showExcelConfig && checklistType && (
            <div className="excel-config-modal card">
              <h4>
                📊 Step 2: Configure{" "}
                {checklistType === "daily" ? "Daily" : "Task"} Checklist Table
              </h4>
              <p className="config-desc">
                {checklistType === "daily"
                  ? "Set the initial number of rows, columns, and daily tracking days"
                  : "Set the initial number of rows and columns for your checklist"}
              </p>

              <div className="config-fields">
                <div className="field">
                  <label>Number of Rows</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={tempRowCount}
                    onChange={(e) =>
                      setTempRowCount(parseInt(e.target.value) || 1)
                    }
                  />
                  <small>How many checklist items do you need?</small>
                </div>

                <div className="field">
                  <label>Number of Columns</label>
                  <input
                    type="number"
                    min="2"
                    max="20"
                    value={tempColCount}
                    onChange={(e) =>
                      setTempColCount(parseInt(e.target.value) || 2)
                    }
                  />
                  <small>Additional columns for your checklist</small>
                </div>

                {checklistType === "daily" && (
                  <div className="field">
                    <label>Daily Check Columns</label>
                    <input
                      type="number"
                      min="0"
                      max="31"
                      value={dailyCheckDays}
                      onChange={(e) =>
                        setDailyCheckDays(parseInt(e.target.value) || 0)
                      }
                    />
                    <small>
                      Number of day columns (0-31, 0 = no daily tracking)
                    </small>
                  </div>
                )}
              </div>

              <div className="config-actions">
                <button
                  className="config-cancel"
                  onClick={() => {
                    setShowExcelConfig(false);
                    setChecklistType(null);
                  }}
                >
                  Back
                </button>
                <button
                  className="config-generate"
                  onClick={generateExcelTable}
                >
                  Generate Table
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Excel Table with Properties */}
          {excelTableRows.length > 0 && checklistType && !showExcelConfig && (
            <div className="excel-builder-layout">
              {/* Table Section */}
              <div className="excel-table-container card">
                <div className="excel-table-header">
                  <h4>
                    📊 Step 3: {checklistType === "daily" ? "Daily" : "Task"}{" "}
                    Checklist Table
                  </h4>
                  <div className="table-actions">
                    <button className="add-excel-row-btn" onClick={addExcelRow}>
                      <Plus size={14} />
                      Add Row
                    </button>
                    <button
                      className="add-excel-column-btn"
                      onClick={addExcelColumn}
                    >
                      <Plus size={14} />
                      Add Column
                    </button>
                    <button
                      className="reconfig-btn"
                      onClick={() => setShowExcelConfig(true)}
                    >
                      🔧 Reconfigure
                    </button>
                  </div>
                </div>

                <div className="table-scroll-container">
                  <table className="excel-preview-table">
                    <thead>
                      <tr>
                        {excelColumns.map((col) => (
                          <th
                            key={col.id}
                            onClick={() => handleColumnClick(col)}
                            className={
                              selectedExcelItem?.type === "column" &&
                              selectedExcelItem?.data?.id === col.id
                                ? "selected"
                                : ""
                            }
                            style={{ minWidth: col.width }}
                          >
                            {col.name}
                          </th>
                        ))}
                        {checklistType === "daily" &&
                          dailyCheckDays > 0 &&
                          Array.from({ length: dailyCheckDays }).map((_, i) => (
                            <th key={`day-${i}`} className="day-column">
                              {i + 1}
                            </th>
                          ))}
                        <th className="actions-column">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {excelTableRows.map((row) => (
                        <tr
                          key={row.id}
                          onClick={() => handleRowClick(row)}
                          className={
                            selectedExcelItem?.type === "row" &&
                            selectedExcelItem?.data?.id === row.id
                              ? "selected-row"
                              : ""
                          }
                        >
                          {excelColumns.map((col) => (
                            <td key={col.id}>
                              {col.id === 1 ? (
                                <span className="sno-cell">{row.sno}</span>
                              ) : col.type === "photo" ? (
                                /* PHOTO */
                                <label className="photo-upload-wrapper">
                                  {row.data[col.id]?.url ? (
                                    <img
                                      src={row.data[col.id].url}
                                      alt="preview"
                                      className="photo-preview"
                                    />
                                  ) : (
                                    <span className="photo-placeholder">
                                      📷 Upload
                                    </span>
                                  )}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      handlePhotoUpload(row.id, col.id, file);
                                      e.target.value = "";
                                    }}
                                  />
                                </label>
                              ) : col.type === "yesno" ? (
                                /* YES / NO (RADIO) */
                                <div className="yesno-cell">
                                  <label>
                                    <input
                                      type="radio"
                                      name={`yesno-${row.id}-${col.id}`}
                                      checked={row.data[col.id] === true}
                                      onChange={() =>
                                        updateExcelRow(row.id, col.id, true)
                                      }
                                    />
                                    Yes
                                  </label>
                                  <label>
                                    <input
                                      type="radio"
                                      name={`yesno-${row.id}-${col.id}`}
                                      checked={row.data[col.id] === false}
                                      onChange={() =>
                                        updateExcelRow(row.id, col.id, false)
                                      }
                                    />
                                    No
                                  </label>
                                </div>
                              ) : col.type === "checkbox" ? (
                                /* CHECKBOX */
                                <input
                                  type="checkbox"
                                  checked={row.data[col.id] || false}
                                  onChange={(e) =>
                                    updateExcelRow(
                                      row.id,
                                      col.id,
                                      e.target.checked,
                                    )
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : col.type === "barcode" ? (
                                /* BARCODE */
                                <div className="barcode-cell">
                                  <input
                                    type="text"
                                    value={row.data[col.id] || ""}
                                    placeholder="Scan barcode"
                                    onChange={(e) =>
                                      updateExcelRow(
                                        row.id,
                                        col.id,
                                        e.target.value,
                                      )
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <span className="barcode-icon">🏷</span>
                                </div>
                              ) : (
                                /* TEXT / NUMBER */
                                <input
                                  type={
                                    col.type === "number" ? "number" : "text"
                                  }
                                  value={row.data[col.id] || ""}
                                  onChange={(e) =>
                                    updateExcelRow(
                                      row.id,
                                      col.id,
                                      e.target.value,
                                    )
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                  className="excel-cell-input"
                                />
                              )}
                            </td>
                          ))}
                          {checklistType === "daily" &&
                            dailyCheckDays > 0 &&
                            Array.from({ length: dailyCheckDays }).map(
                              (_, i) => (
                                <td key={`day-${i}`} className="day-cell">
                                  <input
                                    type="checkbox"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </td>
                              ),
                            )}
                          <td className="actions-cell">
                            <button
                              className="delete-row-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteExcelRow(row.id);
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Properties Panel */}
              <div className="card properties-card">
                <h4>Properties</h4>

                {!selectedExcelItem ? (
                  <div className="empty">
                    <div className="empty-text">
                      Click on a column header or row to edit properties
                    </div>
                  </div>
                ) : selectedExcelItem.type === "column" ? (
                  <>
                    <div className="property-type-badge">
                      📋 Column Properties
                    </div>

                    <div className="properties-field">
                      <label>Column Name</label>
                      <input
                        type="text"
                        value={selectedExcelItem.data.name}
                        placeholder="Enter column name"
                        onChange={(e) =>
                          updateExcelColumn(
                            selectedExcelItem.data.id,
                            "name",
                            e.target.value,
                          )
                        }
                        disabled={!selectedExcelItem.data.editable}
                      />
                    </div>

                    <div className="properties-field">
                      <label>Column Type</label>
                      <select
                        value={selectedExcelItem.data.type}
                        onChange={(e) =>
                          updateExcelColumn(
                            selectedExcelItem.data.id,
                            "type",
                            e.target.value,
                          )
                        }
                        className="category-select"
                      >
                        <option value="text">Text</option>
                        <option value="label">Label</option>
                        <option value="number">Number</option>
                        <option value="photo">Photo</option>
                        <option value="barcode">Barcode</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="yesno">Yes / No</option>
                      </select>
                    </div>

                    <div className="properties-field">
                      <label>Column Width</label>
                      <input
                        type="text"
                        value={selectedExcelItem.data.width}
                        placeholder="e.g., 150px"
                        onChange={(e) =>
                          updateExcelColumn(
                            selectedExcelItem.data.id,
                            "width",
                            e.target.value,
                          )
                        }
                      />
                      <small>CSS width value (px, %, rem)</small>
                    </div>

                    {selectedExcelItem.data.editable && (
                      <button
                        className="properties-delete"
                        onClick={() =>
                          deleteExcelColumn(selectedExcelItem.data.id)
                        }
                      >
                        <Trash2 size={16} />
                        Delete Column
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <div className="property-type-badge row-badge">
                      📝 Row {selectedExcelItem.data.sno} Properties
                    </div>

                    <div className="row-data-preview">
                      <label>Row Data Preview:</label>
                      {excelColumns.slice(1).map((col) => (
                        <div key={col.id} className="row-data-item">
                          <span className="data-label">{col.name}:</span>
                          <span className="data-value">
                            {col.type === "photo"
                              ? selectedExcelItem.data.data[col.id]?.preview
                                ? "📷 Image uploaded"
                                : "(empty)"
                              : col.type === "yesno"
                                ? selectedExcelItem.data.data[col.id] === true
                                  ? "Yes"
                                  : selectedExcelItem.data.data[col.id] ===
                                      false
                                    ? "No"
                                    : "(empty)"
                                : col.type === "checkbox"
                                  ? selectedExcelItem.data.data[col.id]
                                    ? "Checked"
                                    : "Unchecked"
                                  : col.type === "barcode"
                                    ? selectedExcelItem.data.data[col.id] ||
                                      "(empty)"
                                    : typeof selectedExcelItem.data.data[
                                          col.id
                                        ] === "object"
                                      ? "(data)"
                                      : selectedExcelItem.data.data[col.id] ||
                                        "(empty)"}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      className="properties-delete"
                      onClick={() => deleteExcelRow(selectedExcelItem.data.id)}
                    >
                      <Trash2 size={16} />
                      Delete Row
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}

      <div className="footer">
        <div className="footer-left">
          <button onClick={() => setShowClone(true)}>
            <Copy size={16} />
            Clone Checklist
          </button>

          <button onClick={() => setShowImport(true)}>
            <Upload size={16} />
            Import Checklist
          </button>
        </div>

        <div className="footer-right">
          <button onClick={() => setShowPreview(true)}>
            <Eye size={16} />
            Preview
          </button>

          <button
            type="button"
            className="secondary"
            onClick={() => handleSaveTemplate("DRAFT")}
            disabled={loading}
          >
            <Save size={16} />
            {loading ? "Saving..." : "Save Draft"}
          </button>

          <button
            type="button"
            className="primary"
            onClick={() => handleSaveTemplate("COMPLETED")}
            disabled={loading}
          >
            <Save size={16} />
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

      <VersionHistoryModal
        open={showHistory}
        onClose={() => setShowHistory(false)}
      />
      <CloneChecklistModal
        open={showClone}
        onClose={() => setShowClone(false)}
      />
      <ImportChecklistModal
        open={showImport}
        onClose={() => setShowImport(false)}
      />
      <PreviewChecklistModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        viewMode={viewMode}
        questions={questions}
        excelColumns={excelColumns}
        excelRows={excelTableRows}
        checklistType={checklistType}
        dailyCheckDays={dailyCheckDays}
      />
    </div>
  );
}
