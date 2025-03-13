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
    referee_id = Column(Integer)
    stadium_id = Column(Integer)


class Seasons(Base):
    __tablename__ = "seasons"
    id = Column(Integer, primary_key=True)
    name = Column(String)

class Teams(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    country_id = Column(Integer)

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


class EventTypes(Base):
    __tablename__ = "event_types"
    id = Column(Integer, primary_key=True)
    name = Column(String)





