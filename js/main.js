Cafe = (function Cafe() {
    var instance;

    function createInstance() {
        var thisCafe = {};
        thisCafe.tables = [];
        thisCafe.tables.push(new Table(1, "u okna sleva"));
        thisCafe.tables.push(new Table(2, "u okna sprava"));
        thisCafe.tables.push(new Table(3, "u steny sleva"));
        thisCafe.tables.push(new Table(4, "u steny sprava"));
        thisCafe.tables.push(new Table(5, "v centre"));
        thisCafe.dishes = [];
        thisCafe.dishes.push(new Dish("bublechke", 1, 100, "food"));
        thisCafe.dishes.push(new Dish("torteg", 5, 20, "food"));
        thisCafe.dishes.push(new Dish("pichenki", 1, 200, "food"));
        thisCafe.dishes.push(new Dish("perozhynka", 3, 25, "food"));
        thisCafe.dishes.push(new Dish("kohve", 10, 1000, "drink"));
        thisCafe.dishes.push(new Dish("chai", 8, 1000, "drink"));
        thisCafe.dishes.push(new Dish("kakava", 6, 1000, "drink"));
        thisCafe.orders = [];
        thisCafe.selectTable = function (tableId) {
            if (thisCafe.tables[tableId].isOccupied() > 0) {
                alert("Table " + tableId + " is occupied! Select another one!");
                return false;
            }
            thisCafe.tables[tableId].occupy();
            return true;
        };
        return thisCafe;
    }

    Order = function () {
        var _dishes = [];
        var _start = new Date();
        var _end;
        return {
            getStart: function () {
                return _start;
            },
            addDish: function (dish) {
                if (!_end) {
                    var is = false;
                    for (var i = 0; i < _dishes.length; i++) {
                        if (_dishes[i].getName() == dish.getName()) {
                            _dishes[i].addQuantity(dish.getQuantity());
                            is = true;
                        }
                    }
                    if (!is) {
                        _dishes.push(dish);
                    }
                }
            },
            getEnd: function () {
                return _end;
            },
            getCheck: function () {
                _end = new Date();
                var sum = 0;
                for (var i = 0; i < _dishes.length; i++) {
                    var dish = _dishes[i];
                    sum += dish.getQuantity() * dish.getPrice();
                }
                return sum;
            },
            getSum: function () {
                var sum = 0;
                for (var i = 0; i < _dishes.length; i++) {
                    var dish = _dishes[i];
                    sum += dish.getQuantity() * dish.getPrice();
                }
                return sum;
            },
            getDishes: function () {
                return _dishes;
            },
            removeDish: function (name) {
                if (!_end) {
                    for (var i = 0; i < _dishes.length; i++) {
                        var dish = _dishes[i];
                        if (dish.getName() == name && dish.sell(1) >= 0) {
                            if (dish.getQuantity() == 0) {
                                _dishes.pop(dish);
                            }
                            break;
                        }
                    }
                }
            }
        }
    };

    Table = function (id, name) {
        var _id = id;
        var _name = name;
        var _occupied = 0;
        var _activeOrder;
        return {
            getId: function () {
                return _id;
            },
            getName: function () {
                return _name;
            },
            occupy: function () {
                if (_occupied > 0) {
                    alert("Table #" + _id + " '" + _name + "' is occupied already!");
                    return false;
                }
                _occupied = 1;
                return true;
            },
            setOrder: function (order) {
                _activeOrder = order;
            },
            getOrder: function () {
                return _activeOrder;
            },
            isOccupied: function () {
                return _occupied;
            },
            release: function () {
                if (_activeOrder.getEnd()) {
                    _occupied = 0;
                    _activeOrder = undefined;
                }
            }
        }
    };
    Dish = function (name, price, quantity, type) {
        var _name = name;
        var _price = price;
        var _quantity = quantity;
        var _type = type;
        return {
            getName: function () {
                return _name;
            },
            getPrice: function () {
                return _price;
            },
            getQuantity: function () {
                return _quantity;
            },
            addQuantity: function (quantity) {
                _quantity = quantity + _quantity;
                return _quantity;
            },
            sell: function (quantity) {
                if (quantity <= _quantity) {
                    _quantity -= quantity;
                    return _quantity;
                } else {
                    return -1;
                }
            },
            getType: function () {
                return _type;
            },
            setName: function (newName) {
                _name = newName;
            },
            setPrice: function (newPrice) {
                _price = newPrice;
            },
            setType: function (newType) {
                _type = newType;
            },
            setQuantity: function (newQuantity) {
                _quantity = newQuantity;
            }
        }
    };
    return {
        get: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    }
})
();
function run() {
    var cafe = Cafe.get();
    showTables();
    showOrdersHistory();
    showManageDishes();
}
function clearArea(area) {
    while (area.firstChild) {
        area.removeChild(area.firstChild);
    }
}
function showTables() {
    var cafe = Cafe.get();
    var area = document.getElementById("tablesList");
    clearArea(area);
    for (var i = 0; i < cafe.tables.length; i++) {
        var table = cafe.tables[i];
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = "table #" + table.getId() + " '" + table.getName() + "'";
        if (table.isOccupied() == 0) {
            b.setAttribute("class", "btn btn-success btn-block");
            b.setAttribute("alt", "Table is free");
        } else {
            b.setAttribute("class", "btn btn-danger btn-block");
            b.setAttribute("alt", "Table is occupied");
        }
        b.setAttribute("onclick", "showTableDetails(" + i + ")");
        area.appendChild(b);
    }
}
function occupyTable(tableId) {
    var cafe = Cafe.get();
    cafe.selectTable(tableId);
    showTables();
    showTableDetails(tableId);
}
function showTableDetails(tableId, clearOrderDetails) {
    var cafe = Cafe.get();
    var area = document.getElementById("details");
    clearArea(area);
    if (!clearOrderDetails) {
        var area1 = document.getElementById("order");
        clearArea(area1);
    }
    var p = document.createElement("p");
    p.setAttribute("id", "detailsId");
    var h5 = document.createElement("h5");
    var table = cafe.tables[tableId];
    h5.textContent = "table #" + table.getId() + " '" + table.getName() + "'";
    p.appendChild(h5);
    if (table.isOccupied() == 0) {
        var bOccupy = document.createElement("button");
        bOccupy.type = "button";
        bOccupy.textContent = "Occupy table";
        bOccupy.setAttribute("class", "btn btn-success");
        bOccupy.setAttribute("onclick", "occupyTable(" + tableId + ")");
        p.appendChild(bOccupy);
    } else {
        var bOrder = document.createElement("button");
        bOrder.type = "button";
        if (!table.getOrder()) {
            bOrder.textContent = "Place order";
            bOrder.setAttribute("class", "btn btn-primary");
            bOrder.setAttribute("onclick", "showOrderArea(" + tableId + ")");
            p.appendChild(bOrder);
        } else {
            bOrder.textContent = "Open order";
            bOrder.setAttribute("class", "btn btn-warning btn-block");
            bOrder.setAttribute("onclick", "showOrderArea(" + tableId + ")");
            p.appendChild(bOrder);
            var order = table.getOrder();
            if (order.getDishes().length) {
                var bClose = document.createElement("button");
                bClose.type = "button";
                bClose.textContent = "Get check";
                bClose.setAttribute("class", "btn btn-primary btn-block");
                bClose.setAttribute("onclick", "closeOrder(" + tableId + ")");
                p.appendChild(bClose);
            }
        }
    }
    area.appendChild(p);
}
function showOrderArea(tableId) {
    var cafe = Cafe.get();
    var area = document.getElementById("order");
    clearArea(area);
    var table = cafe.tables[tableId];
    if (!table.getOrder()) {
        var newOrder = new Order();
        table.setOrder(newOrder);
        cafe.orders.push(newOrder);
        showOrdersHistory();
    }
    var p = document.createElement("p");
    var d = document.createElement("div");
    d.setAttribute("class", "dropdown");
    var bDrop = document.createElement("button");
    bDrop.type = "button";
    bDrop.setAttribute("class", "btn btn-default dropdown-toggle");
    bDrop.setAttribute("data-toggle", "dropdown");
    bDrop.setAttribute("aria-haspopup", "true");
    bDrop.setAttribute("aria-expanded", "true");
    bDrop.setAttribute("onclick", "showDishes(" + tableId + ")");
    bDrop.setAttribute("id", "dishesMenu");
    bDrop.innerHTML = "Select dish<span class=\"caret\">";
    d.appendChild(bDrop);
    var u = document.createElement("ul");
    u.setAttribute("class", "dropdown-menu");
    u.setAttribute("aria-labelledby", "dishesMenu");
    u.setAttribute("id", "menu");
    d.appendChild(u);
    p.appendChild(d);
    area.appendChild(p);
    var p1 = document.createElement("p");
    var order = table.getOrder();
    var dishes = order.getDishes();
    for (var i = 0; i < dishes.length; i++) {
        var b = document.createElement("button");
        var dish = dishes[i];
        b.type = "button";
        b.textContent = dish.getName() + ", " + dish.getQuantity() + " shtuk po " + dish.getPrice() + " rzhublei";
        b.setAttribute("class", "btn btn-primary btn-block");
        b.setAttribute("onclick", "removeDish(" + tableId + ", \"" + dish.getName() + "\")");
        p1.appendChild(b);
    }
    area.appendChild(p1);
    var p2 = document.createElement("p");
    var h51 = document.createElement("h5");
    h51.textContent = "Vsego " + order.getSum() + " rzhublei";
    p2.appendChild(h51);
    area.appendChild(p2);
    showTableDetails(tableId, 1);
}
function showDishes(tableId) {
    var cafe = Cafe.get();
    var area = document.getElementById("menu");
    clearArea(area);
    for (var i = 0; i < cafe.dishes.length; i++) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        var dish = cafe.dishes[i];
        a.setAttribute("onclick", "addDish(" + tableId + ", \"" + dish.getName() + "\")");
        a.setAttribute("href", "#");
        if (!dish.getQuantity()) {
            li.setAttribute("class", "disabled");
        }
        a.textContent = dish.getType() + " '" + dish.getName() + "' (" + dish.getQuantity() + " left)";
        li.appendChild(a);
        area.appendChild(li);
    }
}
function addDish(tableId, dishName) {
    var cafe = Cafe.get();
    var table = cafe.tables[tableId];
    var order = table.getOrder();
    var dish;
    for (var i = 0; i < cafe.dishes.length; i++) {
        var dish1 = cafe.dishes[i];
        if (dish1.getName() == dishName && dish1.sell(1) >= 0) {
            dish = new Dish(dish1.getName(), dish1.getPrice(), 1, dish1.getType());
        }
    }
    if (dish){
        order.addDish(dish);
    }
    showOrderArea(tableId);
    showOrdersHistory();
    clearDishDetails();
}
function removeDish(tableId, dishName) {
    var cafe = Cafe.get();
    var table = cafe.tables[tableId];
    var order = table.getOrder();
    order.removeDish(dishName);
    var dishes = cafe.dishes;
    for (var i = 0; i < dishes.length; i++) {
        var dish = dishes[i];
        if (dish.getName() == dishName && dish.sell(-1) >= 0) {
            break;
        }
    }
    showOrderArea(tableId);
    showOrdersHistory();
    clearDishDetails();
}
function closeOrder(tableId) {
    var cafe = Cafe.get();
    var table = cafe.tables[tableId];
    var order = table.getOrder();
    var total = order.getCheck();
    var area = document.getElementById("details");
    clearArea(area);
    var area1 = document.getElementById("order");
    clearArea(area1);
    var p = document.createElement("p");
    var h5 = document.createElement("h5");
    h5.textContent = "table #" + table.getId() + " '" + table.getName() + "'";
    p.appendChild(h5);
    var h51 = document.createElement("h5");
    h51.textContent = "get " + total + " rzhublei and release the table";
    p.appendChild(h51);
    var b = document.createElement("button");
    b.textContent = "Release table";
    b.setAttribute("onclick", "releaseTable(" + tableId + ")");
    b.setAttribute("class", "btn btn-success");
    p.appendChild(b);
    area.appendChild(p);
    showOrdersHistory();
}
function releaseTable(tableId) {
    var cafe = Cafe.get();
    var table = cafe.tables[tableId];
    table.release();
    var area = document.getElementById("details");
    clearArea(area);
    showTables();
}
function showOrdersHistory() {
    var cafe = Cafe.get();
    var area = document.getElementById("ordersHistory");
    clearArea(area);
    var sum = 0;
    for (var i = 0; i < cafe.orders.length; i++) {
        var order = cafe.orders[i];
        var r = document.createElement("tr");
        r.setAttribute("onclick", "showOrdersHistoryDetails(" + i + ")");
        var rh = document.createElement("th");
        rh.setAttribute("scope", "row");
        rh.textContent = i;
        r.appendChild(rh);
        var rd1 = document.createElement("td");
        var start = order.getStart();
        rd1.textContent = start.getFullYear() + "/" + start.getMonth() + "/" + start.getDate() + " " + start.getHours() + ":" + start.getMinutes();
        r.appendChild(rd1);
        var rd2 = document.createElement("td");
        if (order.getEnd()) {
            var end = order.getEnd();
            rd2.textContent = "done at " + end.getFullYear() + "/" + end.getMonth() + "/" + end.getDate() + " " + end.getHours() + ":" + end.getMinutes();
            ;
            r.setAttribute("class", "success");
            sum += order.getSum();
        } else {
            rd2.textContent = "in progress";
        }
        r.appendChild(rd2);
        var rd3 = document.createElement("td");
        rd3.textContent = order.getSum() + " rzhublei";
        r.appendChild(rd3);
        area.appendChild(r);
    }
    var sumArea = document.getElementById("totalOrders");
    sumArea.textContent = "Orders history. Total income: " + sum + " rzhublei";
}
function showOrdersHistoryDetails(orderId) {
    var cafe = Cafe.get();
    var area = document.getElementById("ordersHistoryDetails");
    clearArea(area);
    var order = cafe.orders[orderId];
    var h4 = document.createElement("h4");
    h4.textContent = "order #" + orderId + " details:";
    area.appendChild(h4);
    var h51 = document.createElement("h5");
    var start = order.getStart();
    h51.innerHTML = "<b>Started at: </b>" + start.getFullYear() + "/" + start.getMonth() + "/" + start.getDate() + " " + start.getHours() + ":" + start.getMinutes();
    area.appendChild(h51);
    var end = order.getEnd();
    var h52 = document.createElement("h5");
    if (order.getEnd()) {
        h52.innerHTML = "<b>State: </b>done at " + end.getFullYear() + "/" + end.getMonth() + "/" + end.getDate() + " " + end.getHours() + ":" + end.getMinutes();
        ;
    } else {
        h52.innerHTML = "<b>State: </b> in progress";
    }
    area.appendChild(h52);
    var ul = document.createElement("ul");
    ul.setAttribute("class", "list-group");
    var dishes = order.getDishes();
    for (var i = 0; i < dishes.length; i++) {
        var li = document.createElement("li");
        li.setAttribute("class", "list-group-item");
        var dish = dishes[i];
        li.innerHTML = "<span class=\"badge\">" + dish.getQuantity() + "</span>" + dish.getName();
        ul.appendChild(li);
    }
    area.appendChild(ul);
}
function showManageDishes() {
    var cafe = Cafe.get();
    var dishes = cafe.dishes;
    var area = document.getElementById("manageDishes");
    clearArea(area);
    var a0 = document.createElement("a");
    a0.setAttribute("href", "#");
    a0.setAttribute("class", "list-group-item active");
    a0.textContent = "Add new dish";
    a0.setAttribute("onclick", "openDish(" + (-1) + ")");
    area.appendChild(a0);
    for (var i = 0; i < dishes.length; i++) {
        var dish = dishes[i];
        var a = document.createElement("a");
        a.setAttribute("href", "#");
        a.setAttribute("class", "list-group-item");
        a.textContent = dish.getName();
        a.setAttribute("onclick", "openDish(" + i + ")");
        area.appendChild(a);
    }
}
function openDish(dishId) {
    var cafe = Cafe.get();
    var dishes = cafe.dishes;
    var dish;
    var header;
    if (dishId >= 0) {
        dish = dishes[dishId];
        header = "Edit dish '" + dish.getName() + "'";
    } else {
        dish = new Dish("", 0, 0, "");
        header = "Add new dish";
    }
    var area = document.getElementById("dishDetails");
    clearArea(area);
    var h4 = document.createElement("h4");
    h4.textContent = header;
    area.appendChild(h4);
    var f = document.createElement("form");
    f.setAttribute("class", "form-horizontal");
    openDishSubType(f, "dishType", "text", "Tip", "tip: food ili drink", dish.getType());
    openDishSub(f, "dishName", "text", "Nazvanie", "nazvanie", dish.getName());
    openDishSub(f, "dishPrice", "number", "Tcena", "tcena", dish.getPrice());
    openDishSub(f, "dishQuantity", "number", "Kolichestvo", "kolichestvo", dish.getQuantity());
    f.setAttribute("onchange", "showDishButtons(" + dishId + ")");
    f.setAttribute("oninput", "showDishButtons(" + dishId + ")");
    area.appendChild(f);
    showDishButtons(dishId);
}
function openDishSubType(form, dId, iType, label, placeholder, iValue) {
    var d1 = document.createElement("div");
    d1.setAttribute("class", "form-group form-group-sm");
    d1.setAttribute("id", dId + "Div");
    var l1 = document.createElement("label");
    l1.setAttribute("for", dId);
    l1.setAttribute("class", "col-sm-3 control-label");
    l1.textContent = label;
    d1.appendChild(l1);
    var d11 = document.createElement("div");
    d11.setAttribute("class", "col-sm-9");
    var inp1 = document.createElement("select");
    inp1.setAttribute("class", "form-control");
    inp1.setAttribute("id", dId);
    var o1 = document.createElement("option");
    o1.textContent="food";
    inp1.appendChild(o1);
    var o2 = document.createElement("option");
    o2.textContent="drink";
    inp1.appendChild(o2);
    if (iValue){
        inp1.value = iValue;
    } else {
        inp1.value = "food";
    }
    d11.appendChild(inp1);
    d1.appendChild(d11);
    form.appendChild(d1);
}
function openDishSub(form, dId, iType, label, placeholder, iValue) {
    var d1 = document.createElement("div");
    d1.setAttribute("class", "form-group form-group-sm");
    d1.setAttribute("id", dId + "Div");
    var l1 = document.createElement("label");
    l1.setAttribute("for", dId);
    l1.setAttribute("class", "col-sm-3 control-label");
    l1.textContent = label;
    d1.appendChild(l1);
    var d11 = document.createElement("div");
    d11.setAttribute("class", "col-sm-9");
    var inp1 = document.createElement("input");
    inp1.setAttribute("type", iType);
    inp1.setAttribute("class", "form-control");
    inp1.setAttribute("placeholder", placeholder);
    if (iType == "number") {
        inp1.setAttribute("min", "0");
    } else {
        inp1.setAttribute("pattern", "[A-Za-z0-9]{1,20}");
        inp1.setAttribute("oninput", "validateOnChange('" + dId + "')");
        if (!iValue) {
            d1.className = "form-group form-group-sm has-error";
        } else {
            d1.className = "form-group form-group-sm has-success";
        }
    }
    inp1.setAttribute("required", "required");
    inp1.setAttribute("id", dId);
    inp1.value = iValue;
    d11.appendChild(inp1);
    d1.appendChild(d11);
    form.appendChild(d1);
}
function showDishButtons(dishId) {
    var area = document.getElementById("dishButtons");
    var b = document.getElementById("saveDish");
    var disabled;
    if (b && b.getAttribute("disabled") || dishId < 0) {
        disabled = "disabled";
    }
    clearArea(area);
    var bSave = document.createElement("button");
    bSave.setAttribute("type", "button");
    bSave.setAttribute("class", "btn btn-primary col-sm-6");
    bSave.setAttribute("onclick", "saveDish('" + document.getElementById("dishName").value + "', " + document.getElementById("dishPrice").value + ", " + document.getElementById("dishQuantity").value + ", '" + document.getElementById("dishType").value + "', " + dishId + ")");
    bSave.setAttribute("id", "saveDish");
    bSave.textContent = "Save";
    if (!validateOnChange("dishName") || !validateOnChange("dishType")) {
        bSave.setAttribute("disabled", "disabled");
    }
    area.appendChild(bSave);
    var bCancel = document.createElement("button");
    bCancel.setAttribute("type", "button");
    bCancel.setAttribute("class", "btn btn-danger col-sm-6");
    bCancel.setAttribute("onclick", "clearDishDetails()");
    bCancel.textContent = "Cancel";
    area.appendChild(bCancel);
}
function clearDishDetails() {
    var area = document.getElementById("dishButtons");
    clearArea(area);
    var area = document.getElementById("dishDetails");
    clearArea(area);
}
function saveDish(dishName, dishPrice, dishQuantity, dishType, dishId) {
    var cafe = Cafe.get();
    var dishes = cafe.dishes;
    var dish;
    if (!dishName || dishName == "" || !dishType || dishType == "") {
        alert("Dish name and dish type must have values!");
        return false;
    }
    if (dishId >= 0) {
        dish = dishes[dishId];
        dish.setName(dishName);
        dish.setPrice(dishPrice);
        dish.setQuantity(dishQuantity);
        dish.setType(dishType);
    } else {
        dish = new Dish(dishName, dishPrice, dishQuantity, dishType);
        dishes.push(dish);
    }
    clearDishDetails();
    var area = document.getElementById("dishDetails");
    var p = document.createElement("p");
    p.setAttribute("class", "bg-success");
    if (dishId >= 0) {
        p.textContent = "Dish '" + dishName + "' was modified successfully!";
    } else {
        p.textContent = "Dish '" + dishName + "' was added successfully!";
    }
    area.appendChild(p);
    showManageDishes();
    setTimeout(function () {
        clearDishDetails()
    }, 1500);
}
function validateOnChange(id) {
    var area = document.getElementById(id + "Div");
    var el = document.getElementById(id);
    var s = document.getElementById("saveDish");
    if (el.value.search(el.pattern) == -1) {
        area.className = "form-group form-group-sm has-error";
        if (s) {
            s.setAttribute("disabled", "disabled");
        }
        return false;
    } else {
        area.className = "form-group form-group-sm has-success";
        if (s) {
            s.removeAttribute("disabled");
        }
        return true;
    }
}