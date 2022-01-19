import { getReturnAmount, randomNumber } from "./helper.js";
import { getWalletBalance, transferSOL, treasuryWallet, userWallet } from "./solana.js";
import readline from "readline-sync";
import chalk from 'chalk';
import figlet from 'figlet';

const log = console.log;
const error = (msg) => {
    log(chalk.redBright(`[-] ${msg}`));
}
const warning = (msg) => {
    log(chalk.yellowBright(`[!] ${msg}`));
}
const heading = (msg) => {
    log(chalk.cyanBright(`  ----  ${msg}  ----  `));
}
const success = (msg) => {
    log(chalk.greenBright(`[+] ${msg}`));
}
const question = (ques) => {
    process.stdout.write(chalk.magentaBright("[?] "));
    process.stdout.write(ques);
    return readline.question();
}

const printBanner = () => {
    // banner
    log(chalk.cyanBright(figlet.textSync('SOLANA    ROULETTE', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        whitespaceBreak: true
    })));
}

const printMenu = () => {
    // menu
    log();
    log(chalk.blueBright("  ----  Menu  ----  "));
    log(chalk.blueBright("[1]. Play Game"));
    log(chalk.blueBright("[2]. Fetch wallet's amount"));
    log(chalk.blueBright("[3]. Exit [->]"));
    log();
}

const gameExecution = async () => {
    heading("Play Game");

    // warning of max bid
    warning("The max bidding amount is 2.5 SOL here");

    // taking bid amount
    var amt = parseFloat(question("What is the amount of SOL you want to stake? "));  // check type of amt
    
    // taking bid ratio
    const ratio = question("What is the ratio of your staking? ");  // check type of amt

    const reward = getReturnAmount(ratio, amt);

    // request for address
    warning(`${amt} will be taken from your account to move forward`);
    warning(`You will get ${reward} if guessing the number correctly`);

    try{
        const balance = await getWalletBalance(userWallet);
        if(balance < amt){
            error("Insufficient Balance");
            return;
        }
    } catch (err) {
        error("Invalid address");
        return;
    }

    try{
        const signature = await transferSOL(userWallet, treasuryWallet, amt);
        success(`Signature of payment for playing the game ${signature}`);
    } catch (err) {
        error("Transaction Failed");
        return;
    }

    const answer = randomNumber();
    const guess = parseInt(question("Guess a random number from 1 to 5 (both 1, 5 included) : ")); // check

    if(guess === answer){
        // success
        success("You guess it absolutely correct :)");
        try{
            const signature = await transferSOL(treasuryWallet, userWallet, reward);
            success(`Here is the price signature ${signature}`);
        } catch (err) {
            error("Transaction Failed");
            return;
        }
    } else {
        // failed
        error("Better luck next time :(");
    }

}

const fetchBalance = async () => {
    heading("Fetch Balance Left");
    try{
        const balance = await getWalletBalance(userWallet);
        success(`Balance ${balance}`);
    } catch (err) {
        error("Invalid address");
        return;
    }
}

const main = async () => {
    printBanner();

    while(true) {
        printMenu();
        var choice = parseInt(question("Choice : "));
        log();
        switch(choice){
            case 1:
                await gameExecution();
                break;
            case 2:
                await fetchBalance();
                break;
            case 3:
                success("Thank you for using the application :)");
                return;
            default:
                error("Invalid Choice");
                break;
        }
    }
}

main();
