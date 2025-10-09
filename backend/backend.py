import dataclasses
from sqlalchemy import and_, func, or_
from typing import Union
from uuid import UUID

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from requests import Session
from sqlalchemy import String
from db_connection import get_db
from sql_schemas import Competitions, EventOutcomes, EventSubTypes, EventTypes, Matches, Events, Person, Possessions, Teams, PlayerPositions, Positions, PlayingTimes
from pydantic_schemas import CompetitionResponse, EventResponse, EventResponseWithPlayerPositions, MatchListResponse, MatchResponse, PossessionsResponse, PossessionsResponseWithEvents, Team
from sqlalchemy.orm import aliased

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/competitions", response_model=list[CompetitionResponse])
def get_all_competitions(db: Session = Depends(get_db)):
    competitions = db.query(Competitions).all()
    return competitions

@app.get("/matches/{match_id}", response_model=MatchResponse)
def get_match(match_id: int, db: Session = Depends(get_db)):
    match = db.query(Matches).filter(Matches.id == match_id).first()
    if match is None:
        raise HTTPException(status_code=404, detail="Match not found")
    return match

@app.get("/matches", response_model=list[MatchListResponse])
def list_matches_in_a_competition(competition_id: int = 0,season_id: int = 0, db: Session = Depends(get_db)):
    filter_condition = (
            and_(
                (Matches.competition_id == competition_id) if competition_id != 0 else True
                (Matches.season_id == season_id) if season_id != 0 else True
            )
    )

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
def list_events_of_a_match(match_id: int,db: Session = Depends(get_db)):
    PossessionTeam = aliased(Teams, name="possession_team")
    return (
        db.query(
            Events.id,
            Events.type_id,
            Events.match_id,
            Events.x,
            Events.y,
            Events.end_x,
            Events.end_y,
            Events.player_id,
            Events.position_id,
            Events.duration,
            Events.team_id,
            Events.outcome_id,
            Events.timestamp,
            Events.period,
            Events.sub_type_id,
            EventTypes.name.label("event_name"),
            Person.name.label("player_name"),
            EventSubTypes.name.label("sub_type_name"),
            Teams.name.label("team_name"),
            Positions.name.label("position"),
            PossessionTeam.name.label("possession_team_name"),
            EventOutcomes.name.label('event_outcome')
        )
        .join(EventTypes, Events.type_id == EventTypes.id)
        .join(Person, Events.player_id == Person.id)
        .outerjoin(EventSubTypes, Events.sub_type_id == EventSubTypes.id)
        .join(Teams, Events.team_id == Teams.id)
        .outerjoin(PossessionTeam, Events.team_id == PossessionTeam.id)
        .outerjoin(Positions, Events.position_id == Positions.id)
        .outerjoin(EventOutcomes, Events.outcome_id == EventOutcomes.id)
        .filter(Events.match_id == match_id)
        .all()
    )


@app.get("/match/stats", response_model=list)
def event_summary_by_team(match_id: int, db: Session = Depends(get_db)):

    event_counts = (
        db.query(
            Events.team_id,
            Teams.name.label("team_name"),
            func.count().filter(EventTypes.name == 'Pass').label('total_passes'),
            func.count().filter(EventTypes.name == 'Shot').label('total_shots'),
            func.count().filter(EventOutcomes.name == 'Goal').label('total_goals'),
            func.count().filter(EventSubTypes.name == "Corner").label('corners')
    
        )
        .join(EventTypes, Events.type_id == EventTypes.id)
        .outerjoin(EventSubTypes, Events.sub_type_id == EventSubTypes.id)
        .join(Teams, Events.team_id == Teams.id)
        .join(EventOutcomes, Events.outcome_id == EventOutcomes.id)
        .filter(Events.match_id == match_id)
        .group_by(Events.team_id, Teams.name)
        .all()
    )
    event_counts_list = [
    {
        'team_id': row.team_id,
        'team_name': row.team_name,
        'total_passes': row.total_passes,
        'total_shots': row.total_shots,
        'total_goals': row.total_goals,
        'corners': row.corners
    }
    for row in event_counts
    ]
    return event_counts_list

