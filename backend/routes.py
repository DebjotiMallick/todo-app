from typing import Annotated
from fastapi import APIRouter, HTTPException, Query, status
from sqlmodel import select

from models import Todo, TodoCreate, TodoPublic, TodoUpdate
from db import SessionDep


router = APIRouter()


@router.post("/api/todos/", response_model=TodoPublic, status_code=status.HTTP_201_CREATED)
async def create_todo(todo: TodoCreate, session: SessionDep):
    todo_db = Todo.model_validate(todo)
    session.add(todo_db)
    session.commit()
    session.refresh(todo_db)
    return todo_db


@router.get("/api/todos/", response_model=list[TodoPublic])
async def get_todos(session: SessionDep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100):
    todos = session.exec(select(Todo).offset(offset).limit(limit)).all()
    return todos


@router.get("/api/todo/{todo_id}", response_model=TodoPublic, status_code=status.HTTP_200_OK)
async def get_todo_by_id(todo_id: str, session: SessionDep):
    todo = session.get(Todo, todo_id)
    if not todo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Todo not found')
    return todo


@router.patch("/api/todos/{todo_id}", response_model=TodoPublic, status_code=status.HTTP_200_OK)
async def update_todo(todo_id: int, todo: TodoUpdate, session: SessionDep):
    todo_db = session.get(Todo, todo_id)
    if not todo_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Todo not found')
    todo_data = todo.model_dump(exclude_unset=True)
    todo_db.sqlmodel_update(todo_data)
    session.add(todo_db)
    session.commit()
    session.refresh(todo_db)
    return todo_db


@router.delete("/api/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int, session: SessionDep):
    todo_db = session.get(Todo, todo_id)
    if not todo_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hero not found")
    session.delete(todo_db)
    session.commit()