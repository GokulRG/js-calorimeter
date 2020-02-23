/*jshint esversion: 6 */
//Storage Controller -- For Local Storage
const StorageCtrl = (function() {
    'use strict';
    const storeItem = (newItem) => {
        let items = [];

        // Check if there are any items already present
        if (!localStorage.getItem('items')) {
            items.push(newItem);
            localStorage.setItem('items', JSON.stringify(items));
        } else {
            items = JSON.parse(localStorage.getItem('items'));
            items.push(newItem);
            localStorage.setItem('items', JSON.stringify(items));
        }
    };

    const updateItem = (itemToUpdate) => {
        // Check if there are any items present
        if (!localStorage.getItem('items')) {
            // Failed to update, no matching items found
            return null;
        } else {
            const items = JSON.parse(localStorage.getItem('items'));
            const itemIndex = items.findIndex(item => item.id === itemToUpdate.id); 
            if (itemIndex >= 0) {
                items[itemIndex].name = itemToUpdate.name;
                items[itemIndex].calories = itemToUpdate.calories;
                localStorage.setItem('items', JSON.stringify(items));
                return items[itemIndex];
            } else {
                return null;
            }
        }
    };

    const deleteItem = (id) => {
        // Check if there are items present
        if (!localStorage.getItem('items')) {
            // No items present
            return false;
        } else {
            const items = JSON.parse(localStorage.getItem('items'));
            const filteredItems = items.filter(item => item.id !== id);
            localStorage.setItem('items', JSON.stringify(filteredItems));
            return true;
        }
    };

    const clearStorage = () => {
        if (localStorage.getItem('items')) {
            localStorage.setItem('items',JSON.stringify([]));
        }
    };

    // Public Methods
    return {
        storeItem,
        updateItem,
        deleteItem,
        clearStorage
    };
})();

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
        let newId = 0;
        if (data.items && data.items.length > 0) {
            newId = data.items[data.items.length - 1].id + 1;
        }
        const newItem = new Item(newId, name, calories);
        data.items.push(newItem); 
        StorageCtrl.storeItem(newItem);
        return newItem;
    };


    const updateItem = (name, calories) => {
        const itemIndex = data.items.findIndex(item => item.id === ItemCtrl.getCurrentItem().id);
        if (itemIndex >= 0) {
            data.items[itemIndex].name = name;
            data.items[itemIndex].calories = parseInt(calories);
            StorageCtrl.updateItem(data.items[itemIndex]);
            return data.items[itemIndex];
        }

        return null;
    };

    const deleteItem = () => {
        data.items.forEach((item, index) => {
            if (item.id === ItemCtrl.getCurrentItem().id) {
                data.items.splice(index, 1);
                if(StorageCtrl.deleteItem(index)) {
                    return true;
                } else {
                    return false;
                }
            }
        });
    };

    const clearItems = () => {
        data.items = [];
        StorageCtrl.clearStorage();
    };

    const getItemById = (id) => {
        const filteredItems = data.items.filter(item => item.id === id);
        return filteredItems[0] || null;
    };

    const setCurrentItem = (item) => {
        data.currentItem = item;
    };

    const getCurrentItem = () => {
        return data.currentItem || null;
    };

    const getTotalCalories = () => {
        let totalCalories = 0;
        data.items.forEach(item => {
            totalCalories += item.calories;
        });

        // Set total in data structure
        data.totalCalories = totalCalories;
        return totalCalories;
    };

    const getItemsFromLocalStorage = () => {
        return JSON.parse(localStorage.getItem("items")) || [];
    };

    // DataStructure -- State
    const data = {
        // items: [
        //     {
        //         id: 0, name: 'Steak Dinner', calories: 1200
        //     },
        //     {
        //         id: 1, name: 'Cookie', calories: 200
        //     },
        //     {
        //         id: 2, name: 'Eggs', calories: 100
        //     },
        // ],
        items: getItemsFromLocalStorage() || [],
        currentItem: null,
        totalCalories: 0
    };

    return {
        logData: () => data,
        getItems: () => data.items,
        addItem,
        getTotalCalories,
        getItemById,
        setCurrentItem,
        getCurrentItem,
        updateItem,
        deleteItem,
        clearItems
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
        errorBlock: '#error-block',
        totalCalories: '.total-calories',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn'
    };

    const clearEditState = () => {
        clearInputs();
        clearErrors();
        // Change button displays
        document.querySelector(UISelectors.deleteBtn).style.display = 'none';
        document.querySelector(UISelectors.updateBtn).style.display = 'none';
        document.querySelector(UISelectors.backBtn).style.display = 'none';
        document.querySelector(UISelectors.addBtn).style.display = 'inline';
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

    const addItemToForm = (item) => {
        document.querySelector(UISelectors.itemNameInput).value = item.name;
        document.querySelector(UISelectors.itemCaloriesInput).value = item.calories;
        showEditState();
    };

    const showEditState = () => {
        document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
        document.querySelector(UISelectors.updateBtn).style.display = 'inline';
        document.querySelector(UISelectors.backBtn).style.display = 'inline';
        document.querySelector(UISelectors.addBtn).style.display = 'none';
    };

    const clearInputs = () => {
        document.querySelector(UISelectors.itemNameInput).value = '';
        document.querySelector(UISelectors.itemCaloriesInput).value = '';
    };

    const addError = (message) => {
        document.querySelector(UISelectors.errorBlock).textContent = message;
    };

    const setTotalCalories = (totalCalories=ItemCtrl.getTotalCalories()) => {
        document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
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

    const populateItems = (items=ItemCtrl.getItems()) => {
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
        hideList,
        setTotalCalories,
        clearEditState,
        addItemToForm,
        showEditState
    };
})();

