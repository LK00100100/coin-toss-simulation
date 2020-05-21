window.onload = init;

//called when the document loads.
function init() {

}

/**
 * actually does the monte carlo simulation 
 * 
 * data is generated.
 * then various UI elements are updated.
 */
function simulate() {
    let startingMoney = parseFloat(document.getElementById("input-starting-money").value);
    let betAmount = parseFloat(document.getElementById("input-bet-amount").value);
    let payoutWin = parseFloat(document.getElementById("input-payout-win").value);
    let numToss = parseInt(document.getElementById("input-num-toss").value);

    let tossResults = [];

    let wallet = startingMoney;

    //toss the coin many times
    for (let i = 0; i < numToss; i++) {
        let isHead = tossCoin();

        //can't lose over 100%
        let betOnTable = betAmount;
        if (betOnTable > wallet)
            betOnTable = wallet;

        if (isHead) {
            //round up to nearest cent
            let winnings = (betOnTable * payoutWin).toFixed(2);
            winnings = parseFloat(winnings);

            wallet += winnings;
            wallet = parseFloat(wallet.toFixed(2));
        }
        else {
            wallet -= betOnTable;
        }

        tossResults.push({ isHead, wallet });

        //out of money
        if (wallet == 0) {
            break;
        }
    }

    //update UI elements
    updateResultTableElement(tossResults);
    updateHistoryAndStatsTable(tossResults);
};

/**
 * Tosses a fair 50/50 chance coin.
 * @returns {Boolean} true if heads; false if tails
 */
function tossCoin() {
    let coinResult = getRandomIntInclusive(0, 1);

    return coinResult == 1 ? true : false;
}

/**
 * from mozilla
 * Generates a random number.
 * getRandomInt(1, 3) => 1, 2 or 3
 * @param {Number} min 
 * @param {Number} max 
 */
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
};

/**
 * Clears and updates the current result table
 * @param {Array<{isHead:Boolean, wallet:Number}>} results an array of results.
 */
function updateResultTableElement(results) {
    let tableElement = document.getElementById("result-table");
    tableElement.textContent = "";

    //make title header
    let tableRow = document.createElement("tr");
    let tableHeader = document.createElement("th");
    tableHeader.setAttribute("colspan", 3);
    tableHeader.textContent = "Results";
    tableElement.appendChild(tableHeader);

    //make header
    tableRow = document.createElement("tr");

    let headerToss = document.createElement("th")
    headerToss.textContent = "Toss #";

    let headerIsHead = document.createElement("th")
    headerIsHead.textContent = "Is Head";

    let headerWallet = document.createElement("th")
    headerWallet.textContent = "Wallet $";

    tableRow.appendChild(headerToss);
    tableRow.appendChild(headerIsHead);
    tableRow.appendChild(headerWallet);
    tableElement.appendChild(tableRow);

    //create a data row for each point
    results.forEach((result, rowNum) => {
        let isHead = result.isHead
        let wallet = result.wallet

        let textColor = isHead ? "green-text" : "red-text";

        //create a row
        let tableRow = document.createElement("tr");

        let dataTossNum = document.createElement("td")
        dataTossNum.textContent = rowNum + 1; //started at 0

        let dataIsHead = document.createElement("td")
        dataIsHead.setAttribute("class", textColor);
        dataIsHead.textContent = isHead;

        let dataWallet = document.createElement("td")
        dataWallet.textContent = wallet;

        //add to row and table
        tableRow.appendChild(dataTossNum);
        tableRow.appendChild(dataIsHead);
        tableRow.appendChild(dataWallet);
        tableElement.appendChild(tableRow);
    });

}

/**
 * updates the results-stats with actual stats
 * updates the history table
 * @param {Array<{isHead:Boolean, wallet:Number}>} results an array of results.
 */
function updateHistoryAndStatsTable(results) {
    let startingMoney = parseFloat(document.getElementById("input-starting-money").value);

    document.getElementById("results-stats").style.display = "block";   //unhide it

    const totalToss = results.length;
    const numIsHeads = results.filter(result => result.isHead).length;
    const numIsTails = totalToss - numIsHeads;
    const walletEnd = results[results.length - 1].wallet
    let changePercentage = ((walletEnd - startingMoney) / startingMoney);
    changePercentage = (changePercentage * 100).toFixed(2); //convert to format 100.0%

    let totalTossMessage = "Total # Toss: " + totalToss;
    let isHeadsMessage = "# Heads: " + numIsHeads;
    let isTailsMessage = "# Tails: " + numIsTails
    let walletEndMessage = "Wallet $ End: " + walletEnd;
    let changePercentMessage = "Change %: " + changePercentage;

    document.getElementById("stats-results-num-toss").textContent = totalTossMessage;
    document.getElementById("stats-results-heads").textContent = isHeadsMessage;
    document.getElementById("stats-results-tails").textContent = isTailsMessage;
    document.getElementById("stats-wallet-end").textContent = walletEndMessage;

    let changePercentElem = document.getElementById("stats-wallet-change-percent")
    changePercentElem.textContent = changePercentMessage;
    if (parseInt(changePercentage) > 0)
        changePercentElem.setAttribute("class", "green-text");
    else
        changePercentElem.setAttribute("class", "red-text");

    appendHistory(totalToss, walletEnd, changePercentage);
}

/**
 * Adds a game result to the history table
 * @param {Number} totalToss total tosses in a game
 * @param {Number} walletEnd wallet at the end of a game
 * @param {String} changePercentage ex: "100" = 100%
 */
function appendHistory(totalToss, walletEnd, changePercentage) {
    let table = document.getElementById("history-table");

    let numEntries = table.children.length;

    //create and append row
    let tableRow = document.createElement("tr");

    let tdNum = document.createElement("td");
    tdNum.textContent = numEntries;

    let tdTotalToss = document.createElement("td");
    tdTotalToss.textContent = totalToss;

    let tdWalletEnd = document.createElement("td");
    tdWalletEnd.textContent = walletEnd;

    let tdWalletChangePercent = document.createElement("td");
    tdWalletChangePercent.textContent = changePercentage + "%";

    if (parseInt(changePercentage) > 0)
        tdWalletChangePercent.setAttribute("class", "green-text");
    else
        tdWalletChangePercent.setAttribute("class", "red-text");

    tableRow.appendChild(tdNum);
    tableRow.appendChild(tdTotalToss);
    tableRow.appendChild(tdWalletEnd);
    tableRow.appendChild(tdWalletChangePercent);
    table.appendChild(tableRow);
}
