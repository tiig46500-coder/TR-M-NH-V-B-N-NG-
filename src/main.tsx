import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { UserProvider } from './context/UserContext.tsx';
import './index.css';

// 1. Storage isolation patch for USER_ID namespacing
(() => {
  const originalGetItem = Storage.prototype.getItem;
  const originalSetItem = Storage.prototype.setItem;
  const originalRemoveItem = Storage.prototype.removeItem;

  // Initialize USER_ID if not already present
  let userId = originalGetItem.call(localStorage, "USER_ID");
  if (!userId) {
    userId = "user_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    originalSetItem.call(localStorage, "USER_ID", userId);
  }

  Storage.prototype.getItem = function (key: string) {
    if (key === "USER_ID") {
      return originalGetItem.call(this, key);
    }
    if (key.includes("corez") || key.includes("remix_corez")) {
      const activeUserId = originalGetItem.call(this, "USER_ID") || userId;
      return originalGetItem.call(this, `${key}_${activeUserId}`);
    }
    return originalGetItem.call(this, key);
  };

  Storage.prototype.setItem = function (key: string, value: string) {
    if (key === "USER_ID") {
      originalSetItem.call(this, key, value);
      return;
    }
    if (key.includes("corez") || key.includes("remix_corez")) {
      const activeUserId = originalGetItem.call(this, "USER_ID") || userId;
      originalSetItem.call(this, `${key}_${activeUserId}`, value);
      return;
    }
    originalSetItem.call(this, key, value);
  };

  Storage.prototype.removeItem = function (key: string) {
    if (key === "USER_ID") {
      originalRemoveItem.call(this, key);
      return;
    }
    if (key.includes("corez") || key.includes("remix_corez")) {
      const activeUserId = originalGetItem.call(this, "USER_ID") || userId;
      originalRemoveItem.call(this, `${key}_${activeUserId}`);
      return;
    }
    originalRemoveItem.call(this, key);
  };
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>,
);
