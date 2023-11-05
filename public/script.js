document.addEventListener("DOMContentLoaded", function () {
  let isEditMode = false;

  // Send a GET request to the Express backend
  fetch("/api/data")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Parse the response as JSON
    })
    .then((data) => {
      console.log("Received data from the server:", data);
      renderProjectList(data); // Call a function to render the list
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  function renderProjectList(data) {
    const buttonsDiv = document.querySelector(".buttons");
    const projectListDiv = document.querySelector(".project-list");
    const projectInfoDiv = document.querySelector(".project-info");
    const table = document.createElement("table");

    // Create table headers (table row)
    const headerRow = document.createElement("tr");
    headerRow.classList.add("header-row");
    const headers = ["Project", "Lead", "Status"];

    headers.forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

    // Create table rows and cells for each project
    data.forEach((project) => {
      const row = document.createElement("tr");
      const propertiesToDisplay = [
        "project-name",
        "project-lead",
        "project-status",
      ]; // Adjust to your property names

      propertiesToDisplay.forEach((property) => {
        const cell = document.createElement("td");
        cell.textContent = project[property];
        row.appendChild(cell);
      });

      table.appendChild(row);
    });

    // Event listener for table row clicks
    table.addEventListener("click", (event) => {
      if (!isEditMode) {
        const clickedRow = event.target.closest("tr");
        if (!clickedRow || clickedRow.querySelector("th")) return; // Ignore clicks outside of table rows

        // Extract the project data associated with the clicked row
        const rowData = data[clickedRow.rowIndex - 1]; // Adjust index if there's a header row

        // Display additional project details in the project-details div
        buttonsDiv.innerHTML = `
          <button id="button-edit">Edit</button>
          <button id="button-remove">Remove</button>
          <button id="button-cancel" style="display: none">Cancel</button>`;

        projectInfoDiv.innerHTML = `
          <h2>${rowData["project-name"]}</h2>
          <div class="project-details">
          <div class="input-container">
          <label for="form-project-lead">Lead:</label>
          <input type="text" id="form-project-lead" name="form-project-lead" value="${
            rowData["project-lead"]
          }" ${isEditMode ? "" : "disabled"}/>
          </div>
          <div class="input-container">
          <label for="form-project-status">Status:</label>
          <input type="text" id="form-project-status" name="form-project-status" value="${
            rowData["project-status"]
          }" ${isEditMode ? "" : "disabled"}/>
          </div>
          <!-- Add more properties as needed -->
          </div>
        `;
      }
    });

    // Event listener for the edit button
    document.addEventListener("click", (event) => {
      const editButton = document.querySelector("#button-edit");
      const cancelButton = document.querySelector("#button-cancel");
      const saveButton = document.querySelector("#button-save");
      const removeButton = document.querySelector("#button-remove");
      const newProjectButton = document.querySelector("#button-new-project");
      const inputList = projectInfoDiv.querySelectorAll("input");
      const tableRows = table.querySelectorAll("tr");

      if (event.target === editButton) {
        isEditMode = !isEditMode;

        if (isEditMode) {
          editButton.textContent = "Save";
          cancelButton.style.display = "inline";
          removeButton.style.display = "none";
          newProjectButton.setAttribute("disabled", true);
          inputList.forEach((input) => {
            input.removeAttribute("disabled");
          });
          tableRows.forEach((row) => {
            row.classList.add("edit-mode");
          });
          const firstInput = projectInfoDiv.querySelector("#form-project-lead");
          firstInput.focus();
          const len = firstInput.value.length;
          firstInput.setSelectionRange(len, len);
        } else {
          editButton.textContent = "Edit";
          cancelButton.style.display = "none";
          removeButton.style.display = "inline";
          newProjectButton.removeAttribute("disabled");
          inputList.forEach((input) => {
            input.setAttribute("disabled", true);
          });
          tableRows.forEach((row) => {
            row.classList.remove("edit-mode");
          });
        }
      }

      if (event.target === cancelButton) {
        const heading = projectInfoDiv.querySelector("h2");
        newProjectButton.removeAttribute("disabled");
        isEditMode = false;
        tableRows.forEach((row) => {
          row.classList.remove("edit-mode");
        });

        if (heading.textContent == "New project") {
          projectInfoDiv.innerHTML = "";
        } else {
          editButton.textContent = "Edit";
          cancelButton.style.display = "none";
          removeButton.style.display = "inline";
          inputList.forEach((input) => {
            input.setAttribute("disabled", true);
          });
        }
      }

      if (event.target === saveButton) {
        isEditMode = false;
        newProjectButton.removeAttribute("disabled");
        tableRows.forEach((row) => {
          row.classList.remove("edit-mode");
        });
        projectInfoDiv.innerHTML = "";
      }

      if (event.target === removeButton) {
        const response = confirm(
          "Do you want to remove this project? This action can not be undone."
        );

        if (response) {
          projectInfoDiv.innerHTML = "";
          buttonsDiv.innerHTML = "";
        } else {
        }
      }
    });

    const newProjectButton = document.querySelector("#button-new-project");
    newProjectButton.addEventListener("click", (event) => {
      isEditMode = true;
      newProjectButton.setAttribute("disabled", true);
      const tableRows = table.querySelectorAll("tr");
      tableRows.forEach((row) => {
        row.classList.add("edit-mode");
      });

      buttonsDiv.innerHTML = `
          <button id="button-save">Save</button>
          <button id="button-cancel">Cancel</button>`;

      projectInfoDiv.innerHTML = `
          <h2>New project</h2>
          <div class="project-details">
          <div class="input-container">
          <label for="form-project-name">Name:</label>
          <input type="text" id="form-project-name" name="form-project-name"/>
          </div>
          <div class="input-container">
          <label for="form-project-lead">Lead:</label>
          <input type="text" id="form-project-lead" name="form-project-lead"/>
          </div>
          <div class="input-container">
          <label for="form-project-status">Status:</label>
          <input type="text" id="form-project-status" name="form-project-status"/>
          </div>
          <!-- Add more properties as needed -->
          </div>
        `;
    });

    projectListDiv.appendChild(table);
  }
});
