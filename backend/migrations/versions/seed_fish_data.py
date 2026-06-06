"""seed example data"""

from alembic import op
import sqlalchemy as sa

revision = "seed_example_data"
down_revision = "a1c29a1484b2"
branch_labels = None
depends_on = None


from alembic import op
import sqlalchemy as sa


def upgrade():

    conn = op.get_bind()

    result = conn.execute(sa.text("""
        INSERT INTO fishing_areas (created_at, modified_at)
        VALUES
        (NOW(), NOW()),
        (NOW(), NOW()),
        (NOW(), NOW())
        RETURNING id
    """))

    habitat_ids = [row[0] for row in result.fetchall()]

    result = conn.execute(sa.text("""
        INSERT INTO fish (
            min_protection_length,
            max_protection_length,
            is_endangered,
            created_at,
            modified_at
        )
        VALUES
        (30, 80, FALSE, NOW(), NOW()),
        (40, 90, FALSE, NOW(), NOW()),
        (25, 60, TRUE,  NOW(), NOW()),
        (50, 120, FALSE, NOW(), NOW()),
        (20, 55, FALSE, NOW(), NOW())
        RETURNING id
    """))

    fish_ids = [row[0] for row in result.fetchall()]

    conn.execute(sa.text("""
        INSERT INTO fish_pl_translations (
            fish_id, habitat_id, name, description,
            appearance, feeding_places, preferences, handling,
            created_at, modified_at
        )
        VALUES
        (:fish1, :hab1, 'Pstrąg', 'Ryba górskich rzek',
         'smukła z plamkami', 'rzeki górskie',
         'zimna czysta woda', 'delikatna', NOW(), NOW()),

        (:fish2, :hab2, 'Karp', 'Ryba stawowa',
         'masywne ciało', 'stawy',
         'ciepła woda', 'łatwa', NOW(), NOW()),

        (:fish3, :hab3, 'Szczupak', 'Drapieżnik',
         'długi i ostry', 'jeziora',
         'spokojna woda', 'trudna', NOW(), NOW())
    """), {
        "fish1": fish_ids[0],
        "fish2": fish_ids[1],
        "fish3": fish_ids[2],
        "hab1": habitat_ids[0],
        "hab2": habitat_ids[1],
        "hab3": habitat_ids[2],
    })

    conn.execute(sa.text("""
        INSERT INTO fish_en_translations (
            fish_id, habitat_id, name, description,
            appearance, feeding_places, preferences, handling,
            created_at, modified_at
        )
        VALUES
        (:fish1, :hab1, 'Trout', 'Mountain river fish',
         'slim with spots', 'rivers',
         'cold clean water', 'delicate', NOW(), NOW()),

        (:fish2, :hab2, 'Carp', 'Common freshwater fish',
         'thick body', 'ponds',
         'warm water', 'easy', NOW(), NOW())
    """), {
        "fish1": fish_ids[0],
        "fish2": fish_ids[1],
        "hab1": habitat_ids[0],
        "hab2": habitat_ids[1],
    })


def downgrade():
    conn = op.get_bind()

    conn.execute("DELETE FROM fish_en_translations")
    conn.execute("DELETE FROM fish_pl_translations")
    conn.execute("DELETE FROM fish")
    conn.execute("DELETE FROM fishing_areas")