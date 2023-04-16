const { PrismaClient } = require('@prisma/client');
const { message: Message, conversation: Conversation } = new PrismaClient();

const createNewMessage = async (message, conversationId, userId) => {
  const conversation = await Conversation.findUnique({
    where: {
      id: conversationId,
    },
  });

  const newMessage = await Message.create({
    data: {
      data: message,
      conversationId: conversation.id,
      userId,
    },
  });

  return newMessage;
};

const createConversation = async (userIds) => {
  const conversation = await Conversation.create({
    data: {
      users: {
        connect: userIds.map((id) => ({ id })),
      },
    },
  });
  return conversation;
};

module.exports = { createNewMessage, createConversation };
