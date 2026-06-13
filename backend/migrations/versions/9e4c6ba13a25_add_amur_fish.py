"""add amur fish

Revision ID: 9e4c6ba13a25
Revises: seed_example_data
Create Date: 2026-06-10 10:53:04.004327

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9e4c6ba13a25'
down_revision: Union[str, Sequence[str], None] = 'seed_example_data'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# TODO: Fix id to use ids from the database
def upgrade():
    conn = op.get_bind()

    result = conn.execute(sa.text("""
        INSERT INTO fish (
            min_protection_length,
            max_protection_length,
            is_endangered,
            created_at,
            modified_at
        )
        VALUES (
            40,
            NULL,
            FALSE,
            NOW(),
            NOW()
        )
        RETURNING id
    """))

    fish_id = result.first()[0]

    conn.execute(sa.text("""
        INSERT INTO fish_pl_translations (
            fish_id,
            habitat_id,
            name,
            description,
            appearance,
            feeding_places,
            preferences,
            handling,
            created_at,
            modified_at
        )
        VALUES (
            :fish_id,
            1,
            'Amur',
            'Występuje głównie w jeziorach i zbiornikach zaporowych. Spotykany jest również w rzekach, szczególnie w Wiśle i Odrze. Często zarybia się nim łowiska komercyjne.',
            'Duża ryba karpiowata o wydłużonym ciele.',
            'Płytkie miejsca oraz okolice trzcin.',
            'Żywi się głównie trzciną, ślimakami wodnymi i owadami.',
            'Bardzo delikatna ryba. Wymaga ostrożnego obchodzenia się, używania maty karpiowej oraz odpowiedniego natlenienia przed wypuszczeniem.',
            NOW(),
            NOW()
        )
    """), {"fish_id": fish_id})

    conn.execute(sa.text("""
        INSERT INTO fish_en_translations (
            fish_id,
            habitat_id,
            name,
            description,
            appearance,
            feeding_places,
            preferences,
            handling,
            created_at,
            modified_at
        )
        VALUES (
            :fish_id,
            1,
            'Grass Carp',
            'Commonly found in lakes and reservoirs. It can also be found in rivers, especially the Vistula and Oder. It is frequently stocked in commercial fisheries.',
            'Large elongated carp-like fish.',
            'Shallow areas and spots near reeds.',
            'Feeds mainly on aquatic plants, reeds, water snails and insects.',
            'A very delicate fish. Requires careful handling, the use of an unhooking mat and proper oxygenation before release.',
            NOW(),
            NOW()
        )
    """), {"fish_id": fish_id})


def downgrade():
    conn = op.get_bind()

    result = conn.execute(sa.text("""
        SELECT fish_id
        FROM fish_pl_translations
        WHERE name = 'Amur'
    """))

    row = result.fetchone()

    if row:
        fish_id = row[0]

        conn.execute(sa.text(
            "DELETE FROM fish_en_translations WHERE fish_id = :id"
        ), {"id": fish_id})

        conn.execute(sa.text(
            "DELETE FROM fish_pl_translations WHERE fish_id = :id"
        ), {"id": fish_id})

        conn.execute(sa.text(
            "DELETE FROM fish WHERE id = :id"
        ), {"id": fish_id})