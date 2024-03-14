import { Todos } from "./class/Todos.js";
const BACKEND_ROOT_URL = "http://localhost:3001";
const list = document.querySelector("ul");
const input = document.querySelector("input");

const todo = new Todos(BACKEND_ROOT_URL);

const renderTask = (task) => {
  console.log(task);
  const li = document.createElement("li");
  li.setAttribute("class", "list-group-item");
  li.setAttribute("data-key", task.getId().toString());
  renderSpan(li, task.getText());
  renderLink(li, task.getId());
  list.append(li);
};

const renderSpan = (li, text) => {
  const span = li.appendChild(document.createElement("span"));
  span.innerHTML = text;
};

const renderLink = (li, id) => {
  const a = li.appendChild(document.createElement("a"));
  a.innerHTML = '<i class="bi bi-trash"></i>';
  a.setAttribute("style", "float:right");
  a.addEventListener("click", (event) => {
    todo
      .removeTask(id)
      .then((removed_id) => {
        const li_to_remove = document.querySelector(
          `[data-key='${removed_id}']`
        );
        if (li_to_remove) {
          list.removeChild(li_to_remove);
        }
      })
      .catch((error) => {
        alert(error);
      });
  });
};

const getTasks = async () => {
  todo
    .getTasks()
    .then((tasks) => {
      tasks.forEach((task) => {
        renderTask(task);
      });
    })
    .catch((error) => {
      alert(error);
    });
};

const saveTasks = async (task) => {
  try {
    const json = JSON.stringify({ description: task });
    const response = await fetch(BACKEND_ROOT_URL + "/new", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: json,
    });
    return response.json();
  } catch (error) {
    alert("Error saving task" + error.message);
  }
};

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const task = input.value.trim();
    if (task !== "") {
      todo.addTask(task).then((task) => {
        renderTask(task);
        input.value = "";
        input.focus();
      });
    }
  }
});

getTasks();
