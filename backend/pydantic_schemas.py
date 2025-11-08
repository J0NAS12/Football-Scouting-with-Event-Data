from datetime import date, time
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel

class MatchCreate(BaseModel):
    id: int
    match_date: date
    home_score: int
    away_score: int
#    referee: Optional[str]
#    stadium: Optional[str]

class EnumResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True
    

class MatchResponse(MatchCreate):
    class Config:
        from_attributes = True

class MatchListResponse(MatchCreate):
    home_team_name: str
    away_team_name: str
    class Config:
        from_attributes = True


class Team(BaseModel):
    name: str
    class Config:
        from_attributes = True

class PassResponse(BaseModel):
    recipient_id: int
    pass_length: float
    pass_angle: float
    pass_height: str
    pass_deflected: bool
    switch: bool
    cross: bool
    through_ball: bool
    assisted_shot_id: Optional[UUID]
    assisted_goal: bool
    class Config:
        from_attributes = True

class ShotResponse(BaseModel):
    statsbomb_xg: float
    first_time: bool
    technique_id: int
    key_pass_id: UUID
    one_on_one: bool
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
    teammate: int
    x: float
    y: float
    player_id: Optional[int]
    player_name: Optional[str]
    position_id: Optional[int]
    #position_name: str

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
    position_id: Optional[int]
    event_outcome: Optional[str] = None
    outcome_id: Optional[int] = None
    player_name: str
    event_name: str
    period: Optional[int]
    timestamp: Optional[time]
    duration: float
    team_id: int
    team_name: str
    sub_type_id: int
    sub_type_name: Optional[str]
    class Config:
        from_attributes = True

class EventResponseWithPlayerPositions(EventResponse):
    player_positions: list[PlayerPositionResponse]
    #_pass: Optional[PassResponse]
    #_shot: Optional[ShotResponse]


class PossessionsResponse(BaseModel):
    possession: int
    passes: Optional[int]
    carry: int
    dribble: int
    shot: int
    duel: int
    pressure: int
    block: int
    ball_recovery: int
    interception: int
    clearance: int
    avg_pass_length: float
    possession_team_name: str
    pass_success_rate: float
    playing_style: str
    class Config:
        from_attributes = True


class PossessionsResponseWithEvents(PossessionsResponse):
    events: list[EventResponse]


class BucketInfo(BaseModel):
    bucket: int
    start: float
    end: float
    count: int

class PlayerStatBuckets(BaseModel):
    player_id: int
    stat_name: str
    player_bucket: int
    buckets: List[BucketInfo]