CREATE TABLE matches
(
    id INTEGER PRIMARY KEY,
    match_date Date,
    home_team_id INTEGER,
    home_score INTEGER,
    home_manager_id INTEGER,
    away_team_id INTEGER,
    away_score INTEGER,
    away_manager_id INTEGER,
    match_week INTEGER,
    competition_id INTEGER,
    season_id INTEGER,
    referee_id INTEGER,
    stadium_id INTEGER
);

CREATE TABLE competitions
(
    competition_id INTEGER,
    season_id INTEGER,
    competition_name VARCHAR(255),
    country_name VARCHAR(255),
    competition_gender VARCHAR(255),
    competition_youth VARCHAR(255),
    competition_international VARCHAR(255),
    season_name VARCHAR(255),
    PRIMARY KEY (competition_id, season_id)
);

CREATE TABLE teams
(
    id INTEGER PRIMARY KEY,
    country_id INTEGER,
    name VARCHAR(255)
);

CREATE TABLE person
(
    id INTEGER PRIMARY KEY,
    name VARCHAR(255),
    country_id INTEGER
);

CREATE TABLE events
(
    id UUID PRIMARY KEY,
    x FLOAT,
    y FLOAT,
    type_id INTEGER,
    match_id BIGINT,
    player_id INTEGER,
    position_id INTEGER,
    end_x FLOAT,
    end_y FLOAT,
    timestamp TIME,
    period INTEGER,
    duration FLOAT,
    team_id INTEGER,
    play_pattern_id INTEGER,
    possession_team_id INTEGER,
    sub_type_id INTEGER,
    outcome_id INTEGER

);

CREATE TABLE event_types
(
    id INTEGER PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE passes
(
    id UUID PRIMARY KEY,
    recipient_id INTEGER,
    pass_length FLOAT,
    pass_angle FLOAT,
    height_id INTEGER,
    end_x FLOAT,
    end_y FLOAT,
    assisted_shot_id UUID
);

CREATE TABLE shots
(
    id INTEGER PRIMARY KEY,
    statsbomb_xg FLOAT,
    first_time BOOLEAN,
    technique_id INTEGER,
    key_pass_id INTEGER,
    one_on_one BOOLEAN
);


CREATE TABLE player_positions
(
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    teammate BOOLEAN,
    x FLOAT,
    y FLOAT,
    match_id INTEGER,
    event_id UUID,
    player_id INTEGER,
    position_id INTEGER
);

CREATE TABLE play_patterns
(
    id INTEGER PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE event_sub_types
(
    id INTEGER PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE outcomes
(
    id INTEGER PRIMARY KEY,
    name VARCHAR(255)
);


CREATE TABLE positions
(
    id INTEGER PRIMARY KEY,
    name VARCHAR(255)
);