@app.get("/match/playerstats", response_model=list)
def match_summary_by_player(match_id: int, db: Session = Depends(get_db)):
    filter_successful_pass = and_(
        EventTypes.name == 'Pass',
        EventOutcomes.name == None
    )
    event_counts = (
        db.query(
            Events.team_id,
            Teams.name.label("team_name"),
            Events.player_id,
            Person.name.label("player_name"),
            Possessions.playing_style,
            func.count().filter(EventTypes.name == 'Pass').label('total_passes'),
            func.count().filter(filter_successful_pass).label('successful_passes'),
            func.count().filter(EventTypes.name == 'Shot').label('total_shots'),
            func.count().filter(EventOutcomes.name == 'Goal').label('total_goals'),
            func.count().filter(EventSubTypes.name == "Corner").label('corners')
        )
        .join(EventTypes, Events.type_id == EventTypes.id)
        .outerjoin(EventSubTypes, Events.sub_type_id == EventSubTypes.id)
        .join(Teams, Events.team_id == Teams.id)
        .join(Person, Events.player_id == Person.id)
        .join(Possessions, and_(
            Events.match_id == Possessions.match_id,
            Events.possession == Possessions.possession
        ))
        .outerjoin(EventOutcomes, Events.outcome_id == EventOutcomes.id)
        .filter(Events.match_id == match_id)
        .group_by(Events.team_id, Teams.name, Events.player_id, Person.name, Possessions.playing_style)
        .all()
    )
    event_counts_list = []
    
    for row in event_counts:
        total_passes = row.total_passes or 0
        successful_passes = row.successful_passes or 0
        pass_accuracy = (successful_passes / total_passes) if total_passes > 0 else None
        event_counts_list.append({
                'team_id': row.team_id,
                'team_name': row.team_name,
                'playing_style': row.playing_style,
                'player_name': row.player_name,
                'total_passes': row.total_passes,
                'pass_accuracy': round(pass_accuracy*100, 2) if pass_accuracy is not None else None,
                'total_shots': row.total_shots,
                'total_goals': row.total_goals,
                'corners': row.corners
            })
    return event_counts_list

@app.get("/teams", response_model=list[Team])
def list_matches_in_a_competition( db: Session = Depends(get_db)):
    matches = (
        db.query(Teams).all()
    )
    return matches

@app.get("/event", response_model=EventResponseWithPlayerPositions)
def get_event(event_id: UUID, db: Session = Depends(get_db)):
    PossessionTeam = aliased(Teams, name="possession_team")
    event = (db.query(
            Events.id,
            Events.type_id,
            Events.match_id,
            Events.x,
            Events.y,
            Events.end_x,
            Events.end_y,
            Events.player_id,
            Events.position_id,
            Events.duration,
            Events.team_id,
            Events.timestamp,
            Events.period,
            Events.sub_type_id,
            EventTypes.name.label("event_name"),
            Person.name.label("player_name"),
            EventSubTypes.name.label("sub_type_name"),
            Teams.name.label("team_name"),
            PossessionTeam.name.label("possession_team_name")
        )
        .join(EventTypes, Events.type_id == EventTypes.id)
        .join(Person, Events.player_id == Person.id)
        .outerjoin(EventSubTypes, Events.sub_type_id == EventSubTypes.id)
        .join(Teams, Events.team_id == Teams.id)
        .outerjoin(PossessionTeam, Events.team_id == PossessionTeam.id)
        .filter(Events.id == event_id)
        .first())
    playerPositions = (
        db.query(PlayerPositions.id, PlayerPositions.position_id, PlayerPositions.teammate,
                  PlayerPositions.x,PlayerPositions.y, PlayerPositions.player_id,
                  Person.name.label("player_name")
                  )
        .filter(PlayerPositions.event_id == event_id)
        .outerjoin(Person, PlayerPositions.player_id == Person.id).all()
    )
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    event_dict = event._asdict()
    event_dict['player_positions'] = playerPositions
    event_response = EventResponseWithPlayerPositions(**event_dict)
    return event_response

@app.get("/match/possessions", response_model=list[PossessionsResponse])
def get_all_possessions_of_a_match(match_id: int, db: Session = Depends(get_db)):
    possessions = (db.query(Possessions)
        .filter(Possessions.match_id == match_id)
        .all()
    )
    return possessions

