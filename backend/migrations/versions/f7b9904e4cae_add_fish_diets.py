"""add fish diets

Revision ID: f7b9904e4cae
Revises: 56e4dca24669
Create Date: 2026-07-11 00:01:52.813433

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f7b9904e4cae'
down_revision: Union[str, Sequence[str], None] = '56e4dca24669'
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
        (:plant, 'Roślinożerna', NOW(), NOW()),
        (:predator, 'Drapieżna', NOW(), NOW()),
        (:mixed, 'Wszystkożerna', NOW(), NOW())
    """),
    {
        "plant": diet_ids[0],
        "predator": diet_ids[1],
        "mixed": diet_ids[2],
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
        (:plant, 'Herbivore', NOW(), NOW()),
        (:predator, 'Predatory', NOW(), NOW()),
        (:mixed, 'Omnivore', NOW(), NOW())
    """),
    {
        "plant": diet_ids[0],
        "predator": diet_ids[1],
        "mixed": diet_ids[2],
    })


    conn.execute(sa.text("""
        INSERT INTO diets_fish
        (
            fish_id,
            diet_id,
            created_at,
            modified_at
        )
        VALUES
        (10, :plant, NOW(), NOW()),
        (4, :predator, NOW(), NOW()),
        (5, :mixed, NOW(), NOW()),
        (6, :predator, NOW(), NOW())
    """),
    {
        "plant": diet_ids[0],
        "predator": diet_ids[1],
        "mixed": diet_ids[2],
    })


def downgrade():

    conn = op.get_bind()

    conn.execute(sa.text("""
        DELETE FROM diets_fish
    """))

    conn.execute(sa.text("""
        DELETE FROM diets_en_translations
    """))

    conn.execute(sa.text("""
        DELETE FROM diets_pl_translations
    """))

    conn.execute(sa.text("""
        DELETE FROM diets
    """))
