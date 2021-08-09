const Queue = require('bee-queue');
const redis = require('redis');
const client = redis.createClient({
  host: 'redis-11010.c51.ap-southeast-2-1.ec2.cloud.redislabs.com',
  port: '11010',
  password: 'fIMR9EcN0qF2NCMowFj0ikQ1TdXsEdQ6'
});
const sharedConfig = {
  redis: client,
};
const queue = new Queue('crawl-inbox-facebook', sharedConfig);
// Model && logic
const ConversationService = require('../services/ConversationService');
const MessengerService = require('../services/MessengerService');
const axios = require('axios');
const logger = require('../commons/winston');

/** Method create job.
 * @param {String} pageToken - id of messenger
 */
module.exports.CreateJob = (pageToken) => {
  let job = queue.createJob({ pageToken: pageToken });
  job.save();
  job.on('succeeded', (result) => {
    console.log(`Received result for job ${job.id}: ${result}`);
  });
  queue.on('error', (err) => {
    console.log(`A queue error happened: ${err.message}`);
  });
  queue.on('failed', (job, err) => {
    console.log(`Job ${job.id} failed with error ${err.message}`);
  });
};

/** Method delete messenger.
 * @async
 * @param {ObjectId} id - id of messenger
 */

/** Method recursive get messenger of pagination.
 * @async
 * @param {Object} conversation - conversation
 * @param {String} CURL - CURL
 */
const nexSaveConversations = async (conversation, CURL) => {
  let responseMessenger = await axios.get(CURL);
  let countMessenger = responseMessenger.data.data.length;
  responseMessenger.data.data.map(async (v, k) => {
    let model = {
      message: v.message,
      from: v.from.name,
      created_time: v.created_time,
    };
    let messageData = await MessengerService.findOneAndUpdate(model, model, {
      new: true,
      upsert: true // Make this update into an upsert
    });
    // add messenger on conversation
    conversation.child = [...conversation.child, messageData.id];
    if (k === (countMessenger - 1)){
      let modelConversation = await ConversationService.findOneAndUpdate(
        { fbID: conversation.fbID },
        conversation,
        {
          new: true,
          upsert: true // Make this update into an upsert
        });
    }
  });
  // end method saveConversations
  try {
    let pagination = responseMessenger.data.paging.next;
    if (pagination){
      nexSaveConversations(conversation, pagination);
    }
  } catch (error) {
    console.log(error);
  }
};

// save message of conversation.
const saveConversations = async (conversation, token) => {
  const pageToken = token;
  // CURL Get messenger of conversation
  const CURL = "https://graph.facebook.com/v11.0/" + conversation.fbID
  + "?fields=messages%7Bfrom%2Cmessage%2Ccreated_time%7D&access_token=" + pageToken;

  conversation.child = [];
  let responseMessenger = await axios.get(CURL);
  let countMessenger = responseMessenger.data.messages.data.length;
  responseMessenger.data.messages.data.map(async (v, k) => {
    let model = {
      message: v.message,
      from: v.from.name,
      created_time: v.created_time,
    };
    let messageData = await MessengerService.findOneAndUpdate(model, model, {
      new: true,
      upsert: true // Make this update into an upsert
    });
    // add messenger on conversation
    conversation.child = [...conversation.child, messageData.id];
    if (k === (countMessenger - 1)){
      await ConversationService.save(conversation);
    }
  });
  // end method saveConversations
  try {
    let pagination = responseMessenger.data.messages.paging.next;
    if (pagination){
      nexSaveConversations(conversation, pagination);
    }
    // logger.log(typeof pagination);
  } catch (error) {
    console.log(error);
  }
};

// Process jobs from as many servers or processes as you like
queue.process(async (job, done) => {
  logger.info(job);
  const pageToken = job.data.pageToken;
  const CURL = "https://graph.facebook.com/v11.0/me?fields=conversations%7Bid%2Cparticipants%7D&access_token=" + pageToken;
  let responseConversations = await axios.get(CURL);
  responseConversations.data.conversations.data.map(async (v, k) => {
    let conversation = await ConversationService.findOne({ fbID: v.id });
    if (conversation){
      // update
      saveConversations(conversation, pageToken);
    } else {
      // create
      let participantName = v.participants.data[0].name;
      let model = {
        fbID: v.id,
        name: participantName,
      };
      ConversationService.save(model).then(data => {
        saveConversations(data, pageToken);
      });
    }
  });
  return done(null, responseConversations.data);
});
