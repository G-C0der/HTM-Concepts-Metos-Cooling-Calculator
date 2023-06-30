import React from 'react';
import {htmConceptsEmail} from "../../config";

interface MessageProps {
  message: string;
}

const substringTagMap = {
  '##here##': <a href={`mailto:${htmConceptsEmail}`} target="_blank" rel="noreferrer">here</a>
};

const Message = ({ message }: MessageProps) => {
  let modifiedMessage: any = message;

  for (const [key, val] of Object.entries(substringTagMap)) {
    const parts = modifiedMessage.split(key);
    modifiedMessage = parts.map((part: string, index: number) =>
      index < parts.length - 1 ?
        [part, React.cloneElement(val, { key: index }), " "] :
        part
    );
  }

  return (
    <>{modifiedMessage}</>
  );
};

export {
  Message
};