"""create catch records table

Revision ID: 2f4b7a63d8c1
Revises: 9e4c6ba13a25
Create Date: 2026-07-13 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "2f4b7a63d8c1"
down_revision: Union[str, Sequence[str], None] = "9e4c6ba13a25"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "catch_records",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("fish_id", sa.Integer(), nullable=True),
        sa.Column("fish_name", sa.String(), nullable=True),
        sa.Column("fishing_spot", sa.String(), nullable=False),
        sa.Column("total_length", sa.Float(), nullable=True),
        sa.Column("fork_length", sa.Float(), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("image_url", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("modified_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["fish_id"], ["fish.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("catch_records")
