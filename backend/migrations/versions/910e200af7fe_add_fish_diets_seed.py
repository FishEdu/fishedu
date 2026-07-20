"""Add fish diets seed

Revision ID: 910e200af7fe
Revises: c554f6cc5c4a
Create Date: 2026-07-17 14:11:37.326136

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '910e200af7fe'
down_revision: Union[str, Sequence[str], None] = 'c554f6cc5c4a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():

    conn = op.get_bind()

    result = conn.execute(sa.text("""
        INSERT INTO diets (created_at, modified_at)
        VALUES
        (NOW(), NOW()),
        (NOW(), NOW()),
        (NOW(), NOW())
        RETURNING id
    """))

    diet_ids = [row[0] for row in result.fetchall()]


    conn.execute(sa.text("""
        INSERT INTO diets_pl_translations
        (
            diet_id,
            name,
            created_at,
            modified_at
        )
        VALUES
        (:id1, 'Roślinożerna', NOW(), NOW()),
        (:id2, 'Mięsożerna', NOW(), NOW()),
        (:id3, 'Wszystkożerna', NOW(), NOW())
    """),
    {
        "id1": diet_ids[0],
        "id2": diet_ids[1],
        "id3": diet_ids[2]
    })


    conn.execute(sa.text("""
        INSERT INTO diets_en_translations
        (
            diet_id,
            name,
            created_at,
            modified_at
        )
        VALUES
        (:id1, 'Herbivorous', NOW(), NOW()),
        (:id2, 'Carnivorous', NOW(), NOW()),
        (:id3, 'Omnivorous', NOW(), NOW())
    """),
    {
        "id1": diet_ids[0],
        "id2": diet_ids[1],
        "id3": diet_ids[2]
    })


def downgrade():

    conn = op.get_bind()

    conn.execute(sa.text("""
        DELETE FROM diets_en_translations
    """))

    conn.execute(sa.text("""
        DELETE FROM diets_pl_translations
    """))

    conn.execute(sa.text("""
        DELETE FROM diets
    """))
