(function () {
    function add(num1,num2) {
        return num1 + num2
    }
    console.log(add(22,44));
})();
(function () {
    var result = [1,2,3,4,5,6].map(function (item,index) {
        return item + 10
    })
    console.log(result);
})()