from operator import or_
from typing import Union
from uuid import UUID

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from requests import Session
from sqlalchemy import String
from db_connection import get_db
from sql_schemas import Competitions, EventTypes, Matches, Events, Person, Teams, PlayerPositions
from pydantic_schemas import CompetitionResponse, EventResponse, EventResponseWithPlayerPositions, MatchListResponse, MatchResponse, Team
from sqlalchemy.orm import aliased

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return ""

@app.get("/competitions", response_model=list[CompetitionResponse])
def get_match(db: Session = Depends(get_db)):
    competitions = db.query(Competitions).all()
    return competitions

@app.get("/matches/{match_id}", response_model=MatchResponse)
def get_match(match_id: int, db: Session = Depends(get_db)):
    match = db.query(Matches).filter(Matches.id == match_id).first()
    if match is None:
        raise HTTPException(status_code=404, detail="Match not found")
    return match

@app.get("/matches", response_model=list[MatchListResponse])
def list_matches(competition_id: int = 0, db: Session = Depends(get_db)):
    filter_condition = (
            Matches.competition_id == competition_id
        ) if competition_id != 0 else True

    HomeTeam = aliased(Teams, name="home_team")
    AwayTeam = aliased(Teams, name="away_team")
    matches = (
        db.query(
            Matches.id, 
            Matches.home_score,
            Matches.away_score,
            Matches.match_date,
            HomeTeam.name.label("home_team_name"), 
            AwayTeam.name.label("away_team_name")
        )
        .filter(filter_condition)
        .join(HomeTeam, Matches.home_team_id == HomeTeam.id)
        .join(AwayTeam, Matches.away_team_id == AwayTeam.id)
        .all()
    )
    return matches

@app.get("/match/events", response_model=list[EventResponse])
def list_events(match_id: int,db: Session = Depends(get_db)):
    return (
        db.query(
            Events.id, Events.type_id, Events.match_id, Events.x, Events.y,
            Events.end_x, Events.end_y, Events.player_id, Events.position_id,
            EventTypes.name.label("event_name"), Person.name.label("player_name")
        )
        .join(EventTypes, Events.type_id == EventTypes.id)
        .join(Person, Events.player_id == Person.id)
        .filter(Events.match_id == match_id)
        .all()
    )

@app.get("/teams", response_model=list[Team])
def list_matches( db: Session = Depends(get_db)):
    matches = (
        db.query(Teams).all()
    )
    return matches


@app.get("/event", response_model=EventResponseWithPlayerPositions)
def get_event(event_id: UUID, db: Session = Depends(get_db)):
    event = (db.query(
            Events.id, Events.type_id, Events.match_id, Events.x, Events.y,
            Events.end_x, Events.end_y, Events.player_id, Events.position_id,
            EventTypes.name.label("event_name"), Person.name.label("player_name")
        )
        .join(EventTypes, Events.type_id == EventTypes.id)
        .join(Person, Events.player_id == Person.id)
        .filter(Events.id == event_id)
        .first())
    playerPositions = (
        db.query(PlayerPositions.id, PlayerPositions.position_id, PlayerPositions.teammate,
                  PlayerPositions.x,PlayerPositions.y, PlayerPositions.player_id,
                  Person.name.label("player_name")).filter(PlayerPositions.event_id == event_id)
        .join(Person, PlayerPositions.player_id == Person.id).all()
    )
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    event_dict = event._asdict()
    event_dict['player_positions'] = playerPositions
    event_response = EventResponseWithPlayerPositions(**event_dict)
    return event_response

