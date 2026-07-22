require('dotenv').config();

const dataMode = (process.env.DATA_MODE || 'dummy').toLowerCase().trim();

module.exports = {
    getDataMode: () => dataMode,
    isDummyMode: () => dataMode === 'dummy',
    isSupabaseMode: () => dataMode === 'supabase'
};
