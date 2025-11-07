-- JamLoop UI Engineer Challenge - Initial Database Schema
-- This migration creates all necessary tables, enums, RLS policies, and demo data

-- =============================================================================
-- 1. ENUMS
-- =============================================================================

-- Gender options for demographic targeting
CREATE TYPE gender AS ENUM ('any', 'male', 'female', 'nonbinary');

-- Screen/Device types for ad placement
CREATE TYPE screen AS ENUM ('CTV', 'Mobile Device', 'Web Browser');

-- Publisher/Inventory options
CREATE TYPE publisher AS ENUM (
  'Hulu',
  'Discovery',
  'ABC',
  'A&E',
  'TLC',
  'Fox News',
  'Fox Sports',
  'Etc'
);

-- =============================================================================
-- 2. TABLES
-- =============================================================================

-- Accounts table (represents different companies/tenants)
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User profiles (links Supabase auth users to accounts)
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Campaigns table (main business entity)
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  
  -- Campaign Details
  name TEXT NOT NULL,
  budget_usd NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (budget_usd >= 0),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Demographics
  age_min INTEGER NOT NULL CHECK (age_min >= 13 AND age_min <= 120),
  age_max INTEGER NOT NULL CHECK (age_max >= 13 AND age_max <= 120),
  gender gender NOT NULL DEFAULT 'any',
  
  -- Geographic Targeting
  country TEXT NOT NULL,
  state TEXT,
  city TEXT,
  zip TEXT,
  
  -- Inventory & Screens
  inventory publisher[] NOT NULL DEFAULT '{}',
  screens screen[] NOT NULL DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_date_range CHECK (start_date <= end_date),
  CONSTRAINT valid_age_range CHECK (age_min <= age_max),
  CONSTRAINT has_inventory CHECK (array_length(inventory, 1) > 0),
  CONSTRAINT has_screens CHECK (array_length(screens, 1) > 0)
);

-- =============================================================================
-- 3. INDEXES
-- =============================================================================

-- Performance indexes for common queries
CREATE INDEX idx_campaigns_account_id ON campaigns(account_id);
CREATE INDEX idx_campaigns_created_at ON campaigns(created_at DESC);
CREATE INDEX idx_campaigns_date_range ON campaigns(start_date, end_date);
CREATE INDEX idx_campaigns_name ON campaigns USING gin(to_tsvector('english', name));
CREATE INDEX idx_user_profiles_account_id ON user_profiles(account_id);

-- =============================================================================
-- 4. HELPER FUNCTIONS
-- =============================================================================

-- Function to get current user's account_id
CREATE OR REPLACE FUNCTION current_account_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT account_id
  FROM public.user_profiles
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger to auto-update updated_at on campaigns
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 5. ROW-LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
-- Users can only see their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Campaigns Policies
-- Users can only view campaigns belonging to their account
CREATE POLICY "Users can view own account campaigns"
  ON campaigns
  FOR SELECT
  USING (account_id = current_account_id());

-- Users can only insert campaigns for their account
CREATE POLICY "Users can insert own account campaigns"
  ON campaigns
  FOR INSERT
  WITH CHECK (account_id = current_account_id());

-- Users can only update campaigns belonging to their account
CREATE POLICY "Users can update own account campaigns"
  ON campaigns
  FOR UPDATE
  USING (account_id = current_account_id())
  WITH CHECK (account_id = current_account_id());

-- Users can only delete campaigns belonging to their account
CREATE POLICY "Users can delete own account campaigns"
  ON campaigns
  FOR DELETE
  USING (account_id = current_account_id());

-- Accounts Policies (read-only for users)
CREATE POLICY "Users can view own account"
  ON accounts
  FOR SELECT
  USING (id = current_account_id());

-- =============================================================================
-- 6. DEMO DATA
-- =============================================================================

-- Insert demo accounts
INSERT INTO accounts (id, name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Acme Corporation'),
  ('22222222-2222-2222-2222-222222222222', 'Globex Corporation')
ON CONFLICT DO NOTHING;

-- =============================================================================
-- 7. DEMO USER SETUP INSTRUCTIONS
-- =============================================================================

/*
  MANUAL SETUP REQUIRED:
  
  After running this migration, create users in Supabase Dashboard:
  
  1. Go to: Authentication → Users → Add User
  
  2. Create User A (Acme):
     - Email: acme.owner@example.com
     - Password: Passw0rd!
     - Confirm Email: Yes (or disable email confirmation)
     - Copy the generated User ID
  
  3. Create User B (Globex):
     - Email: globex.manager@example.com
     - Password: Passw0rd!
     - Confirm Email: Yes (or disable email confirmation)
     - Copy the generated User ID
  
  4. Link users to accounts by running this SQL (replace with actual user IDs):
  
     INSERT INTO public.user_profiles (user_id, account_id) VALUES
       ('<paste-acme-user-id-here>', '11111111-1111-1111-1111-111111111111'),
       ('<paste-globex-user-id-here>', '22222222-2222-2222-2222-222222222222')
     ON CONFLICT DO NOTHING;
  
  5. (Optional) Add sample campaigns:
  
     -- Acme campaign
     INSERT INTO campaigns (
       account_id, name, budget_usd, start_date, end_date,
       age_min, age_max, gender, country, state, city,
       inventory, screens
     ) VALUES (
       '11111111-1111-1111-1111-111111111111',
       'Summer Sale 2024',
       50000.00,
       '2024-06-01',
       '2024-08-31',
       25,
       54,
       'any',
       'US',
       'California',
       'Los Angeles',
       ARRAY['Hulu', 'ABC', 'Discovery']::publisher[],
       ARRAY['CTV', 'Web Browser']::screen[]
     );
     
     -- Globex campaign
     INSERT INTO campaigns (
       account_id, name, budget_usd, start_date, end_date,
       age_min, age_max, gender, country, state, city,
       inventory, screens
     ) VALUES (
       '22222222-2222-2222-2222-222222222222',
       'Q4 Brand Awareness',
       75000.00,
       '2024-10-01',
       '2024-12-31',
       18,
       65,
       'any',
       'US',
       'New York',
       'New York',
       ARRAY['Fox News', 'Fox Sports', 'TLC']::publisher[],
       ARRAY['CTV', 'Mobile Device']::screen[]
     );
*/

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================

-- Verify setup
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully!';
  RAISE NOTICE 'Tables created: accounts, user_profiles, campaigns';
  RAISE NOTICE 'Enums created: gender, screen, publisher';
  RAISE NOTICE 'RLS policies enabled and configured';
  RAISE NOTICE 'Demo accounts created';
  RAISE NOTICE '';
  RAISE NOTICE 'NEXT STEPS:';
  RAISE NOTICE '1. Create demo users in Supabase Dashboard';
  RAISE NOTICE '2. Link users to accounts using the SQL in comments above';
  RAISE NOTICE '3. (Optional) Add sample campaigns';
END $$;

