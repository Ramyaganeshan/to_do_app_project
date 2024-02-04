function redirectToTaskForm() {
  window.location.href = "/addTaskForm";
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

function redirectToDashboard() {
  window.location.href = "/dashboard";
}

function deleteTask(taskId) {
  fetch(`/dashboard/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        window.location.href = data.redirectUrl;
      } else {
        console.error("Error deleting task:", data.error);
      }
    })
    .catch((error) => {
      console.error("Error deleting task:", error);
    });
}

function editTask(taskId, progress) {
  if (progress == "complete") {
    window.location.href = `/complete/${taskId}`;
  } else {
    window.location.href = `/editTask/${taskId}`;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const taskForm = document.getElementById("taskForm");

  if (taskForm) {
    taskForm.addEventListener("submit", function (event) {
      if (!validateForm()) {
        event.preventDefault();
      }
    });
  }

  function retrieveTitlesAndStartDates() {
    var tableBody = document.getElementById("taskTableBody");
    var rows = tableBody.getElementsByTagName("tr");
    var tasks = [];

    console.log("get values in all rows : ", rows);

    for (var i = 0; i < rows.length; i++) {
      var cells = rows[i].getElementsByTagName("td");
      var taskName = cells[0].innerText;
      var startDate = cells[1].innerText;

      tasks.push({
        title: taskName,
        startDate: startDate,
      });

      console.log("Task Name: " + taskName);
      console.log("Start Date: " + startDate);
      console.log("-------------------");
    }
    return tasks;
  }

  retrieveTitlesAndStartDates();
});

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
    errorMessage.innerHTML = "Title should be greather than 3 letters.";
    return false;
  }
  if (titleInput.value.length > 30) {
    errorMessage.innerHTML = "Title must be less than 30 letters.";
    return false;
  }
  return true;
}
