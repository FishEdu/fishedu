"""Expand education materials with types, translations, favorites, and quizzes.

Revision ID: e7d3b9a4c812
Revises: 2c0773a7c644
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "e7d3b9a4c812"
down_revision: Union[str, Sequence[str], None] = "2c0773a7c644"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column("education_materials", sa.Column("material_type", sa.String(length=20), nullable=True))
    op.add_column("education_materials", sa.Column("image_url", sa.String(length=500)))
    op.add_column("education_materials", sa.Column("file_url", sa.String(length=500)))
    op.add_column("education_materials", sa.Column("duration_minutes", sa.Integer()))
    op.add_column("education_materials", sa.Column("is_published", sa.Boolean(), nullable=False, server_default=sa.false()))
    op.execute("UPDATE education_materials SET material_type = 'guide', is_published = TRUE")
    op.alter_column("education_materials", "material_type", nullable=False)
    op.create_check_constraint("ck_education_material_type", "education_materials", "material_type IN ('video', 'pdf', 'course', 'quiz', 'guide')")

    op.create_table(
        "education_material_translations",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("material_id", sa.Integer(), sa.ForeignKey("education_materials.id", ondelete="CASCADE"), nullable=False),
        sa.Column("language", sa.String(length=2), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("content", sa.Text()),
        sa.CheckConstraint("language IN ('pl', 'en')", name="ck_education_material_translation_language"),
        sa.UniqueConstraint("material_id", "language", name="uq_education_material_translation"),
    )
    op.execute("""
        INSERT INTO education_material_translations (material_id, language, title, description)
        SELECT id, 'pl', title, description FROM education_materials
    """)
    op.create_table(
        "education_material_levels",
        sa.Column("material_id", sa.Integer(), sa.ForeignKey("education_materials.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("level", sa.String(length=20), primary_key=True),
        sa.CheckConstraint("level IN ('beginner', 'advanced')", name="ck_education_material_level"),
    )
    op.execute("""
        INSERT INTO education_material_levels (material_id, level)
        SELECT id, 'beginner' FROM education_materials WHERE is_for_novice = TRUE
    """)
    op.execute("""
        INSERT INTO education_material_levels (material_id, level)
        SELECT id, 'advanced' FROM education_materials WHERE is_for_expert = TRUE
    """)

    op.drop_column("education_materials", "is_for_expert")
    op.drop_column("education_materials", "is_for_novice")
    op.drop_column("education_materials", "description")
    op.drop_column("education_materials", "title")

    op.create_table(
        "favorite_education_materials",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("material_id", sa.Integer(), sa.ForeignKey("education_materials.id", ondelete="CASCADE"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.UniqueConstraint("user_id", "material_id", name="uq_favorite_education_material"),
    )
    op.create_table(
        "education_quizzes",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("material_id", sa.Integer(), sa.ForeignKey("education_materials.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("passing_score", sa.Integer(), nullable=False, server_default="0"),
    )
    op.create_table(
        "education_quiz_questions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("quiz_id", sa.Integer(), sa.ForeignKey("education_quizzes.id", ondelete="CASCADE"), nullable=False),
        sa.Column("position", sa.Integer(), nullable=False),
        sa.UniqueConstraint("quiz_id", "position", name="uq_education_quiz_question_position"),
    )
    op.create_table(
        "education_quiz_question_translations",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("question_id", sa.Integer(), sa.ForeignKey("education_quiz_questions.id", ondelete="CASCADE"), nullable=False),
        sa.Column("language", sa.String(length=2), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.CheckConstraint("language IN ('pl', 'en')", name="ck_education_quiz_question_translation_language"),
        sa.UniqueConstraint("question_id", "language", name="uq_education_quiz_question_translation"),
    )
    op.create_table(
        "education_quiz_options",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("question_id", sa.Integer(), sa.ForeignKey("education_quiz_questions.id", ondelete="CASCADE"), nullable=False),
        sa.Column("position", sa.Integer(), nullable=False),
        sa.Column("is_correct", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.UniqueConstraint("question_id", "position", name="uq_education_quiz_option_position"),
    )
    op.create_table(
        "education_quiz_option_translations",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("option_id", sa.Integer(), sa.ForeignKey("education_quiz_options.id", ondelete="CASCADE"), nullable=False),
        sa.Column("language", sa.String(length=2), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.CheckConstraint("language IN ('pl', 'en')", name="ck_education_quiz_option_translation_language"),
        sa.UniqueConstraint("option_id", "language", name="uq_education_quiz_option_translation"),
    )


def downgrade():
    op.add_column("education_materials", sa.Column("title", sa.String(length=255)))
    op.add_column("education_materials", sa.Column("description", sa.Text()))
    op.add_column("education_materials", sa.Column("is_for_novice", sa.Boolean(), nullable=False, server_default=sa.false()))
    op.add_column("education_materials", sa.Column("is_for_expert", sa.Boolean(), nullable=False, server_default=sa.false()))
    op.execute("""
        UPDATE education_materials AS material
        SET title = translation.title, description = translation.description
        FROM education_material_translations AS translation
        WHERE translation.material_id = material.id AND translation.language = 'pl'
    """)
    op.execute("""
        UPDATE education_materials AS material
        SET is_for_novice = EXISTS (
            SELECT 1 FROM education_material_levels AS level
            WHERE level.material_id = material.id AND level.level = 'beginner'
        ), is_for_expert = EXISTS (
            SELECT 1 FROM education_material_levels AS level
            WHERE level.material_id = material.id AND level.level = 'advanced'
        )
    """)
    op.drop_table("education_quiz_option_translations")
    op.drop_table("education_quiz_options")
    op.drop_table("education_quiz_question_translations")
    op.drop_table("education_quiz_questions")
    op.drop_table("education_quizzes")
    op.drop_table("favorite_education_materials")
    op.drop_table("education_material_levels")
    op.drop_table("education_material_translations")
    op.drop_constraint("ck_education_material_type", "education_materials")
    op.drop_column("education_materials", "is_published")
    op.drop_column("education_materials", "duration_minutes")
    op.drop_column("education_materials", "file_url")
    op.drop_column("education_materials", "image_url")
    op.drop_column("education_materials", "material_type")
