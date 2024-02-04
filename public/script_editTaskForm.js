import { retrieveTitlesAndStartDates } from "./script_todoListView.js";

function redirectToDashboard() {
  window.location.href = "/dashboard";
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

  const titleInput = document.querySelectorAll("#editTaskForm input")[0];
  const startDateInput = document.querySelectorAll("#editTaskForm input")[1];

  if (titleInput.value.length < 3) {
    errorMessage.innerHTML = "Title should be greater than 3 letters.";
    return false;
  }
  if (titleInput.value.length > 30) {
    errorMessage.innerHTML = "Title must be less than 30 letters.";
    return false;
  }
  const tasks = retrieveTitlesAndStartDates();
  console.log("Task Name from validateForm: " + tasks[0].title);
  console.log("Start Date from validateForm: " + tasks[0].startDate);

  return true;
}
