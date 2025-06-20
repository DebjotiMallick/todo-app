from sqlmodel import Field, Session, SQLModel, create_engine, select

class TodoBase(SQLModel):
    title: str = Field(index=True)
    description: str | None = Field(default=None)
    completed: bool

class Todo(TodoBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    
class TodoPublic(TodoBase):
    id: int
    
class TodoCreate(TodoBase):
    pass

class TodoUpdate(TodoBase):
    title: str
    description: str | None = None
    completed: bool