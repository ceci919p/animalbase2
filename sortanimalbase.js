"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];
let filter = "*";

// The prototype for all animals:
const Animal = {
  name: "",
  desc: "-unknown animal-",
  type: "",
  age: 0,
};

function start() {
  console.log("ready");

  // TODO: Add event-listeners to filter and sort buttons

  //get the filter buttons
  const filterButtons = document.querySelectorAll(".filter");

  //get sorting in html doc
  const sortButtons = document.querySelectorAll("[data-action='sort']");

  //add event-listeners to filter buttons and call for the next function
  filterButtons.forEach((knap) => knap.addEventListener("click", animalFilter));

  //add event-listeners to sorting buttons and call for the next function
  sortButtons.forEach((knap) => knap.addEventListener("click", animalSort));

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

//all function
function all() {
  return true;
}

//------filter function

function animalFilter() {
  let filteredAnimals;
  //get filter depending on data-filter attribute
  filter = this.dataset.filter;

  //filter allAnimals with correct filter function  and put it into filteredAnimals
  if (filter === "*") {
    filteredAnimals = getFilterData(all);
  } else if (filter === "cat") {
    filteredAnimals = getFilterData(isCat);
  } else if (filter === "dog") {
    filteredAnimals = getFilterData(isDog);
  }
  displayList(filteredAnimals);
}

function getFilterData(filterFunction) {
  console.log("clicked");
  //filter on a criteria
  let filteredAnimals = allAnimals.filter(filterFunction);

  return filteredAnimals;
}

//-------sort function

function sortByName(a, b) {
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
}

function sortByAge(a, b) {
  console.log("clicked");
  if (a.age < b.age) {
    return -1;
  } else {
    return 1;
  }
}

function animalSort() {
  console.log("animals sort");
  const sortBy = this.dataset.sort;
  sortedAnimals(sortBy);
}

function sortedAnimals(sortBy) {
  let sortedList;

  if (sortBy === "name") {
    sortedList = allAnimals.sort(sortByName);
  } else if (sortBy === "type") {
    sortedList = allAnimals.sort(sortByType);
  } else if (sortBy === "desc") {
    sortedList = allAnimals.sort(sortByDesc);
  } else if (sortBy === "age") {
    sortedList = allAnimals.sort(sortByAge);
  }

  displayList(sortedList);
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
  displayList(allAnimals);
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

function displayList(filteredAnimals) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  filteredAnimals.forEach((animal) => displayAnimal(animal));
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

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
