window.jsonConvertor = {
  convert: function (json) {
    let obj = {};
    try {
        obj = JSON.parse(json);
    } catch (e) {
        showAlert('alert-warning', 'Error!', 'It seems that you are provding a wrong JSON format. Please confirm that your JSON string is valid...');
        return;
    }
    obj = this.jsonObejct(obj);
    let formatted = JSON.stringify(obj, null, "     ");
    return formatted;
  },
  jsonObejct: function getJsonObject(obj) {
    let i = 0;
    let appsettings = {};
    for (i = 0; i < obj.length; i++) {
      let sections = obj[i]["name"].split(":");
      let value = obj[i]["value"];

      value = this.normalize(value);

      let nested = this.setValue(sections, 0, value);
      appsettings = _.merge(appsettings, nested);
    }

    return appsettings;
  },
  setValue: function setValue(array, index, value) {
    if (index < array.length) {
      let temp = {};
      temp[array[index]] = setValue(array, index + 1, value);
      return temp;
    } else {
      return value;
    }
  },
  normalize: function normalizeValue(value) {
    if (value.toLowerCase() === "true") {
      value = true;
      return value;
    } else if (value.toLowerCase() === "false") {
      value = false;
      return value;
    }
    return this.isNum(value) && Number(value) ? Number(value) : value;
  },
  isNum: function checkNum(str) {
    return /^[0-9.]+$/i.test(str);
  },
};

window.Clipboard = {
  copyToClipboard: function (text) {
    var textArea = document.createElement("textarea");

    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = "fixed";
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = "2em";
    textArea.style.height = "2em";

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = "transparent";

    textArea.value = text;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    var result = "";
    var msg = "";
    var cl = "";
    try {
      var successful = document.execCommand("copy");
      if (successful) {
        result = "Well done!";
        msg = "Now, try pasting it somewhere 🤓 ";
        cl = "alert-success";
      } else {
        result = "Oh no!";
        msg = "It looks like you need to try copying manually... 😕";
        cl = "alert-warning";
      }
    } catch (err) {}

    document.body.removeChild(textArea);
    showAlert(cl, result, msg);
  },
};

function showAlert(danger, result, msg) {
  var html =
    `<div class="alert ${danger} alert-dismissible fade show mt-4" role="alert">` +
    `<strong>${result}</strong> ${msg}` +
    `<button type="button" class="close" data-dismiss="alert" aria-label="Close">` +
    `<span aria-hidden="true">&times;</span>` +
    `</button>` +
    `</div>`;
  $(html).insertAfter(".hidden-for-alert");
}
