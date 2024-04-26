CREATE TABLE subsidiaries (
    subsidiary_id INTEGER PRIMARY KEY AUTOINCREMENT,
    subsidiary_name TEXT NOT NULL
);


INSERT INTO subsidiaries (subsidiary_name) VALUES
('NorthStar Solutions'),
('EcoTech Ventures'),
('Quantum Dynamics'),
('Fusion Networks'),
('Orbit Enterprises');


CREATE TABLE campaigns (
    campaign_id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget REAL NOT NULL,
    impressions INTEGER NOT NULL,
    clicks INTEGER NOT NULL,
    conversions INTEGER NOT NULL,
    conversion_rate REAL NOT NULL,
    revenue REAL NOT NULL,
    roi REAL NOT NULL,
    subsidiary_id INTEGER,
    FOREIGN KEY (subsidiary_id) REFERENCES subsidiaries(subsidiary_id)
);

