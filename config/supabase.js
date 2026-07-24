require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const rawUrl = process.env.SUPABASE_URL;
const supabaseUrl = (rawUrl && rawUrl.match(/^https?:\/\//i))
  ? rawUrl
  : 'https://placeholder.supabase.co';

const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY.includes('placeholder'))
  ? process.env.SUPABASE_SERVICE_ROLE_KEY
  : supabaseAnonKey;

// Client instance for public / user authenticated operations
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin instance with elevated permissions (strictly server-side)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

module.exports = {
  supabase,
  supabaseAdmin
};