//App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
    'use strict';
    const loadEventListeners = () => {
        const UISelectors = UICtrl.getUISelectors();

        // Edit Button Click UI Selector
        document.querySelector(UISelectors.itemList).addEventListener('click', (event) => {
            event.preventDefault();
            // Since the edit icon is dynamic, we have to use event delegation. So we get the parent item and then we find the ui element we need
            if (event.target.classList.contains('edit-item')) {
                // Get List ID -- Remember that this is the List ID (Generated by the UI) and not the actual Item ID that's stored in the database/data.
                const listId = event.target.parentNode.parentNode.id;
                // Get the actual ID
                const itemId = parseInt(listId.split('-')[1]);
                // Get the actual item obj from db
                const itemToEdit = ItemCtrl.getItemById(itemId);
                if (itemToEdit) {
                    // Set it as current Item
                    ItemCtrl.setCurrentItem(itemToEdit);
                    UICtrl.addItemToForm(ItemCtrl.getCurrentItem());
                }
            }
            
        });

        // Disable submit on enter -- This event common across the DOM, emphasized by the document.addEventListener instead of document.querySelector and then adding Event listener
        document.addEventListener('keypress', (event) => {
            if (event.keyCode === 13 || event.which === 13) {
                event.preventDefault();
                return false;
            }
        });

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
                    // Update and Set Total Calories in the UI
                    UICtrl.setTotalCalories(ItemCtrl.getTotalCalories());
                    // Clear UI elements
                    UICtrl.clearInputs();
                    console.log(ItemCtrl.logData());
                }

            } else {
               UICtrl.addError('Enter valid Item Name and Calorie count');
            }
        });

        document.querySelector(UISelectors.updateBtn).addEventListener('click', (event) => {
            event.preventDefault();

            // Get Item input
            const input = UICtrl.getItemInput();

            // Update Item
            const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

            if (updatedItem) {
                // Repopulate the Item List to reflect the changes
                UICtrl.populateItemList(ItemCtrl.getItems());
                // Update Total Calories
                UICtrl.setTotalCalories(ItemCtrl.getTotalCalories());
                // Clear other errors and inputs
                UICtrl.clearEditState();
            } else {
                UICtrl.addError('Failed to update selected item. Please try again.');
            }
        });

        document.querySelector(UISelectors.backBtn).addEventListener('click', (event) => {
            event.preventDefault();

            //Just clear errors and clear inputs.
            UICtrl.clearEditState();
        });


        document.querySelector(UISelectors.deleteBtn).addEventListener('click', (event) => {
            event.preventDefault();

            // Delete Item
            ItemCtrl.deleteItem();

            // Clear Edit State
            UICtrl.clearEditState();

            // Recalculate total calories
            UICtrl.setTotalCalories(ItemCtrl.getTotalCalories());

            // Repopulate Item List
            UICtrl.populateItemList();
        });

        document.querySelector(UISelectors.clearBtn).addEventListener('click', (event) => {
            event.preventDefault();

            // Delete All Items
            ItemCtrl.clearItems();

            // Clear Edit State
            UICtrl.clearEditState();

            // Set Total Calories as 0
            UICtrl.setTotalCalories(0);

            // Repopulate Item List
            UICtrl.populateItemList();
        });

    };

    return {
        init: function () {
            console.log('Initializing App');

            // Clear / Edit Initial State
            UICtrl.clearEditState();

            // Fetch items from the data structure -- could be an external api as well
            const items = ItemCtrl.getItems();

            // Check if items are present
            if (!items || items.length === 0) {
                UICtrl.hideList();
            }

            // Populate list with items
            UICtrl.populateItemList(items);

            // Set Total Calories
            UICtrl.setTotalCalories(ItemCtrl.getTotalCalories());

            // Load all event listeners
            loadEventListeners();

            //Clear All Errors -- Prophylactic
            UICtrl.clearErrors();
        }
    };

})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();

