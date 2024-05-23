const EventEmitter = require('events');
const journeyConfig = require('./components/configuration');

class JourneyService extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.userStates = {};  

    this.on('event', (userId, event) => {
      console.log(`Event received: ${event} for user: ${userId}`);
      this.handleEvent(userId, event);
    });
  }

  startJourney(userId) {
    const startBlock = this.config.start;
    this.userStates[userId] = {
      currentBlock: startBlock,
      startTime: Date.now()
    };
    console.log(`Journey started for user: ${userId}`);
    this.processBlock(userId);
  }

  handleEvent(userId, event) {
    const userState = this.userStates[userId];
    const currentBlockConfig = this.config.blocks[userState.currentBlock];

    if (!currentBlockConfig) {
      console.error(`No configuration found for block: ${userState.currentBlock}`);
      return;
    }

    if (currentBlockConfig.type === 'wait') {
      const nextBlock = currentBlockConfig.events[event];
      if (nextBlock) {
        userState.currentBlock = nextBlock;
        this.processBlock(userId);
      } else {
        console.error(`No transition defined for event: ${event} in block: ${userState.currentBlock}`);
      }
    }
  }

  processBlock(userId) {
    const userState = this.userStates[userId];
    const currentBlockConfig = this.config.blocks[userState.currentBlock];

    if (!currentBlockConfig) {
      console.error(`No configuration found for block: ${userState.currentBlock}`);
      return;
    }

    console.log(`Processing block: ${userState.currentBlock} for user: ${userId}`);

    switch (currentBlockConfig.type) {
      case 'action':
        this.performAction(userId, currentBlockConfig.action);
        userState.currentBlock = currentBlockConfig.next;
        if (userState.currentBlock && userState.currentBlock !== 'exit') {
          this.processBlock(userId);
        } else if (userState.currentBlock === 'exit') {
          console.log(`User ${userId} has exited the journey.`);
          delete this.userStates[userId];
        }
        break;
      case 'wait':
        setTimeout(() => {
          this.emit('event', userId, 'timeout');
        }, currentBlockConfig.timeout * 1000);
        break;
      case 'exit':
        console.log(`User ${userId} has exited the journey.`);
        delete this.userStates[userId];
        break;
      default:
        console.error(`Unknown block type: ${currentBlockConfig.type}`);
    }
  }

  performAction(userId, action) {
    console.log(`Performing action "${action}" for user ${userId}`);
    // Here we can implement the actual action logic(e.g, send email, update CRM)
  }
}

// Example usage has been used
const journeyService = new JourneyService(journeyConfig);

const userId = 'user123';
journeyService.startJourney(userId);

// Simulate an event after some time
setTimeout(() => {
  journeyService.emit('event', userId, 'email_link_clicked_yes');
}, 5000);
