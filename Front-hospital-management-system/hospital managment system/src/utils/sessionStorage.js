// Centralized Session & Storage utility for HMS Frontend
// Manages multi-tab session persistence and primary tab lifecycle.
// If the primary login tab is closed, secondary tabs detect closure,
// clear session data, and redirect to /login.

import { useState, useEffect } from 'react';

const SESSION_EVENT_NAME = 'hms_session_update';
const BROADCAST_CHANNEL_NAME = 'hms_tab_channel';

// Unique ID for each tab
const currentTabId =
  typeof window !== 'undefined'
    ? sessionStorage.getItem('hms_tab_id') ||
      `tab_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    : '';

if (typeof window !== 'undefined' && currentTabId) {
  sessionStorage.setItem('hms_tab_id', currentTabId);
}

let bc = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  } catch (e) {
    console.warn('BroadcastChannel not supported or error:', e);
  }
}

// Notify subscribers in the current tab
const notifySessionListeners = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SESSION_EVENT_NAME));
  }
};

export const getSessionItem = (key) => {
  if (typeof window === 'undefined') return null;
  const val = sessionStorage.getItem(key) || localStorage.getItem(key);
  if (val !== null && !sessionStorage.getItem(key)) {
    try {
      sessionStorage.setItem(key, val);
    } catch {}
  }
  return val;
};

export const setSessionItem = (key, value) => {
  if (typeof window === 'undefined') return;
  if (value !== undefined && value !== null) {
    const strVal = String(value);
    sessionStorage.setItem(key, strVal);
    localStorage.setItem(key, strVal);

    // When setting the auth token on login, designate this tab as the primary login tab
    if (key === 'token') {
      sessionStorage.setItem('is_primary_tab', 'true');
      localStorage.setItem('primary_tab_id', currentTabId);
      localStorage.setItem('hms_primary_heartbeat', String(Date.now()));
      if (bc) {
        try {
          bc.postMessage({ type: 'PRIMARY_TAB_ALIVE', tabId: currentTabId });
        } catch {}
      }
    }

    notifySessionListeners();
  }
};

export const removeSessionItem = (key) => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(key);
  localStorage.removeItem(key);
  if (key === 'token') {
    sessionStorage.removeItem('is_primary_tab');
  }
  notifySessionListeners();
};

export const clearSession = () => {
  if (typeof window === 'undefined') return;
  sessionStorage.clear();
  localStorage.clear();
  if (bc) {
    try {
      bc.postMessage({ type: 'LOGOUT' });
    } catch {}
  }
  notifySessionListeners();
};

// React hook to monitor active session state in layouts/components
export function useSessionGuard() {
  const [token, setToken] = useState(() => getSessionItem('token'));

  useEffect(() => {
    const handleUpdate = () => {
      setToken(getSessionItem('token'));
    };

    window.addEventListener(SESSION_EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(SESSION_EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return token;
}

// Background tab lifecycle management
if (typeof window !== 'undefined') {
  let primaryTabCloseTimer = null;

  const handleMessage = (data) => {
    if (!data || !data.type) return;

    if (data.type === 'LOGOUT') {
      sessionStorage.clear();
      localStorage.clear();
      notifySessionListeners();
    } else if (data.type === 'PRIMARY_TAB_CLOSING') {
      const isPrimary = sessionStorage.getItem('is_primary_tab') === 'true';
      if (!isPrimary) {
        if (primaryTabCloseTimer) clearTimeout(primaryTabCloseTimer);
        // Wait 1.2s to distinguish between F5 refresh and actual tab closure
        primaryTabCloseTimer = setTimeout(() => {
          clearSession();
        }, 1200);
      }
    } else if (data.type === 'PRIMARY_TAB_ALIVE') {
      if (primaryTabCloseTimer) {
        clearTimeout(primaryTabCloseTimer);
        primaryTabCloseTimer = null;
      }
    } else if (data.type === 'WHO_IS_PRIMARY') {
      const isPrimary = sessionStorage.getItem('is_primary_tab') === 'true';
      if (isPrimary && getSessionItem('token')) {
        if (bc) {
          try {
            bc.postMessage({ type: 'PRIMARY_TAB_ALIVE', tabId: currentTabId });
          } catch {}
        }
      }
    }
  };

  if (bc) {
    bc.onmessage = (event) => handleMessage(event.data);
  }

  // Fallback via storage events
  window.addEventListener('storage', (event) => {
    if (event.key === null || (event.key === 'token' && !event.newValue)) {
      sessionStorage.clear();
      notifySessionListeners();
    } else if (event.key === 'hms_primary_closing') {
      const isPrimary = sessionStorage.getItem('is_primary_tab') === 'true';
      if (!isPrimary) {
        if (primaryTabCloseTimer) clearTimeout(primaryTabCloseTimer);
        primaryTabCloseTimer = setTimeout(() => {
          clearSession();
        }, 1200);
      }
    } else if (event.key === 'hms_primary_alive') {
      if (primaryTabCloseTimer) {
        clearTimeout(primaryTabCloseTimer);
        primaryTabCloseTimer = null;
      }
    }
  });

  // Check initial state on page load
  const token = getSessionItem('token');
  if (token) {
    const isReloading = sessionStorage.getItem('is_reloading') === 'true';
    sessionStorage.removeItem('is_reloading');

    const wasPrimary = sessionStorage.getItem('is_primary_tab') === 'true';
    const primaryTabId = localStorage.getItem('primary_tab_id');

    if (wasPrimary || isReloading || primaryTabId === currentTabId) {
      sessionStorage.setItem('is_primary_tab', 'true');
      localStorage.setItem('primary_tab_id', currentTabId);
      localStorage.setItem('hms_primary_heartbeat', String(Date.now()));
      if (bc) {
        try {
          bc.postMessage({ type: 'PRIMARY_TAB_ALIVE', tabId: currentTabId });
        } catch {}
      }
    } else {
      // Secondary tab - request primary status check
      if (bc) {
        try {
          bc.postMessage({ type: 'WHO_IS_PRIMARY' });
        } catch {}
      }
    }
  }

  // Periodic heartbeat: Primary tab updates timestamp; secondary tabs check primary freshness
  setInterval(() => {
    const isPrimary = sessionStorage.getItem('is_primary_tab') === 'true';
    const activeToken = getSessionItem('token');

    if (!activeToken) return;

    if (isPrimary) {
      localStorage.setItem('hms_primary_heartbeat', String(Date.now()));
    } else {
      const lastHb = parseInt(localStorage.getItem('hms_primary_heartbeat') || '0', 10);
      // If primary tab has been dead for > 7 seconds, terminate session
      if (lastHb > 0 && Date.now() - lastHb > 7000) {
        clearSession();
      }
    }
  }, 3000);

  // Tab unload handler
  window.addEventListener('beforeunload', () => {
    const isPrimary = sessionStorage.getItem('is_primary_tab') === 'true';
    if (isPrimary) {
      sessionStorage.setItem('is_reloading', 'true');
      if (bc) {
        try {
          bc.postMessage({ type: 'PRIMARY_TAB_CLOSING', tabId: currentTabId });
        } catch {}
      }
      localStorage.setItem('hms_primary_closing', String(Date.now()));
    }
  });
}
