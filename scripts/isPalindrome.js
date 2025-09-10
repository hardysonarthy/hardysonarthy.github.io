function isPalindrome(input) {
    let x = input;
    if (x < 0 || (x % 10 === 0 && x !== 0)) {
        return false;
    }
    let revertedNumber = 0;
    while (x > revertedNumber) {
        revertedNumber = revertedNumber * 10 + x % 10;
        x /= 10;
    }

    return x === revertedNumber || x === revertedNumber / 10;
};

[
    121,
    -121,
    10,
    11
].map(val => console.log(
    `${val} ${isPalindrome(val)}`))