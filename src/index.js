import $ from "jquery";

function render(el) {
  const h1 = document.createElement("h1");
  h1.textContent = "Hello Webpack Dev Server!";
  el.appendChild(h1);

  const items = [
    {
      id: 1,
      name: "item 1",
      price: 100,
    },
    {
      id: 2,
      name: "item 2",
      price: 200,
    },
  ];
  const ul = document.createElement("ul");

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ${item.price}`;
    ul.appendChild(li);
  });

  el.appendChild(ul);

  $("ul").css("color", "red");
}

render(document.getElementById("app"));
