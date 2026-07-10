"""add content to recipe translations

Revision ID: 56e4dca24669
Revises: 9e4c6ba13a25
Create Date: 2026-07-10 23:41:20.250268

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '56e4dca24669'
down_revision: Union[str, Sequence[str], None] = '9e4c6ba13a25'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():

    op.add_column(
        "recipes_pl_translations",
        sa.Column("content", sa.Text(), nullable=True)
    )

    op.add_column(
        "recipes_en_translations",
        sa.Column("content", sa.Text(), nullable=True)
    )


def downgrade():

    op.drop_column(
        "recipes_pl_translations",
        "content"
    )

    op.drop_column(
        "recipes_en_translations",
        "content"
    )