@app.get("/match/possession", response_model=PossessionsResponseWithEvents)
def get_possession_style_with_events(match_id: int, possession: int, db: Session = Depends(get_db)):
    PossessionTeam = aliased(Teams, name="possession_team")
    events = (
        db.query(
            Events.id,
            Events.type_id,
            Events.match_id,
            Events.x,
            Events.y,
            Events.end_x,
            Events.end_y,
            Events.player_id,
            Events.position_id,
            Events.duration,
            Events.team_id,
            Events.timestamp,
            Events.period,
            Events.sub_type_id,
            EventTypes.name.label("event_name"),
            Person.name.label("player_name"),
            EventSubTypes.name.label("sub_type_name"),
            Teams.name.label("team_name"),
            PossessionTeam.name.label("possession_team_name"),
        )
        .join(EventTypes, Events.type_id == EventTypes.id)
        .join(Person, Events.player_id == Person.id)
        .outerjoin(EventSubTypes, Events.sub_type_id == EventSubTypes.id)
        .join(Teams, Events.team_id == Teams.id)
        .join(PossessionTeam, Events.team_id == PossessionTeam.id)
        .filter(Events.match_id == match_id)
        .filter(Events.possession == possession)
        .all()
    )
    possession = (db.query(Possessions)
        .filter(Possessions.match_id == match_id)
        .filter(Possessions.possession == possession)
        .first()
    )
    if possession is None:
        raise HTTPException(status_code=404, detail="Possession not found")
    possession_dict = possession.__dict__
    possession_dict['events'] = events
    possession_response = PossessionsResponseWithEvents(**possession_dict)
    return possession_response

@app.get("/playerstats", response_model=list)
def event_summary_by_player(db: Session = Depends(get_db)):
    filter_successful_pass = and_(
        EventTypes.name == 'Pass',
        EventOutcomes.name == None
    )
    event_counts = (
        db.query(
            Events.team_id,
            Teams.name.label("team_name"),
            Events.player_id,
            Person.name.label("player_name"),
            Possessions.playing_style,
            func.count().filter(EventTypes.name == 'Pass').label('total_passes'),
            func.count().filter(filter_successful_pass).label('successful_passes'),
            func.count().filter(EventTypes.name == 'Shot').label('total_shots'),
            func.count().filter(EventOutcomes.name == 'Goal').label('total_goals'),
            func.count().filter(EventSubTypes.name == "Corner").label('corners'),
            func.count(func.distinct(Events.match_id)).label('matches'),
            func.count().label('actions')
        )
        .join(EventTypes, Events.type_id == EventTypes.id)
        .outerjoin(EventSubTypes, Events.sub_type_id == EventSubTypes.id)
        .join(Teams, Events.team_id == Teams.id)
        .join(Person, Events.player_id == Person.id)
        .join(Possessions, and_(
            Events.match_id == Possessions.match_id,
            Events.possession == Possessions.possession
        ))
        .outerjoin(EventOutcomes, Events.outcome_id == EventOutcomes.id)
        #.filter(Events.match_id == match_id)
        .group_by(Events.team_id, Teams.name, Events.player_id, Person.name, Possessions.playing_style)
        .all()
    )
    event_counts_list = []
    
    for row in event_counts:
        total_passes = row.total_passes or 0
        successful_passes = row.successful_passes or 0
        pass_accuracy = (successful_passes / total_passes) if total_passes > 0 else None
        event_counts_list.append({
                'team_id': row.team_id,
                'team_name': row.team_name,
                'playing_style': row.playing_style,
                'player_name': row.player_name,
                'total_passes': row.total_passes,
                'pass_accuracy': round(pass_accuracy*100, 2) if pass_accuracy is not None else None,
                'total_shots': row.total_shots,
                'total_goals': row.total_goals,
                'corners': row.corners,
                'matches': row.matches,
                'actions': row.actions
            })
    return event_counts_list



@app.get("/player_possible_actions/{player_id}", response_model=list)
def player_possible_actions(player_id: int, db: Session = Depends(get_db)):
        filter_possible_actions = and_(
            Events.match_id == PlayingTimes.match_id,
            or_(
                Events.period > PlayingTimes.start_period,
                and_(
                    Events.period == PlayingTimes.start_period,
                    Events.timestamp >= PlayingTimes.start_time
                )
            ),
            or_(
                Events.period < PlayingTimes.end_period,
                and_(
                    Events.period == PlayingTimes.end_period,
                    Events.timestamp <= PlayingTimes.end_time
                )
            )
        )
        return (
            db.query(
                Events.id,
                Events.match_id,
                Events.player_id
            ).join(PlayingTimes, filter_possible_actions)
            .filter(PlayingTimes.player_id == player_id)
        )