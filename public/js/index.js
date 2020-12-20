
let num = document.querySelector(".num");
let counter = 0;
let pause = document.querySelector(".pause");

setInterval(() => {
    if (counter == 100) {
        clearInterval();
        document.getElementById("closeroom").click()
    } else {
        counter++
        num.textContent = `${counter}%`
    };
}, 36000);
