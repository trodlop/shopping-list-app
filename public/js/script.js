// Extra JavaScript functions
import { removeItemFromArray, removeItemFromObject } from "./JSplus.js"

// General parameters
const path_to_icons = "./media/icons/";
const path_to_data = "./data.json";
const main_parent_element = document.getElementById("main_grid_parent");

// Main shopping list data
let shopping_list_object = {};
let shopping_list_array = [];

// Load object from json file
async function load_list() {
    const response = await fetch(path_to_data);
    const data = await response.json();

    // this is now an array
    shopping_list_object = data.list;    

    shopping_list_array = Array.from(Object.values(shopping_list_object));   

    // console.log(shopping_list_array, Array.isArray(shopping_list_array));
};
function reorder_shopping_list(list_array) {

    const sorted_array = Object.values(list_array);

    sorted_array.sort((a, b) => {
        // 1️) Sort by priority
        if (a.priority !== b.priority) {
            return a.priority ? -1 : 1;
        };

        // 2) Sort alphabetically by name
        return a.name.localeCompare(b.name);
    });

    shopping_list_array = sorted_array; // Update shopping list
};
function generate_list_html(parent_element, list_array) {
    
    parent_element.innerHTML = ""; // clear existing html

    for (let i = 0; i < list_array.length; i++) {
        const item_object = list_array[i];
        
        const item_div = create_list_item_html(item_object); // Generate the html for each item
        
        parent_element.appendChild(item_div); // Append each div to parent div
    };
};
function create_list_item_html(item_object) {    

    // Parent container
    const parent_div = document.createElement("div");
    parent_div.className = "template_list_item";
    parent_div.id = item_object.id; // Give unique id to each list item

    const grid = document.createElement("div");
    grid.className = "template_list_item_grid";

    // Priority icon
    const item_priority_div = document.createElement("div");
    item_priority_div.className = "template_list_item_priority";

    const item_priority_img = document.createElement("img");
    item_priority_img.className = "template_list_item_priority_img";
    if (item_object.priority == true) {
        item_priority_img.src = `${path_to_icons}star_checked.svg`;
    } 
    else if (item_object.priority == false) {
        item_priority_img.src = `${path_to_icons}star_unchecked.svg`;
    }    

    item_priority_div.appendChild(item_priority_img);

    // Checkbox icon
    const item_checkbox_div = document.createElement("div");
    item_checkbox_div.className = "template_list_item_checkbox";

    const item_checkbox_img = document.createElement("img");
    item_checkbox_img.className = "template_list_item_checkbox_img";
    if (item_object.checked) {
        item_checkbox_img.src = `${path_to_icons}checkbox_checked.svg`;
    } else {
        item_checkbox_img.src = `${path_to_icons}checkbox_unchecked.svg`;
    }

    item_checkbox_div.appendChild(item_checkbox_img);

    // Name
    const item_name_div = document.createElement("div");
    item_name_div.className = "template_center_v";

    const item_name_h1 = document.createElement("h1");
    item_name_h1.className = "template_list_item_name";
    item_name_h1.textContent = item_object.name;

    item_name_div.appendChild(item_name_h1);

    // Count
    const item_count_div = document.createElement("div");
    item_count_div.className = "template_center_v";

    const item_count_h1 = document.createElement("h1");
    item_count_h1.className = "template_list_item_count";
    item_count_h1.textContent = item_object.count;

    item_count_div.appendChild(item_count_h1);

    // Delete icon
    const item_delete_div = document.createElement("div");
    item_delete_div.className = "template_list_item_delete";

    const item_delete_img = document.createElement("img");
    item_delete_img.className = "template_list_item_delete_img";
    item_delete_img.src = `${path_to_icons}delete.svg`;

    item_delete_div.appendChild(item_delete_img);

    // Assemble grid
    grid.append(
        item_priority_div,
        item_checkbox_div,
        item_name_div,
        item_count_div,
        item_delete_div
    );

    parent_div.appendChild(grid);  

    return parent_div;
};

