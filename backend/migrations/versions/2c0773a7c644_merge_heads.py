"""merge heads

Revision ID: 2c0773a7c644
Revises: seed_eco_tips, 9e4c6ba13a25
Create Date: 2026-07-20 19:45:26.914944

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2c0773a7c644'
down_revision: Union[str, Sequence[str], None] = ('seed_eco_tips', '9e4c6ba13a25')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
