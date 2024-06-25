import {
  // AuthenticationResult,
  // RedirectRequest,
  // Configuration,
  // EventMessage,
  BrowserCacheLocation,
  EventType,
  PublicClientApplication,
} from "@azure/msal-browser";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
// const TENANT_ID = process.env.REACT_APP_TENANT_ID;
const AUTHORITY = process.env.REACT_APP_AUTHORITY;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

/**
 * Config object to be passed to Msal on creation
 */
export const msalConfig = {
  auth: {
    clientId: CLIENT_ID,
    authority: AUTHORITY,
    redirectUri: REDIRECT_URI,
    postLogoutRedirectUri: REDIRECT_URI,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: false,
  },
};

/**
 *  Add here scopes for access token to be used at MS Identity Platform endpoints.
 */
export const apiRequest = {
  scopes: "",
  // scopes: [(import.meta.env.VITE_API_SCOPE as string) || ''],
};

/**
 * Initialize a PublicClientApplication instance which is provided to the MsalProvider component
 * We recommend initializing this outside of your root component to ensure it is not re-initialized on re-renders
 */
export const msalInstance = new PublicClientApplication(msalConfig);

// Account selection logic is app dependent. Adjust as needed for different use cases.
const accounts = msalInstance.getAllAccounts();
if (accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0]);
}

msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const payload = event.payload;
    const { account } = payload;
    msalInstance.setActiveAccount(account);
  }
});
