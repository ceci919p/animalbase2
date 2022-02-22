"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];

// The prototype for all animals:
const Animal = {
  name: "",
  desc: "-unknown animal-",
  type: "",
  age: 0,
  star: false,
  winner: false,
};
//let filterBy = "all";
const settings = {
  filterBy: "all",
  sortBy: "name",
  sortDir: "asc",
};

function start() {
  console.log("ready");

  // TODO: Add event-listeners to filter and sort buttons

  //get the filter buttons
  const filterButtons = document.querySelectorAll(".filter");

  //get sorting in html doc
  const sortButtons = document.querySelectorAll("[data-action='sort']");

  //add event-listeners to filter buttons and call for the next function
  filterButtons.forEach((knap) => knap.addEventListener("click", selectFilter));

  //add event-listeners to sorting buttons and call for the next function
  sortButtons.forEach((knap) => knap.addEventListener("click", selectSort));

  loadJSON();
}

//isCat function
function isCat(animal) {
  if (animal.type === "cat") {
    return true;
  } else {
    return false;
  }
}

//isDog function
function isDog(animal) {
  if (animal.type === "dog") {
    return true;
  } else {
    return false;
  }
}

function isStar(animal) {
  return animal.star;
}

//------filter function
function selectFilter(event) {
  //filter on a criteria
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  console.log("setfilter");
  buildList();
}

function animalFilter(filteredList) {
  //let filteredList = allAnimals;
  //get filter depending on data-filter attribute
  //filter allAnimals with correct filter function  and put it into filteredAnimals
  if (settings.filterBy === "cat") {
    filteredList = allAnimals.filter(isCat);
  } else if (settings.filterBy === "dog") {
    filteredList = allAnimals.filter(isDog);
  }
  return filteredList;
  //displayList(filteredList);
}

//-------sort function

/* function sortByName(a, b) {
  console.log("clicked");
  if (a.name < b.name) {
    return -1;
  } else {
    return 1;
  }
}
function sortByType(a, b) {
  console.log("clicked");
  if (a.type < b.type) {
    return -1;
  } else {
    return 1;
  }
}
function sortByDesc(a, b) {
  console.log("clicked");
  if (a.desc < b.desc) {
    return -1;
  } else {
    return 1;
  }
} */

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  //toggle the direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }

  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortedAnimals(sortedList) {
  //let sortedList = allAnimals;
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    settings.direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(a, b) {
    console.log("clicked");
    if (a[settings.sortBy] < b[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  return sortedList;
}

async function loadJSON() {
  const response = await fetch("animals.json");
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allAnimals = jsonData.map(createAnimal);

  // TODO: This might not be the function we want to call first
  buildList();
}

function createAnimal(jsonObject) {
  const animal = Object.create(Animal);

  const texts = jsonObject.fullname.split(" ");
  animal.name = texts[0];
  animal.desc = texts[2];
  animal.type = texts[3];
  animal.age = jsonObject.age;

  return animal;
}

function buildList() {
  const currentList = animalFilter(allAnimals);
  console.log(currentList);
  const sortedList = sortedAnimals(currentList);

  displayList(sortedList);
}

function displayList(animals) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  animals.forEach(displayAnimal);
}

function displayAnimal(animal) {
  // create clone
  const clone = document
    .querySelector("template#animal")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=name]").textContent = animal.name;
  clone.querySelector("[data-field=desc]").textContent = animal.desc;
  clone.querySelector("[data-field=type]").textContent = animal.type;
  clone.querySelector("[data-field=age]").textContent = animal.age;

  //star
  if (animal.star === true) {
    clone.querySelector("[data-field=star]").textContent = "⭐";
  } else {
    clone.querySelector("[data-field=star]").textContent = "☆";
  }

  clone.querySelector("[data-field=star]").addEventListener("click", clickStar);

  function clickStar() {
    console.log("starClick");
    if (animal.star === true) {
      animal.star = false;
    } else {
      animal.star = true;
    }
    buildList();
  }

  //winner
  clone.querySelector("[data-field=winner]").dataset.winner = animal.winner;
  clone
    .querySelector("[data-field=winner]")
    .addEventListener("click", clickWinner);
  function clickWinner() {
    if (animal.winner === true) {
      animal.winner = false;
    } else {
      tryToMakeWinner(animal);
    }
    buildList();
  }

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

function tryToMakeWinner(selectedAnimal) {
  const winners = allAnimals.filter((animal) => animal.winner);

  const numberOfWinners = winners.length;
  const other = winners
    .filter((animal) => animal.type === selectedAnimal.type)
    .shift();

  //if theres is another of the same type
  if (other !== undefined) {
    console.log("There can only be one winner of each type");
    removeOther(other);
  } else if (numberOfWinners >= 2) {
    console.log("There can only be two winners");
    removeAorB(winners[0], winners[1]);
  } else {
    makeWinner(selectedAnimal);
  }

  //just testing
  //makeWinner(selectedAnimal);

  function removeOther(other) {
    //ask user to ignore or remove other
    document.querySelector("#remove_other").classList.remove("hide");
    document
      .querySelector("#remove_other .closebutton")
      .addEventListener("click", closeDialog);

    document
      .querySelector("#remove_other #removeotherbutton")
      .addEventListener("click", clickRemoveOther);

    //show name
    document.querySelector(
      "#remove_other [data-field=otherwinner]"
    ).textContent = other.name;

    //if ignore do nothing
    function closeDialog() {
      document.querySelector("#remove_other").classList.add("hide");
      document
        .querySelector("#remove_other #removeotherbutton")
        .removeEventListener("click", clickRemoveOther);
      document
        .querySelector("#remove_other #removeotherbutton")
        .removeEventListener("click", clickRemoveOther);
    }
    //if remove the other
    function clickRemoveOther() {
      console.log(selectedAnimal);
      removeWinner(other);
      makeWinner(selectedAnimal);
      buildList();
      closeDialog();
    }
  }

  function removeAorB(winnerA, winnerB) {
    //ask user to ignore or remove a or b
    document.querySelector("#remove_aorb").classList.remove("hide");
    document
      .querySelector("#remove_aorb .closebutton")
      .addEventListener("click", closeDialog);
    document
      .querySelector("#remove_aorb #removea")
      .addEventListener("click", clickRemoveA);
    document
      .querySelector("#remove_aorb #removeb")
      .addEventListener("click", clickRemoveB);

    //show names on buttons

    document.querySelector("#remove_aorb [data-field=winnerA]").textContent =
      winnerA.name;
    document.querySelector("#remove_aorb [data-field=winnerB]").textContent =
      winnerB.name;

    //if ignore do nothing
    function closeDialog() {
      document.querySelector("#remove_aorb").classList.add("hide");
      document
        .querySelector("#remove_aorb .closebutton")
        .removeEventListener("click", closeDialog);
      document
        .querySelector("#remove_aorb #removea")
        .removeEventListener("click", clickRemoveA);
      document
        .querySelector("#remove_aorb #removeb")
        .removeEventListener("click", clickRemoveB);
    }

    function clickRemoveA() {
      //if removeA
      removeWinner(winnerA);
      makeWinner(selectedAnimal);
      buildList();
      closeDialog();
    }

    function clickRemoveB() {
      //else removeB
      removeWinner(winnerB);
      makeWinner(selectedAnimal);
      buildList();
      closeDialog();
    }
  }

  function removeWinner(winnerAnimal) {
    winnerAnimal.winner = false;
  }

  function makeWinner(animal) {
    animal.winner = true;
  }
}
