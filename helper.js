export const getReturnAmount = (ratio, amt) => {
    const rat = ratio.split(":").map((x) => parseFloat(x));
    return (rat[1]*amt / rat[0]);
}

export const randomNumber = () => {
    return Math.floor((Math.random() * 5) + 1);
}