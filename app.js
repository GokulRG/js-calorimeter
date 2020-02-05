/*jshint esversion: 6 */
//Storage Controller -- For Local Storage

//Item Controller -- IIFE
const ItemCtrl = (function () {
    // Item constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    };

    const addItem = (name, calories) => {
        data.items.push(new Item(data.items.length, name,calories));
    };

    // DataStructure -- State
    const data = {
        items: [
            {
                id: 0, name: 'Steak Dinner', calories: 1200
            },
            {
                id: 1, name: 'Cookie', calories: 200
            },
            {
                id: 2, name: 'Eggs', calories: 100
            },
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

    const addError = (message) => {
        document.querySelector(UISelectors.errorBlock).textContent = message;
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
        addError
    };
})();

//App Controller
const App = (function (ItemCtrl, UICtrl) {

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
                    const newItem = ItemCtrl.addItem(itemToAdd.name, validCalories);
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

