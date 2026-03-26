const { createId, state } = require("../data/store");

function logAdminRequest({ actorId = "guest", actorName = "Guest", action, resource, details = {} }) {
  state.adminRequests.unshift({
    id: createId("request"),
    actorId,
    actorName,
    action,
    resource,
    details,
    createdAt: new Date().toISOString(),
  });
}

module.exports = { logAdminRequest };
