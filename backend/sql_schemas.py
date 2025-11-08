from sqlalchemy import UUID, Column, Date, Integer, String, Boolean, Float, Time
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Competitions(Base):
    __tablename__ = "competitions"
    competition_id = Column(Integer, primary_key=True)
    season_id = Column(Integer, primary_key=True)
    country_name = Column(String)
    competition_name=Column(String)
    competition_gender=Column(String)
    competition_youth=Column(String)
    competition_international= Column(String)
    season_name= Column(String)

class Matches(Base):
    __tablename__ = "matches"
    id = Column(Integer, primary_key=True)
    match_date = Column(Date)
    home_score = Column(Integer)
    home_team_id = Column(Integer)
    home_manager_id = Column(Integer)
    away_team_id = Column(Integer)
    away_score = Column(Integer)
    away_manager_id = Column(Integer)
    match_week = Column(Integer)
    competition_id = Column(Integer)
    season_id = Column(Integer)
    referee = Column(String)
    stadium = Column(String)


class Seasons(Base):
    __tablename__ = "seasons"
    id = Column(Integer, primary_key=True)
    name = Column(String)

class Teams(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    country = Column(String)

class Person(Base):
    __tablename__ = "person"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    country_id = Column(Integer)


class MatchesView(Base):
    __tablename__ = "matches_view"
    id = Column(Integer, primary_key=True)
    match_date = Column(String)
    home_score = Column(Integer)
    home_manager = Column(String)
    away_score = Column(Integer)
    away_manager_id = Column(Integer)
    match_week = Column(Integer)
    competition_id = Column(Integer)
    season_id = Column(Integer)
    referee_id = Column(Integer)
    stadium_id = Column(Integer)

class PlayerPositions(Base):
    __tablename__ = "player_positions"
    id = Column(Integer, primary_key=True, autoincrement=True)
    event_id = Column(UUID)
    match_id = Column(Integer)
    teammate = Column(Boolean)
    x = Column(Float)
    y = Column(Float)
    player_id = Column(Integer)
    position_id = Column(Integer)


class Events(Base):
    __tablename__ = "events"
    id = Column(UUID, primary_key=True)
    type_id = Column(Integer)
    match_id = Column(Integer)
    x = Column(Float)
    y = Column(Float)
    end_x = Column(Float)
    end_y = Column(Float)
    player_id = Column(Integer)
    position_id = Column(Integer)
    period = Column(Integer)
    timestamp = Column(Time)
    duration = Column(Float)
    team_id = Column(Integer)
    play_pattern_id = Column(Integer)
    possession_team_id = Column(Integer)
    sub_type_id = Column(Integer)
    outcome_id = Column(Integer)
    possession = Column(Integer)


class EventTypes(Base):
    __tablename__ = "event_types"
    id = Column(Integer, primary_key=True)
    name = Column(String)

class EventSubTypes(Base):
    __tablename__ = "event_sub_types"
    id = Column(Integer, primary_key=True)
    name = Column(String)

class EventOutcomes(Base):
    __tablename__ = "outcomes"
    id = Column(Integer, primary_key=True)
    name = Column(String)

class Positions(Base):
    __tablename__ = "positions"  
    id = Column(Integer, primary_key=True)
    name = Column(String)

class PlayPatterns(Base):
    __tablename__ = "play_patterns"  
    id = Column(Integer, primary_key=True)
    name = Column(String)

class Techniques(Base):
    __tablename__ = "techniques"  
    id = Column(Integer, primary_key=True)
    name = Column(String)


class Passes(Base):
    __tablename__ = "passes"  
    id = Column(UUID, primary_key=True)
    recipient_id = Column(Integer)
    pass_length = Column(Float)
    pass_angle = Column(Float)
    pass_height = Column(String)
    assisted_shot_id = Column(UUID)


class Shots(Base):
    __tablename__ = "shots"  
    id = Column(UUID, primary_key=True)
    technique_id = Column(Integer)
    statsbomb_xg = Column(Float)
    first_time = Column(Float)
    key_pass_id = Column(UUID)
    one_on_one = Column(Boolean)


class Possessions(Base):
    __tablename__ = "possessions"  
    match_id = Column(Integer, primary_key=True)
    possession = Column(Integer, primary_key=True)
    passes = Column(Integer)
    carry = Column(Integer)
    dribble = Column(Integer)
    shot = Column(Integer)
    duel = Column(Integer)
    pressure = Column(Integer)
    block = Column(Integer)
    ball_recovery = Column(Integer)
    interception = Column(Integer)
    clearance  = Column(Integer)
    avg_pass_length  = Column(Float)
    pass_success_rate  = Column(Float)
    possession_team_name = Column(String)
    playing_style = Column(String)

class PlayingTimes(Base):
    __tablename__ = "playing_times"
    id = Column(Integer, primary_key=True, autoincrement=True)
    match_id = Column(Integer)
    player_id = Column(Integer)
    player_name = Column(String)
    start_period = Column(Integer)
    start_time = Column(Time)
    end_period = Column(Integer)
    end_time = Column(Time)
    minutes = Column(Integer)



class PlayerStats(Base):
    __tablename__ = "player_stats"
    id = Column(Integer, primary_key=True)
    minutes = Column(Integer)
    pass_90 = Column(Float)
    carry_90 = Column(Float)
    dribble_90 = Column(Float)
    shot_90 = Column(Float)
    duel_90 = Column(Float)
    pressure_90 = Column(Float)
    block_90 = Column(Float)
    ball_recovery_90 = Column(Float)
    interception_90 = Column(Float)
    clearance_90 = Column(Float)
    foul_won_90 = Column(Float)
    foul_commited_90 = Column(Float)
    avg_pass_length = Column(Float)
    longest_forward_pass = Column(Float)
    average_shot_length = Column(Float)
    header_percent = Column(Float)
    xg_90 = Column(Float)
    dribble_percent = Column(Float)
    average_dribble_start_x = Column(Float)
    ground_pass_percent = Column(Float)
    low_pass_percent = Column(Float)
    high_pass_percent = Column(Float)
    goalkeeper = Column(Float)
    center_back = Column(Float)
    wide_back = Column(Float)
    center_midfielder = Column(Float)
    wide_midfielder = Column(Float)
    striker = Column(Float)
    defensive_start_percent = Column(Float)
    middle_start_percent = Column(Float)
    attacking_start_percent = Column(Float)
    cluster = Column(String)