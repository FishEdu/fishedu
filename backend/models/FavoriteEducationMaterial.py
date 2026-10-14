from sqlalchemy import Column, DateTime, ForeignKey, Integer, UniqueConstraint

from database import Base


class FavoriteEducationMaterial(Base):
    __tablename__ = "favorite_education_materials"
    __table_args__ = (UniqueConstraint("user_id", "material_id", name="uq_favorite_education_material"),)

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    material_id = Column(Integer, ForeignKey("education_materials.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, nullable=False)
