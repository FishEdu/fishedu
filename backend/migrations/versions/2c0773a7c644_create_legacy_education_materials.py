"""Create the original education materials table.

This migration restores the revision already recorded in the shared database.

Revision ID: 2c0773a7c644
Revises: 123846c69417
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "2c0773a7c644"
down_revision: Union[str, Sequence[str], None] = "123846c69417"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        "education_materials",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("is_for_novice", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("is_for_expert", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("modified_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
    )


def downgrade():
    op.drop_table("education_materials")