//! -------------------------------------------------------------------------
function intitialise_event_listeners() {
    document.getElementById("main_grid_parent").addEventListener("click", (event) => {

        if (event.target.classList.contains("template_list_item_checkbox_img")) {
            toggle_checkbox(event.target);
        };

        if (event.target.classList.contains("template_list_item_priority_img")) {
            toggle_star(event.target);
        };

        if (event.target.classList.contains("template_list_item_delete_img")) {
            const list_item = event.target.closest(".template_list_item"); // Get parent list item
            delete_shopping_list_item(list_item.id);
        };
    });

    document.getElementById("new_item_container").addEventListener("click", open_new_item_window);
    document.getElementById("new_item_close_window_img").addEventListener("click", close_new_item_window);
    document.getElementById("new_item_form_submit").addEventListener("click", new_shopping_list_item);
};
function toggle_checkbox(img) {
    let checked;

    if (img.src.includes("checkbox_checked")) {
        img.src = `${path_to_icons}checkbox_unchecked.svg`;
        checked = false;
    } else {
        img.src = `${path_to_icons}checkbox_checked.svg`;
        checked = true;
    };

    
    const list_item = img.closest(".template_list_item"); // Get parent list item
    
    update_shopping_list_item(list_item.id, "checked_toggle", checked);    
};
function toggle_star(img) {
    let priority;

    if (img.src.includes("star_checked")) {
        img.src = `${path_to_icons}star_unchecked.svg`;
        priority = false;
    } else {
        img.src = `${path_to_icons}star_checked.svg`;
        priority = true;
    };

    const list_item = img.closest(".template_list_item"); // Get parent list item

    update_shopping_list_item(list_item.id, "priority_toggle", priority);    
};

//! -------------------------------------------------------------------------
function update_shopping_list_item(item_id, edit_type, data) { // Edit types: "priority_toggle" : true/false, "checked_toggle" : true/false
    
    const item_reference = shopping_list_array.find(item => item.id === item_id); // Find specific item by id
    
    if (edit_type == "priority_toggle" && item_id) {
        item_reference.priority = data;
        console.info(`Shopping list item changed:\nName - ${item_reference.name}\nPriority - ${item_reference.priority}`);
        console.table(item_reference);

    } else if (edit_type == "checked_toggle" && item_id) {
        item_reference.checked = data;
        console.info(`Shopping list item changed:\nName - ${item_reference.name}\nChecked - ${item_reference.checked}`);
        console.table(item_reference);

    } else {
        console.warn("An item in the shopping list tried to be changed but either:\n - no edit type was given\n - no item id was given");
        return;
    };

    write_to_file(shopping_list_array);
    reorder_shopping_list(shopping_list_array);
    generate_list_html(main_parent_element, shopping_list_array);
};
function delete_shopping_list_item(item_id) {

    const item_reference = shopping_list_array.find(item => item.id === item_id); // Returns specific object reference from array rather than item
    console.info(`Shopping list item removed:\nName - ${item_reference.name}\nPriority - ${item_reference.priority}`);
    console.table(item_reference);
    
    shopping_list_array = removeItemFromArray(shopping_list_array, item_reference) // Delete item from array using object reference

    generate_list_html(main_parent_element, shopping_list_array);

    write_to_file(shopping_list_array);
    
};
function new_shopping_list_item() {
    
    const item_name = document.getElementById("new_item_form_name_input").value;
    const item_count = document.getElementById("new_item_form_count_input").value;

    console.log(item_name, item_count);

    let uuid = Math.random().toString(36).slice(2, 2 + 10); // Generate new UUID of length 10
    console.log(uuid);

    shopping_list_array.push({"id" : uuid, "name" : item_name, "count" : item_count, "priority" : false, "checked" : false});
    write_to_file(shopping_list_array);
    console.log(shopping_list_array);
    
}; //TODO       SEE IN FUNCTION WHEN DONE
function open_new_item_window() {
    const new_item_window = document.getElementById("new_item_window");
    new_item_window.style.display = "flex";
}
function close_new_item_window() {
    const new_item_window = document.getElementById("new_item_window");
    new_item_window.style.display = "none";
};

//! -------------------------------------------------------------------------
function write_to_file(data) {
    console.log(data);
    fetch("/write-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ list: shopping_list_array })
    });
};

//! -------------------------------------------------------------------------
load_list().then(() => {
    reorder_shopping_list(shopping_list_array),
    generate_list_html(main_parent_element, shopping_list_array),
    intitialise_event_listeners(),
    console.log("HTML Initialised")
});