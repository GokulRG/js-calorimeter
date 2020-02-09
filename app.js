/*jshint esversion: 6 */
//Storage Controller -- For Local Storage

//Item Controller -- IIFE
const ItemCtrl = (function () {
    'use strict';
    // Item constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    };

    const addItem = (name, calories) => {
        const newItem = new Item(data.items.length, name, calories);
        data.items.push(newItem);
        return newItem;
    };

    // DataStructure -- State
    const data = {
        items: [
            // {
            //     id: 0, name: 'Steak Dinner', calories: 1200
            // },
            // {
            //     id: 1, name: 'Cookie', calories: 200
            // },
            // {
            //     id: 2, name: 'Eggs', calories: 100
            // },
        ],
        currentItem: null,
        totalCalories: 0
    };

    return {
        logData: () => data,
        getItems: () => data.items,
        addItem
    };
})();

//UI Controller
const UICtrl = (function () {
    'use strict';
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        errorBlock: '#error-block'
    };

    const getItemInput = () => {
        return {
            name: document.querySelector(UISelectors.itemNameInput).value,
            calories: document.querySelector(UISelectors.itemCaloriesInput).value
        };
    };

    const clearErrors = () => {
        document.querySelector(UISelectors.errorBlock).textContent = ' ';
    };

    const clearInputs = () => {
        document.querySelector(UISelectors.itemNameInput).value = '';
        document.querySelector(UISelectors.itemCaloriesInput).value = '';
    };

    const addError = (message) => {
        document.querySelector(UISelectors.errorBlock).textContent = message;
    };

    const hideList = () => {
        document.querySelector(UISelectors.itemList).style.display = 'none';
    };

    const addListItem = (newItem) => {
        document.querySelector(UISelectors.itemList).innerHTML += `<li class="collection-item" id="item-${newItem.id}">
                            <strong>${newItem.name}: </strong> <em>${newItem.calories} Calories</em>
                            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                        </li>`;
        document.querySelector(UISelectors.itemList).style.display = 'block';
    };

    const populateItems = (items) => {
        let html = '';
        items.forEach(function (item) {
            html += `<li class="collection-item" id="item-${item.id}">
                            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                        </li>`;
        });

        // Insert list items into the items List UI element
        document.querySelector(UISelectors.itemList).innerHTML = html;
    };

    // Public methods
    return {
        populateItemList: populateItems,
        getUISelectors: () => UISelectors,
        getItemInput,
        clearErrors,
        addError,
        addListItem,
        clearInputs,
        hideList
    };
})();

//App Controller
const App = (function (ItemCtrl, UICtrl) {
    'use strict';
    const loadEventListeners = () => {
        const UISelectors = UICtrl.getUISelectors();
        document.querySelector(UISelectors.addBtn).addEventListener('click', (event) => {
            event.preventDefault();

            const itemToAdd = UICtrl.getItemInput();

            // Check for valid values
            if (itemToAdd.name && itemToAdd.calories) {
                const validCalories = parseInt(itemToAdd.calories);
                if (!validCalories) {
                    UICtrl.addError('Enter valid Calorie Count');
                } else {
                    UICtrl.clearErrors();
                    // Add item to the data structure
                    const newItem = ItemCtrl.addItem(itemToAdd.name, validCalories);
                    // Add item to the UI, We can just retrigger populate UI or we can also write a separate function for adding one single item
                    // UICtrl.populateItemList(ItemCtrl.getItems());
                    UICtrl.addListItem(newItem);
                    // Clear UI elements
                    UICtrl.clearInputs();
                    console.log(ItemCtrl.logData());
                }

            } else {
               UICtrl.addError('Enter valid Item Name and Calorie count');
            }
        });
    };

    return {
        init: function () {
            console.log('Initializing App');
            // Fetch items from the data structure -- could be an external api as well
            const items = ItemCtrl.getItems();

            // Check if items are present
            if (!items || items.length === 0) {
                UICtrl.hideList();
            }

            // Populate list with items
            UICtrl.populateItemList(items);

            // Load all event listeners
            loadEventListeners();

            //Clear All Errors -- Prophylactic
            UICtrl.clearErrors();
        }
    };

})(ItemCtrl, UICtrl);

// Initialize App
App.init();

