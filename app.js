/* New Start Media — lead form logic.
 * - Client-side validation with accessible error messaging
 * - Honeypot + time-on-page bot guards
 * - Submits to Web3Forms (config.js) via fetch
 * - Deterministic success state
 */
(function () {
  "use strict";

  var CONFIG = window.NSM_CONFIG || {};
  var form = document.getElementById("lead-form");
  var statusEl = document.getElementById("form-status");
  var successPanel = document.getElementById("success-panel");
  var submitBtn = document.getElementById("submit-btn");
  var loadedAt = Date.now();

  var REQUIRED = [
    { id: "name", label: "Name" },
    { id: "business_name", label: "Business name" },
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone" },
    { id: "business_type", label: "Type of business" },
    { id: "employees", label: "Approximate number of employees" },
    { id: "problem", label: "This field" }
  ];

  function setStatus(msg, kind) {
    statusEl.textContent = msg || "";
    statusEl.className = "form-status" + (kind ? " is-" + kind : "");
  }

  function clearError(field) {
    field.removeAttribute("aria-invalid");
    var err = document.getElementById(field.id + "-error");
    if (err) err.remove();
  }

  function showError(field, message) {
    field.setAttribute("aria-invalid", "true");
    var err = document.getElementById(field.id + "-error");
    if (!err) {
      err = document.createElement("p");
      err.className = "field-error";
      err.id = field.id + "-error";
      field.setAttribute("aria-describedby", err.id);
      field.parentNode.appendChild(err);
    }
    err.textContent = message;
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function validate() {
    var firstInvalid = null;

    REQUIRED.forEach(function (spec) {
      var field = document.getElementById(spec.id);
      clearError(field);
      if (!field.value.trim()) {
        showError(field, spec.label + " is required.");
        if (!firstInvalid) firstInvalid = field;
      }
    });

    var email = document.getElementById("email");
    if (email.value.trim() && !validEmail(email.value.trim())) {
      showError(email, "That email address doesn't look right.");
      if (!firstInvalid) firstInvalid = email;
    }

    var phone = document.getElementById("phone");
    if (phone.value.trim() && phone.value.replace(/\D/g, "").length < 7) {
      showError(phone, "Please enter a phone number we can reach you at.");
      if (!firstInvalid) firstInvalid = phone;
    }

    if (firstInvalid) {
      setStatus("Please check the highlighted fields.", "error");
      firstInvalid.focus();
      return false;
    }
    return true;
  }

  function showSuccess() {
    form.hidden = true;
    successPanel.hidden = false;
    successPanel.focus();
    if (history.replaceState) {
      history.replaceState(null, "", "?submitted=1#thank-you");
    } else {
      location.hash = "thank-you";
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "generate_lead" });
  }

  function buildPayload() {
    return {
      access_key: CONFIG.web3formsAccessKey,
      subject: CONFIG.leadSubject || "New Business Systems Review Request",
      from_name: "New Start Media website",
      name: form.name.value.trim(),
      business_name: form.business_name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      website: form.website.value.trim() || "(not provided)",
      business_type: form.business_type.value.trim(),
      employees: form.employees.value,
      problem: form.problem.value.trim(),
      submitted_at: new Date().toISOString(),
      page_url: location.href
    };
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    setStatus("");

    // Bot guard 1: honeypot must stay empty.
    if (form.company_website && form.company_website.value) {
      showSuccess(); // silently satisfy the bot without sending
      return;
    }
    // Bot guard 2: reject near-instant submissions.
    var minMs = (CONFIG.minFormSeconds || 3) * 1000;
    if (Date.now() - loadedAt < minMs) {
      setStatus("Please take a moment to review your details, then submit again.", "error");
      return;
    }

    if (!validate()) return;

    if (!CONFIG.web3formsAccessKey) {
      setStatus(
        "This form isn't connected to lead delivery yet. Add a Web3Forms access key in config.js and redeploy.",
        "error"
      );
      return;
    }

    submitBtn.disabled = true;
    setStatus("Sending your request…", "working");

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(buildPayload())
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok && data.success, data: data };
        });
      })
      .then(function (result) {
        if (result.ok) {
          showSuccess();
        } else {
          submitBtn.disabled = false;
          setStatus(
            "Something went wrong sending your request. Please try again in a moment.",
            "error"
          );
        }
      })
      .catch(function () {
        submitBtn.disabled = false;
        setStatus(
          "We couldn't send your request — please check your connection and try again.",
          "error"
        );
      });
  });
})();
