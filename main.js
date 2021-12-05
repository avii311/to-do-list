const form = document.querySelector("#itemForm");
const itemInput = document.querySelector("#itemInput");
const itemList = document.querySelector("#itemList");
const messageDiv = document.querySelector("#message");
const clearButton = document.querySelector("#clearBtn");
const filters = document.querySelectorAll(".nav-item");


let todoItems = [];

const showAlert = function (message, msgClass) {
  console.log("msg");
  messageDiv.innerHTML = message;
  messageDiv.classList.add(msgClass, "show");
  messageDiv.classList.remove("hide");
  setTimeout(() => {
    messageDiv.classList.remove("show",msgClass);
    messageDiv.classList.add("hide");
  }, 3000);
  return;
};

const getItemsFilter = function (type) {
  let filterItems = [];
  console.log(type);
  switch (type) {
    case "todo":
      filterItems = todoItems.filter((item) => !item.isDone);
      break;
    case "done":
      filterItems = todoItems.filter((item) => item.isDone);
      break;
    default:
      filterItems = todoItems;
  }
  getList(filterItems);
};


const updateItem = function (itemIndex, newValue) {
  console.log(itemIndex);
  const newItem = todoItems[itemIndex];
  newItem.name = newValue;
  todoItems.splice(itemIndex, 1, newItem);
  setLocalStorage(todoItems);
};


const removeItem = function (item) {
  const removeIndex = todoItems.indexOf(item);
  todoItems.splice(removeIndex, 1);
};


const handleItem = function (itemData) {
  const items = document.querySelectorAll(".list-group-item");
  items.forEach((item) => {
    if (
      item.querySelector(".title").getAttribute("data-time") == itemData.addedAt
    ) {
      
      item.querySelector("[data-done]").addEventListener("click", function (e) {
        e.preventDefault();
        const itemIndex = todoItems.indexOf(itemData);
        const currentItem = todoItems[itemIndex];
        const currentClass = currentItem.isDone
          ? "bi-check-circle-fill"
          : "bi-check-circle";
        currentItem.isDone = currentItem.isDone ? false : true;
        todoItems.splice(itemIndex, 1, currentItem);
        
        setLocalStorage(todoItems);
        
        const iconClass = currentItem.isDone
          ? "bi-check-circle-fill"
          : "bi-check-circle";

        this.firstElementChild.classList.replace(currentClass, iconClass);
        const filterType = document.querySelector("#filterType").value;
        getItemsFilter(filterType);
      });
      // edit
      item.querySelector("[data-edit]").addEventListener("click", function (e) {
        e.preventDefault();
        itemInput.value = itemData.name;
        document.querySelector("#citem").value = todoItems.indexOf(itemData);
        return todoItems;
      });

    
      item
        .querySelector("[data-delete]")
        .addEventListener("click", function (e) {
          e.preventDefault();
          if (confirm("Are you sure want to delete the task?")) {
            itemList.removeChild(item);
            removeItem(item);
            setLocalStorage(todoItems);
            showAlert("TASK has been deleted.", "alert-success");
            return todoItems.filter((item) => item != itemData);
          }
        });
    }
  });
};

const getList = function (todoItems) {
  itemList.innerHTML = "";
  if (todoItems.length > 0) {
    todoItems.forEach((item) => {
      const iconClass = item.isDone
        ? "bi-check-circle-fill"
        : "bi-check-circle";
      itemList.insertAdjacentHTML(
        "beforeend",
        `<li class="list-group-item d-flex justify-content-between align-items-center">
          <span class="title" data-time="${item.addedAt}">${item.name}</span> 
          <span>
              <a href="#" data-done><i class="bi ${iconClass} green"></i></a>
              <a href="#" data-edit><i class="bi bi-pencil-square blue"></i></a>
              <a href="#" data-delete><i class="bi bi-x-circle red"></i></a>
          </span>
        </li>`
      );
      handleItem(item);
    });
  } else {
    itemList.insertAdjacentHTML(
      "beforeend",
      `<li class="list-group-item d-flex justify-content-between align-items-center">
        No task found add a new task.
      </li>`
    );
  }
};


const getLocalStorage = function () {
  const todoStorage = localStorage.getItem("todoItems");
  if (todoStorage === "undefined" || todoStorage === null) {
    todoItems = [];
  } else {
    todoItems = JSON.parse(todoStorage);
    
  }
  getList(todoItems);
};

const setLocalStorage = function (todoItems) {
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
};

document.addEventListener("DOMContentLoaded", () => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const itemName = itemInput.value.trim();
    if (itemName.length === 0) {
      showAlert("Please enter task.", "alert-danger");
      return;
    } else {
      
      const currenItemIndex = document.querySelector("#citem").value;
      if (currenItemIndex) {
        updateItem(currenItemIndex, itemName);
        document.querySelector("#citem").value = "";
        showAlert("Item has been updated.", "alert-success");
      } else {
        
        const itemObj = {
          name: itemName,
          isDone: false,
          addedAt: new Date().getTime(),
        };
        todoItems.push(itemObj);
       
        setLocalStorage(todoItems);
        showAlert("New task has been added.", "alert-success");
      }

      getList(todoItems);
      
    }
    console.log(todoItems);
    itemInput.value = "";
  });

 
  filters.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      const tabType = this.getAttribute("data-type");
      document.querySelectorAll(".nav-link").forEach((nav) => {
        nav.classList.remove("active");
      });
      this.firstElementChild.classList.add("active");
      document.querySelector("#filterType").value = tabType;
      getItemsFilter(tabType);
    });
  });

  // load items
  getLocalStorage();
});