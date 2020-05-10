// Task Controller
var taskController = (function () {
    
    // Task Constructor function
    var Task = function (date, month, desc, status) {
        this.date = date;
        this.month = month;
        this.desc = desc;
        this.status = 'Incomplete';
    }
    
    // For storing tasks
    var itemsList = { };
    
    // Check if itemsList is empty
    var lengthCheck = () => {
        let x = 0;
        for (let key in itemsList) {
            x += 1;
        }
        return x;
    }
    
    return {
        // Add item to internal ddata structure
        addItems: function(date, month, desc) {
            
            const id = lengthCheck();
            
            status = 'Incomplete';
                        
            newItem = new Task(date, month, desc, status);
            newItem.id = id;
            itemsList[id] = newItem;
            
            return newItem;
        },
        
        // Remove item from internal data structure
        removeItem: function(removeEl) {
            var remover = removeEl.split(' ');
            remover = remover[1].split('_');
            remover = parseFloat(remover[1]);
            delete itemsList[remover];
        }
        
    }
    
})();


// UI Controller
var UIController = (function () {
    
    // Set DOM Strings for use
    var DOMStrings = {
        newDate: '.dateIn',
        newMonth: '.monthIn',
        newDesc: '.descIn',
        addButton: '.addButton',
        mainDiv: '.listContainer',
        listBox: '.listContainer',
        toDelete: '.listBox'
    };
    
    return {
        // Take in and return new user input after click event
        newInput: function () {
            return {
                date: document.querySelector(DOMStrings.newDate).value,
                month: document.querySelector(DOMStrings.newMonth).value,
                desc: document.querySelector(DOMStrings.newDesc).value
            };
        },
        
        // Add items to the UI
        addItemtoUI: function(newItem) {
            var insertString;
            
            // Placeholder string
            insertString = '<div id="listID" class="listBox listItem_%id% margin_maker"><div class="date list">12</div><div class="month list">%month%</div><div class="task list">%desc%</div><div class="status list"><div class="incoText">%stat%</div><div class="compText">Complete<ion-label><ion-icon name="checkmark-outline"></ion-icon></ion-label></div></div></div>'
            
            // Replace placeholder strings
            insertString = insertString.replace('%id%', newItem.id);
            insertString = insertString.replace('%date%', newItem.date);
            insertString = insertString.replace('%month%', newItem.month);
            insertString = insertString.replace('%desc%', newItem.desc);
            insertString = insertString.replace('%stat%', newItem.status);
           
           // Place above string into list
            document.querySelector(DOMStrings.mainDiv).insertAdjacentHTML('beforeend', insertString);
        },
        
        // Clear the text fields
        clearFields: function () {
            var clearer = document.querySelectorAll(
                DOMStrings.newDate + ', ' +
                DOMStrings.newDesc
            );
            
            var clearerArr = Array.prototype.slice.call(clearer);
            clearerArr.forEach(x => x.value = '' );
            
            clearer[0].focus();
        },
        
        // Remove item from the UI
        removeItem: function (removeEl) {
            removeEl.remove();
        },
        
        // Send DOMStrings for use by others
        getDOMStrings: function () {
            return DOMStrings;
        }

    };
    
})();


// App Controller
var appController = (function(tskCtrl, UICtrl) {  
    
    // Call back DOM strings from UI Controller
    var DStrings = UICtrl.getDOMStrings();
    
    // Setup trigger events
    var eventListeners = () => {
        // Set focus to date input box on load
        document.querySelector(DStrings.newDate).focus();
        
        // Listen for click on 'add' button event
        document.querySelector(DStrings.addButton).addEventListener('click', addItems);
        
        // Listen for 'enter' press event
        document.addEventListener('keydown', function (event) {
            if (event.keyCode === '13' || event.keyCode === 13) {
                addItems();
            }
        });
        
        // Listen for click on list element for delete
        document.querySelector(DStrings.listBox).addEventListener('click', deleteItem);
    };

    
    // Validate and add items to the internal data structure and the UI
    var addItems = () => {
        var newItem, regexchk, valDate, valDesc;
        
        // Get the user filled data from the form
        newItem = UICtrl.newInput();
        
        // Perform Regex validation on the user input 
        regexchk = {
            date: /^(3[0-1]|2[0-9]|[01]?[0-9])$/gi,
            desc: /[\w]+/gi
        };
        
        // Regex in action
        (newItem.date.match(regexchk.date)) ?valDate = 1 :valDate = 0;
        (newItem.desc.match(regexchk.desc)) ?valDesc = 1 :valDesc = 0;
        
        if (valDate === 1 && valDesc === 1) {
            // Add items to the internal data structure
            newItem = taskController.addItems(newItem.date, newItem.month, newItem.desc);

            // Add items to the UI
            UICtrl.addItemtoUI(newItem);

            // Clear the fields for new user input
            UICtrl.clearFields();
        } else {
            //Focus on error'ed text field
            if (valDate === 0) {
                alert("Invalid date. Please enter a valid date");
                document.querySelector(DStrings.newDate).focus();
            } else if (valDesc === 0) {
                alert("Invalid description. Please enter a valid description");
                document.querySelector(DStrings.newDesc).focus();
            }
        }
    };
    
    // Delete Item from internal data structure and the UI
    var deleteItem = (click) => {
        console.log("Delete");
        var removeEl;
        
        // Element to be removed
        removeEl = document.getElementById('listID');
        
        // Call a function to remove the element
        tskCtrl.removeItem(removeEl.className);
        
        // Remove item from the UI
        UICtrl.removeItem(removeEl);
        
    };

    return {
        // Initialization function
        init: function () {
            
            // Initialize event listeners
            eventListeners();
            
            // Initialization message
            console.log("Application has started");
        },
    };
    
    
})(taskController, UIController);

// APP initialisation
appController.init();