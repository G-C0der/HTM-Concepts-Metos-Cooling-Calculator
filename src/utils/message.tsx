import {htmConceptsEmail} from "../config";
import React from "react";
import {messageKeywords} from "../constants";

const substringTagMap = {
  [messageKeywords.here]: <a href={`mailto:${htmConceptsEmail}`} target="_blank" rel="noreferrer">here</a>
};

const mapMessageKeyword = (message: string) => {
  let modifiedMessage: any = message;

  for (const [key, val] of Object.entries(substringTagMap)) {
    const parts = modifiedMessage.split(key);
    modifiedMessage = parts.map((part: string, index: number) =>
      index < parts.length - 1 ?
        [part, React.cloneElement(val, { key: index }), ''] :
        part
    );
  }

  return modifiedMessage;
};

const doesMessageContainKeyword = (message: string, keyword: keyof typeof messageKeywords) =>
  message.includes(messageKeywords[keyword]);

export {
  mapMessageKeyword,
  doesMessageContainKeyword
};