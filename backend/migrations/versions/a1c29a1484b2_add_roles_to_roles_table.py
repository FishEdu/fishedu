"""Add roles to roles table

Revision ID: a1c29a1484b2
Revises: 
Create Date: 2026-05-21 19:03:31.184207

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column

from utils import utils as u

# revision identifiers, used by Alembic.
revision: str = 'a1c29a1484b2'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

roles = table(
    'roles',
    column('name', sa.String),
    column('created_at', sa.DateTime),
    column('modified_at', sa.DateTime),
)

def upgrade() -> None:
    utc_date = u.get_utc_date()

    op.execute(
        roles.insert().values([
            {
                'name': 'user',
                'created_at': utc_date,
                'modified_at': utc_date
            },
            {
                'name': 'moderator',
                'created_at': utc_date,
                'modified_at': utc_date
            },
            {
                'name': 'admin',
                'created_at': utc_date,
                'modified_at': utc_date
            }
        ])
    )



def downgrade() -> None:
    pass
