import { createRef } from "react";

/**
 * A React ref attached to the NavigationContainer.
 * Allows navigation calls from outside the React component tree
 * (e.g. notification listeners).
 */
const navigationRef = createRef();

/**
 * Holds notification data that arrived before the authenticated
 * screens were mounted. Consumed once the app is fully ready.
 */
let _pendingNotification = null;

export function setPendingNotification(data) {
    _pendingNotification = data;
}

export function consumePendingNotification() {
    const data = _pendingNotification;
    _pendingNotification = null;
    return data;
}

export default navigationRef;
