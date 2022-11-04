import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { Client } from 'twilio-chat';
import { Conversation } from '@twilio/conversations';
import { Message } from '@twilio/conversations';
import useVideoContext from '../twilioutils/hooks/useVideoContext/useVideoContext'
import { Twilio } from 'twilio';

type ChatContextType = {
  isChatWindowOpen: boolean;
  setIsChatWindowOpen: (isChatWindowOpen: boolean) => void;
  connect: (token: string) => void;
  hasUnreadMessages: boolean;
  messages: Message[];
  conversation: any;
};

export const ChatContext = createContext<ChatContextType>(null!);

export const ChatProvider = ({ children }: any) => {
  const { room, onError } = useVideoContext();
  const isChatWindowOpenRef = useRef(false);
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);
  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [chatClient, setChatClient] = useState<Client>();

  const connect = useCallback(
    (token: string) => {
      const client = new Client(token);
      
      const handleClientInitialized = (state: string) => {
        if (state === 'initialized') {
          // @ts-ignore
          // window.chatClient = client;
          console.log(client)
          setChatClient(client);
        } else if (state === 'failed') {
          onError(new Error("There was a problem connecting to Twilio's conversation service."));
        }
      };

      client.on('stateChanged', handleClientInitialized);
      client.on('tokenAboutToExpire', () => console.log('tokenAboutToExpire'))
      client.on('tokenExpired', () => console.log('tokenExpired'))

      return () => {
        client.off('stateChanged', handleClientInitialized);
        client.off('tokenAboutToExpire', () => console.log('tokenAboutToExpire'))
        client.off('tokenExpired', () => console.log('tokenExpired'))
      };
    },
    [onError]
  );

  useEffect(() => {
    if (conversation) {
      console.log('it here')
      const handleMessageAdded = (message: Message) => setMessages(oldMessages => [...oldMessages, message]);
      conversation.join().then((channel) => console.log('you are joined'))
      conversation.getMessages().then(newMessages => setMessages(newMessages.items));
      conversation.on('messageAdded', handleMessageAdded);
      return () => {
        conversation.off('messageAdded', handleMessageAdded);
      };
    }
  }, [conversation]);

  useEffect(() => {
    // If the chat window is closed and there are new messages, set hasUnreadMessages to true
    if (!isChatWindowOpenRef.current && messages.length) {
      setHasUnreadMessages(true);
    }
  }, [messages]);

  useEffect(() => {
    isChatWindowOpenRef.current = isChatWindowOpen;
    if (isChatWindowOpen) setHasUnreadMessages(false);
  }, [isChatWindowOpen]);

  function createOrJoinGeneralChannel() {
    // Get the general chat channel, which is where all the messages are
    // sent in this simple application
    console.log('Attempting to join "general" chat channel...');
    chatClient
      .getChannelByUniqueName('general')
      .then(async (newConversation) => {
        console.log('Found general channel:');
        console.log(newConversation)
        //@ts-ignore
        // window.chatConversation = newConversation;
        setConversation(newConversation);
      })
      .catch(e => {
        console.error(e)
        // onError(new Error('There was a problem getting the Conversation associated with this room.'));
        if(e.message === 'Not Found') {
          console.log('Creating general channel:');
          chatClient
            .createChannel({
              uniqueName: "general",
              friendlyName: "General Chat Channel",
            })
            .then(async (newConversation) => {
              console.log('Created general channel:');
              console.log(newConversation)
              //@ts-ignore
              // window.chatConversation = newConversation;
              setConversation(newConversation);
            })
            .catch(e => {
              console.error(e)
              onError(new Error('There was a problem creating the Conversation associated with this room.'));
            })
        }
      });
  }

  useEffect(() => {
    if (room && chatClient) {
      chatClient
        .getSubscribedChannels()
        .then(createOrJoinGeneralChannel)
    }
  }, [room, chatClient, onError]);

  return (
    <ChatContext.Provider
      value={{ isChatWindowOpen, setIsChatWindowOpen, connect, hasUnreadMessages, messages, conversation }}
    >
      {children}
    </ChatContext.Provider>
  );
};
