from datetime import date
from typing import Optional
from uuid import UUID
from pydantic import BaseModel

class MatchCreate(BaseModel):
    id: int
    match_date: date
    home_score: int
    away_score: int
    

class MatchResponse(MatchCreate):
    class Config:
        from_attributes = True

class MatchListResponse(MatchCreate):
    home_team_name: str
    away_team_name: str
    class Config:
        from_attributes = True


class Team(BaseModel):
    id: int
    name: str
    class Config:
        from_attributes = True

class CompetitionResponse(BaseModel):
    competition_id: int
    season_id: int
    country_name: str
    competition_name: str
    competition_gender: str
    competition_youth: str
    competition_international: str
    season_name: str
    class Config:
        from_attributes = True

class PlayerPositionResponse(BaseModel):
    event_id: UUID
    teammate: int
    x: float
    y: float
    player_id: int
    player_name: Optional[str] = None
    position_id: int
    position_name: Optional[str] = None

    class Config:
        from_attributes = True
    
class EventResponse(BaseModel):
    id: UUID
    type_id : int
    match_id: int
    x: float
    y: float
    end_x: float
    end_y: float
    player_id: int
    position_id: int
    event_name: str
    #player_positions: list[PlayerPositionResponse]
    class Config:
        from_attributes = True

class EventResponseWithPlayerPositions(EventResponse):
    player_positions: list[PlayerPositionResponse]