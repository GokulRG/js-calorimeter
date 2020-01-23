//Storage Controller

//Item Controller
const ItemCtrl = (function () {
    //Item Constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data Structure - mimicking state
    const data = {
        items: [
            {id: 0, name: 'Steak Dinner', calories: 1200},
            {id: 1, name: 'Eggs', calories: 100},
            {id: 2, name: 'Cookies', calories: 400},
        ],
        currentItem: null,
        totalCalories: 0
    }

    //Public methods
    return {
        logData: function () {
            console.log(data);
        },
        getItems: function () {
            return data.items;
        }
    }
})();

//UI Controller
const UICtrl = (function () {

    const UISelectors = {
        itemList: 'item-list'
    }
    return {
        populateItemsList: function (items) {
            const itemList = document.getElementById(UISelectors.itemList);
            let html = '';
            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.id}">
                            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content"><i class="fa fa-pencil"></i></a>
                        </li>`
            });
            itemList.innerHTML = html;
        }
    }
})();

//App Controller
const App = (function (ItemCtrl, UICtrl) {
    return {
        init: function () {
            console.log('Initializing App...');
            const items = ItemCtrl.getItems();
            UICtrl.populateItemsList(items);
        }
    }
})(ItemCtrl, UICtrl);

//Initialize app
App.init();