const mongoose = require("mongoose");
const { loadStateFromDatabase, persistState } = require("../utils/persistence");

async function connectDatabase(uri) {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    const loaded = await loadStateFromDatabase();
    if (!loaded) {
      await persistState();
    }
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = { connectDatabase };
