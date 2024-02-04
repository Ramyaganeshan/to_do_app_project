import { retrieveTitlesAndStartDates } from "./script_todoListView.js";
// const { retrieveTitlesAndStartDates } = require("./script_todoListView");

console.log(retrieveTitlesAndStartDates);

function redirectToDashboard() {
  window.location.href = "/dashboard";
}

function addNewTask(event) {
  event.preventDefault();
  const taskTableBody = document.getElementById("taskTableBody");
  const noDataRow = document.getElementById("noDataRow");

  if (noDataRow) {
    taskTableBody.removeChild(noDataRow);
  }

  const title = document.getElementsByName("title")[0].value;
  const startDate = document.getElementsByName("startDate")[0].value;
  const deadline = document.getElementsByName("deadline")[0].value;
  const priority = document.getElementsByName("priority")[0].value;
  const progress = document.getElementsByName("progress")[0].value;

  const newRow = document.createElement("tr");
  newRow.innerHTML = `
          <td>${title}</td>
          <td>${startDate}</td>
          <td>${deadline}</td>
          <td>${priority}</td>
          <td>${progress}</td>
        `;

  taskTableBody.appendChild(newRow);

  document.getElementById("taskForm").reset();
}

jQuery(function () {
  var dateToday = new Date();
  var dates = $("#startDate, #deadline").datepicker({
    defaultDate: "+1w",
    changeMonth: true,
    minDate: dateToday,
    onSelect: function (selectedDate) {
      var option = this.id == "startDate" ? "minDate" : "maxDate",
        instance = $(this).data("datepicker"),
        date = $.datepicker.parseDate(
          instance.settings.dateFormat || $.datepicker._defaults.dateFormat,
          selectedDate,
          instance.settings
        );
      dates.not(this).datepicker("option", option, date);
    },
  });
});
function validateForm() {
  var errorMessage = document.getElementById("error-message");
  errorMessage.innerHTML = "";

  const titleInput = document.querySelectorAll("#taskForm input")[0];
  const startDateInput = document.querySelectorAll("#taskForm input")[1];

  if (titleInput.value.length < 3) {
    errorMessage.innerHTML = "Title should be greater than 3 letters.";
    return false;
  }
  if (titleInput.value.length > 30) {
    errorMessage.innerHTML = "Title must be less than 30 letters.";
    return false;
  }
  return true;
}
