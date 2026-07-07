(function () {
  "use strict";

  var FULL_TOOLS = {
    home: "https://font4social.com/",
    blank: "https://font4social.com/blank-text-generator/",
    emoji: "https://font4social.com/emoji-copy-paste/"
  };

  var fancyStyles = [
    { key: "bold", label: "Bold", upper: 0x1d400, lower: 0x1d41a, digit: 0x1d7ce },
    { key: "italic", label: "Italic", upper: 0x1d434, lower: 0x1d44e },
    { key: "mono", label: "Monospace", upper: 0x1d670, lower: 0x1d68a, digit: 0x1d7f6 },
    { key: "fullwidth", label: "Fullwidth", fullwidth: true }
  ];

  var blankChars = [
    { label: "Braille Blank", code: "U+2800", value: "\u2800", width: 1, note: "Visible-size blank cell. Good for empty-looking messages." },
    { label: "Hangul Filler", code: "U+3164", value: "\u3164", width: 2, note: "Wider blank. Often used for invisible names." },
    { label: "Zero Width Space", code: "U+200B", value: "\u200B", width: 0, note: "No visible width. Useful inside text, not as a visible space." },
    { label: "Non-breaking Space", code: "U+00A0", value: "\u00A0", width: 2, note: "Keeps spacing from collapsing in some editors." },
    { label: "Word Joiner", code: "U+2060", value: "\u2060", width: 0, note: "Invisible joiner that prevents line breaks." }
  ];

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function codePoint(value) {
    return String.fromCodePoint(value);
  }

  function convertChar(char, style) {
    var code = char.codePointAt(0);

    if (style.fullwidth) {
      if (code === 0x20) return "\u3000";
      if (code >= 0x21 && code <= 0x7e) return codePoint(0xff01 + code - 0x21);
      return char;
    }

    if (code >= 65 && code <= 90 && style.upper) {
      return codePoint(style.upper + code - 65);
    }

    if (code >= 97 && code <= 122 && style.lower) {
      if (style.key === "italic" && code === 104) return "\u210E";
      return codePoint(style.lower + code - 97);
    }

    if (code >= 48 && code <= 57 && style.digit) {
      return codePoint(style.digit + code - 48);
    }

    return char;
  }

  function convertText(text, style) {
    return Array.from(text).map(function (char) {
      return convertChar(char, style);
    }).join("");
  }

  function copyText(text, statusNode) {
    function done() {
      if (statusNode) {
        statusNode.textContent = "Copied!";
        window.setTimeout(function () {
          statusNode.textContent = "";
        }, 1400);
      }
      document.dispatchEvent(new CustomEvent("f4s:copy", { detail: { value: text } }));
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done).catch(function () {
        fallbackCopy(text);
        done();
      });
      return;
    }

    fallbackCopy(text);
    done();
  }

  function fallbackCopy(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  function createShell(title, description, linkUrl, linkText) {
    var wrapper = document.createElement("section");
    wrapper.className = "f4s-widget";
    wrapper.innerHTML =
      "<h3>" + escapeHtml(title) + "</h3>" +
      "<p>" + escapeHtml(description) + " <a href=\"" + linkUrl + "\" target=\"_blank\" rel=\"noopener noreferrer\">" + escapeHtml(linkText) + "</a></p>" +
      "<div class=\"f4s-status\" aria-live=\"polite\"></div>";
    return wrapper;
  }

  function initFancyText(target) {
    var shell = createShell(
      "Fancy Text Preview",
      "Preview a few Unicode text styles, then open the full generator for more styles.",
      FULL_TOOLS.home,
      "Full Unicode text generator"
    );
    var status = shell.querySelector(".f4s-status");
    var input = document.createElement("input");
    var list = document.createElement("div");

    input.className = "f4s-input";
    input.type = "text";
    input.value = target.getAttribute("data-text") || "Font4Social";
    input.placeholder = "Type your text";
    list.className = "f4s-output-list";

    function render() {
      var text = input.value || "Font4Social";
      list.innerHTML = fancyStyles.map(function (style) {
        var output = convertText(text, style);
        return "<div class=\"f4s-output\">" +
          "<span class=\"f4s-output-label\">" + escapeHtml(style.label) + "</span>" +
          "<span class=\"f4s-output-value\">" + escapeHtml(output) + "</span>" +
          "<button class=\"f4s-copy\" type=\"button\" data-copy=\"" + escapeHtml(output) + "\">Copy</button>" +
        "</div>";
      }).join("");
    }

    input.addEventListener("input", render);
    list.addEventListener("click", function (event) {
      var button = event.target.closest("[data-copy]");
      if (button) copyText(button.getAttribute("data-copy"), status);
    });

    shell.insertBefore(input, status);
    shell.insertBefore(list, status);
    target.replaceChildren(shell);
    render();
  }

  function initBlankText(target) {
    var shell = createShell(
      "Invisible Character Copy",
      "Copy blank text and invisible Unicode characters for testing names, bios, and messages.",
      FULL_TOOLS.blank,
      "Open full blank text generator"
    );
    var status = shell.querySelector(".f4s-status");
    var controls = document.createElement("div");
    var preview = document.createElement("div");
    var note = document.createElement("p");

    controls.className = "f4s-blank-controls";
    preview.className = "f4s-preview";
    note.textContent = blankChars[0].note;

    controls.innerHTML =
      "<select class=\"f4s-select\" aria-label=\"Invisible character style\">" +
        blankChars.map(function (item, index) {
          return "<option value=\"" + index + "\">" + escapeHtml(item.label + " " + item.code) + "</option>";
        }).join("") +
      "</select>" +
      "<input class=\"f4s-input\" type=\"number\" min=\"1\" max=\"50\" value=\"1\" aria-label=\"Character count\">" +
      "<button class=\"f4s-button\" type=\"button\">Copy blank</button>";

    var select = controls.querySelector("select");
    var count = controls.querySelector("input");
    var copyButton = controls.querySelector("button");

    function currentText() {
      var item = blankChars[Number(select.value)] || blankChars[0];
      var amount = Math.max(1, Math.min(50, Number(count.value) || 1));
      return item.value.repeat(amount);
    }

    function render() {
      var item = blankChars[Number(select.value)] || blankChars[0];
      var amount = Math.max(1, Math.min(50, Number(count.value) || 1));
      var markers = "";
      for (var index = 0; index < amount; index += 1) {
        markers += "<span class=\"f4s-marker\" style=\"--f4s-width:" + item.width + "\" data-zero=\"" + (item.width === 0) + "\"></span>";
      }
      preview.innerHTML = markers;
      note.textContent = item.note;
    }

    select.addEventListener("change", render);
    count.addEventListener("input", render);
    copyButton.addEventListener("click", function () {
      copyText(currentText(), status);
    });

    shell.insertBefore(controls, status);
    shell.insertBefore(preview, status);
    shell.insertBefore(note, status);
    target.replaceChildren(shell);
    render();
  }

  function initEmojiStrip(target) {
    var shell = createShell(
      "Emoji Copy Strip",
      "Add a small row of emoji buttons that copy with one click.",
      FULL_TOOLS.emoji,
      "Browse full emoji library"
    );
    var status = shell.querySelector(".f4s-status");
    var grid = document.createElement("div");
    var emoji = (target.getAttribute("data-emojis") || "😂,❤️,🔥,✨,✅,🎮,🚀,💯")
      .split(",")
      .map(function (item) { return item.trim(); })
      .filter(Boolean);

    grid.className = "f4s-emoji-grid";
    grid.innerHTML = emoji.map(function (item) {
      return "<button class=\"f4s-emoji-button\" type=\"button\" data-copy=\"" + escapeHtml(item) + "\" aria-label=\"Copy " + escapeHtml(item) + "\">" + escapeHtml(item) + "</button>";
    }).join("");

    grid.addEventListener("click", function (event) {
      var button = event.target.closest("[data-copy]");
      if (button) copyText(button.getAttribute("data-copy"), status);
    });

    shell.insertBefore(grid, status);
    target.replaceChildren(shell);
  }

  function init(root) {
    var scope = root || document;
    scope.querySelectorAll("[data-f4s-widget]").forEach(function (target) {
      if (target.dataset.f4sReady === "true") return;
      target.dataset.f4sReady = "true";

      var type = target.getAttribute("data-f4s-widget");
      if (type === "fancy-text") initFancyText(target);
      if (type === "blank-text") initBlankText(target);
      if (type === "emoji-strip") initEmojiStrip(target);
    });
  }

  window.Font4SocialWidgets = { init: init };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { init(document); });
  } else {
    init(document);
  }
}());

