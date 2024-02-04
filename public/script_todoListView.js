export function retrieveTitlesAndStartDates() {
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

function redirectToTaskForm() {
  window.location.href = "/addTaskForm";
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

  retrieveTitlesAndStartDates();
});
