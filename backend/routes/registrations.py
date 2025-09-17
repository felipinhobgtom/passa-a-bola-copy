# routes/registrations.py

@router.post("/tournaments/{tournament_id}/teams", response_model=Team)
def create_team_for_tournament(
    tournament_id: str,
    team_name: str = Body(..., embed=True),
    current_user: UserInDB = Depends(get_current_user) # Deve ser jogadora
):
    # Lógica para criar um time, definir o usuário como capitão e adicioná-lo à lista de jogadores
    pass

@router.post("/teams/{team_id}/join")
def join_team(team_id: str, current_user: UserInDB = Depends(get_current_user)):
    # Lógica para adicionar um jogador a um time, se não estiver cheio
    pass

@router.post("/teams/{team_id}/leave")
def leave_team(team_id: str, current_user: UserInDB = Depends(get_current_user)):
    # Lógica para remover um jogador de um time
    # **Gatilho**: Após remover, verificar a fila (primeiro do time, depois do torneio)
    # e adicionar o próximo da fila à vaga aberta. Disparar notificação.
    pass

@router.post("/tournaments/{tournament_id}/queue")
def join_tournament_queue(tournament_id: str, current_user: UserInDB = Depends(get_current_user)):
    # Adiciona o usuário à fila geral do torneio
    pass