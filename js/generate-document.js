document.addEventListener("DOMContentLoaded", () => {
  const typeSelect = document.getElementById("doc-type");
  const templateSelect = document.getElementById("template-select");
  const formContainer = document.getElementById("dynamic-form");
  const formInstruction = document.getElementById("form-instruction");
  const previewContent = document.getElementById("preview-content");
  const btnDownloadPdf = document.getElementById("btn-download-pdf");

  let currentTemplate = null;
  let userValues = {}; // stores { key: "user input" }

  // 1. Handle Type Selection -> Fetch templates
  typeSelect.addEventListener("change", async (e) => {
    const type = e.target.value;
    if (!type) return;

    templateSelect.innerHTML = '<option value="">Loading...</option>';
    templateSelect.disabled = true;

    try {
      // Use API wrapper
      const res = await API.Templates.getByCategory(type);
      const templates = res.templates || [];

      if (templates.length === 0) {
        templateSelect.innerHTML = '<option value="">No templates found</option>';
        return;
      }

      templateSelect.innerHTML = '<option value="" disabled selected>-- Select Template --</option>';
      templates.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t._id;
        opt.textContent = t.title;
        templateSelect.appendChild(opt);
      });
      templateSelect.disabled = false;
      
      // Reset workspace
      resetWorkspace();
      
    } catch (err) {
      console.error(err);
      API.UI.toast("Failed to load templates", "error");
      templateSelect.innerHTML = '<option value="">Error loading</option>';
    }
  });

  // 2. Handle Template Selection -> Fetch details & build form
  templateSelect.addEventListener("change", async (e) => {
    const id = e.target.value;
    const type = typeSelect.value;
    if (!id || !type) return;

    resetWorkspace();
    formInstruction.textContent = "Loading template...";

    try {
      const res = await API.Templates.getById(type, id);
      currentTemplate = res.template;
      buildDynamicForm();
      renderPreview();
      btnDownloadPdf.disabled = false;
      formInstruction.textContent = "Fill the inputs below to generate your document:";
    } catch (err) {
      console.error(err);
      API.UI.toast("Failed to load template details", "error");
      formInstruction.textContent = "Error loading template details.";
    }
  });

  // 3. Build Dynamic Form
  function buildDynamicForm() {
    formContainer.innerHTML = "";
    userValues = {}; // reset values
    
    // Check if new schema (fields) exists, fallback if using old one.
    const fields = currentTemplate.fields || [];

    if (fields.length === 0) {
      formContainer.innerHTML = "<p style='color:#ffe066;'>This template does not require dynamic inputs (or uses old format).</p>";
      return;
    }

    fields.forEach(field => {
      // Initialize with empty string
      userValues[field.key] = "";

      const group = document.createElement("div");
      group.className = "form-group";

      const label = document.createElement("label");
      label.setAttribute("for", `input-${field.key}`);
      label.textContent = field.label;

      let input;
      if (field.type === "textarea") {
        input = document.createElement("textarea");
        input.rows = 3;
      } else {
        input = document.createElement("input");
        input.type = field.type || "text"; // date, number, text
      }
      
      input.id = `input-${field.key}`;
      input.placeholder = `Enter ${field.label}...`;

      // Live update listener
      input.addEventListener("input", (e) => {
        userValues[field.key] = e.target.value;
        renderPreview();
      });

      group.appendChild(label);
      group.appendChild(input);
      formContainer.appendChild(group);
    });
  }

  // 4. Render Live Preview
  function renderPreview() {
    if (!currentTemplate) return;

    // Use DB content. Fallback to basic presentation if it's an old template w/o content string.
    let rawContent = currentTemplate.content || `<h1 style="text-align:center">${currentTemplate.title}</h1><p>No valid content found in template format.</p>`;

    // Replace {{key}} with highlight spans
    const renderedHtml = rawContent.replace(/\{\{\s*([\w_]+)\s*\}\}/g, (match, key) => {
      const value = userValues[key];
      if (value && value.trim() !== "") {
        return `<span class="placeholder-highlight" style="background-color: transparent; border-bottom: none; font-weight: bold;">${value}</span>`;
      } else {
        // Show indicator if empty
        return `<span class="placeholder-highlight">_______</span>`;
      }
    });

    previewContent.innerHTML = renderedHtml;
  }

  function resetWorkspace() {
    currentTemplate = null;
    userValues = {};
    formContainer.innerHTML = "";
    previewContent.innerHTML = `<p style="color: #666; text-align: center; margin-top: 50%; direction: ltr;">Preview will appear here...</p>`;
    btnDownloadPdf.disabled = true;
    formInstruction.textContent = "Please select a template to generate the form.";
  }

  // 5. PDF Generation Logic
  btnDownloadPdf.addEventListener("click", () => {
    if (!currentTemplate) return;
    
    // Check if user filled everything
    const fields = currentTemplate.fields || [];
    const missing = fields.filter(f => !userValues[f.key] || userValues[f.key].trim() === "");
    
    if (missing.length > 0) {
      if(!confirm("You have empty fields. Do you want to download anyway?")) {
        return;
      }
    }

    const element = document.getElementById("preview-content");
    
    // html2pdf options
    const opt = {
      margin:       10,
      filename:     `${currentTemplate.title.replace(/\s+/g, '_')}_Generated.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const restoreBtn = API.UI.setLoading(btnDownloadPdf, "Generating PDF...");
    
    html2pdf().set(opt).from(element).save().then(() => {
      restoreBtn();
      API.UI.toast("PDF downloaded successfully!", "success");
    }).catch(err => {
      console.error(err);
      restoreBtn();
      API.UI.toast("Error generating PDF.", "error");
    });
  });

});
