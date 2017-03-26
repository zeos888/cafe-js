Cafe = (function () {
    var instance;
    var tables;
    var dishes;
    var drinks;
    var waiters;
    var clients;
    var orders;
    function createInstance() {
        var thisCafe = new Object("Cafe JS");
        thisCafe.tables = [0, 0, 0, 0, 0, 0, 0, 0];
        thisCafe.dishes = {};
        return new Object("Cafe JS");
    }
    function getInstance() {
        if (!instance){
            instance = createInstance();
        }
        return instance;
    }
})();

function run() {
    var cafe = Cafe.getInstance();
}