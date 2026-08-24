-- ==============================================================================
-- DARK LIVE CHAT DATABASE SCHEMA (SQLite)
-- ==============================================================================

-- Sessions Table: Stores each visitor's unique live chat session
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    guest_name TEXT NOT NULL,
    ip_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active' -- 'active', 'closed'
);

-- Messages Table: Stores all chat history (visitor and support messages)
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    sender TEXT NOT NULL, -- 'user' or 'support'
    content TEXT NOT NULL,
    discord_msg_id TEXT, -- stores the Discord message ID when relayed
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

-- Discord Message Mappings: Maps Discord Message IDs to Session IDs for fast lookups on Reply
CREATE TABLE IF NOT EXISTS discord_mappings (
    discord_msg_id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

-- Indices for rapid query lookups
CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_discord_map_session ON discord_mappings(session_id);
