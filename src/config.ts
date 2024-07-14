const serverAPIBaseURL = process.env.REACT_APP_SERVER_API_BASE_URL || 'http://localhost:4000/api/v1';

const htmConceptsEmail = process.env.HTM_CONCEPTS_EMAIL || 'info@htm-concepts.ch';
const htmConceptsWebsite = process.env.HTM_CONCEPTS_WEBSITE || 'https://www.htm-concepts.ch';
const htmConceptsWebsiteContact = new URL(process.env.HTM_CONCEPTS_WEBSITE_CONTACT_PATH || '/kontakt',
  htmConceptsWebsite).toString();

const metosWebsite = process.env.METOS_WEBSITE || 'https://www.metos.com';
const elroWebsite = process.env.ELRO_WEBSITE || 'https://elro.ch';
const schmolkeWebsite = process.env.SCHMOLKE_WEBSITE || 'https://www.schmolke-online.de';

export {
  serverAPIBaseURL,

  htmConceptsEmail,
  htmConceptsWebsite,
  htmConceptsWebsiteContact,

  metosWebsite,
  elroWebsite,
  schmolkeWebsite
};
