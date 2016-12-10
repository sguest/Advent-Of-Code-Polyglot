let readline = require('readline');

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let lines = [];

let bots = [];
let outputs = [];

//Handle bots that have not yet been initialized yet
//Allows assigning to bots as we find them
function giveValue(num, type, value) {
  if(type === 'bot') {
    if(!bots[num]) {
      bots[num] = [];
    }
    
    bots[num].push(value);
  }
  else {
    outputs[num] = value;
  }
}

let giveParser = /^bot (\d+) gives low to (output|bot) (\d+) and high to (output|bot) (\d+)$/;
let valueParser = /^value (\d+) goes to bot (\d+)$/;

//reading all lines and storing instead of processing on the spot since we require multiple passes
rl.on('line', (line) => {
    lines.push(line);
});

//start processing once whole input file is read
rl.on('close', () => {
  let newLines = lines;

  //keep going if we have un-processed lines
  while(newLines.length) {
    lines = newLines;
    newLines = [];
    
    for(let line of lines) {
      let parsed = valueParser.exec(line);
      
      //initial value-setting line, always valid
      if(parsed) {
        let value = Number(parsed[1]);
        let botNum = Number(parsed[2]);
        
        giveValue(botNum, 'bot', value);
        
        continue;
      }

      //must be a give line
      parsed = giveParser.exec(line);
      
      let botNum = Number(parsed[1]);
      let lowOutputType = parsed[2];
      let lowBotNum = Number(parsed[3]);
      let highBotNum = Number(parsed[5]);
      let highOutputType = parsed[4];      
        
      let bot = bots[botNum];
      
      //this bot doesn't have both values yet, can't give anywhere
      //add to unprocessed and come back later
      if(!bot || bot.length < 2) {
        newLines.push(line);
        continue;
      }
        
      let lowValue;
      let highValue;
          
      if(bot[0] < bot[1]) {
        lowValue = bot[0];
        highValue = bot[1];
      }
      else {
        lowValue = bot[1];
        highValue = bot[0];
      }
                
      giveValue(lowBotNum, lowOutputType, lowValue);
      giveValue(highBotNum, highOutputType, highValue);
    }
  }
  
  console.log(outputs[0] * outputs[1] * outputs[2]);
});